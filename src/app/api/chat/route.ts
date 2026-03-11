import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "@/lib/firebase-admin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!.trim());

// System instruction tells Gemini to ALWAYS return valid JSON
// with exactly: analysis, careers[], courses[], followUp
const SYSTEM_INSTRUCTION = `You are CareerAI, an expert career guidance assistant for students and young professionals in India.

CRITICAL RULES:
1. Your recommendations MUST be **Centrally and Directly Related** to the academic subject of the user's degree. 
2. If a user has a specific degree (e.g., Physics, Biology, Law), you MUST suggest careers that are within that field first (e.g., Physicist, Research Scientist in Physics, Lab Assistant, Legal Advisor).
3. **NO GENERIC TECH PIVOTS**: Do NOT suggest roles like "Software Developer", "Data Scientist", or "Full Stack Developer" for non-Computer Science students unless they explicitly express interest in tech.
4. **Discipline First**: At least 3 of your suggested careers MUST be core to the user's specific area of study. Do not give generalist "transferable skill" careers like Sales, Marketing, or generic Management for specialized science/humanities degrees.
5. If the user's degree is "BS Physics", your answers should be about careers in Physics (Aerospace, Optics, Research, Academia, Labs), NOT generic IT.
5. Use Indian salary ranges (INR) for all careers.
6. outlook must be exactly one of: "Growing", "Stable", "Declining"
7. level must be exactly one of: "Beginner", "Intermediate", "Advanced"

You MUST respond with a single valid JSON object — no markdown, no extra text, just JSON — with this exact structure:
{
  "analysis": "2-4 sentences explaining WHY these specific careers fit the user's educational background and skills.",
  "careers": [
    {
      "id": "c1",
      "title": "Career title",
      "description": "2-3 sentence description, highlight why it fits someone with the user's degree",
      "domain": "e.g. Technology / Finance / Education / Research / Healthcare",
      "salaryRange": { "min": 500000, "max": 1500000, "currency": "INR" },
      "outlook": "Growing",
      "requiredSkills": ["Skill A", "Skill B", "Skill C"]
    }
  ],
  "courses": [
    {
      "id": "co1",
      "title": "Course or Certification Name",
      "provider": "e.g. Coursera / NPTEL / Udemy / edX / Internshala",
      "level": "Beginner",
      "duration": "3 months",
      "rating": 4.5,
      "url": "#",
      "tags": ["tag1", "tag2"],
      "skillsCovered": ["Skill 1", "Skill 2"]
    }
  ],
  "followUp": "An optional single follow-up question to help refine advice, or empty string if not needed"
}

Return ONLY the JSON object. No markdown code fences. No extra explanation.`;

const GUEST_LIMIT = 50;
const AUTH_LIMIT = 200;
const MAX_MESSAGE_LENGTH = 30000;
const MAX_HISTORY_MESSAGES = 10;

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        const isAuthenticated = !!authHeader?.startsWith("Bearer ");

        // ── Rate limiting ─────────────────────────────────────────────────
        const identifier = getRequestIdentifier(req, isAuthenticated ? "chat-auth" : "chat-guest");
        const rl = rateLimit(identifier, {
            limit: isAuthenticated ? AUTH_LIMIT : GUEST_LIMIT,
            windowMs: 60 * 60_000,
        });

        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many requests. Please wait ${Math.ceil(rl.retryAfterMs / 1000)}s.` },
                { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
            );
        }

        // ── Verify auth token (optional) ──────────────────────────────────
        if (isAuthenticated) {
            try {
                initAdminApp();
                await getAuth().verifyIdToken(authHeader!.slice(7));
            } catch {
                return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
            }
        }

        // ── Parse body ────────────────────────────────────────────────────
        let body: any;
        try { body = await req.json(); }
        catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

        const { messages, userProfile } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided." }, { status: 400 });
        }

        // Validate messages
        for (const msg of messages) {
            if (!msg.role || !msg.content || typeof msg.content !== "string") {
                return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
            }
            if (msg.role === "user" && msg.content.length > MAX_MESSAGE_LENGTH) {
                return NextResponse.json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars).` }, { status: 400 });
            }
        }

        // ── Build profile context ─────────────────────────────────────────
        let profileContext = "";
        if (userProfile) {
            const edu = userProfile.education || userProfile;
            const skills = (userProfile.skills || []).map((s: any) => s.name ?? s).join(", ") || "not specified";
            const interests = (userProfile.interests || []).join(", ") || "not specified";
            
            profileContext = `\n\nUSER PROFILE CONTEXT (CRITICAL):
- Education Level: ${edu.level || "not specified"}
- Specific Degree: ${edu.degree || edu.content || "not specified"}
- Specialization/Stream: ${edu.stream || "not specified"}
- Skills: ${skills}
- Interests: ${interests}

Note: Your response MUST be specifically tailored to the degree and stream mentioned above.`;
        }

        // ── Build conversation history ─────────────────────────────────────
        // Only keep real user/assistant turns, not the UI greeting.
        // Gemini history must start with user role.
        const cappedMessages = messages.slice(-MAX_HISTORY_MESSAGES);
        const lastMsg = cappedMessages[cappedMessages.length - 1];

        if (lastMsg.role !== "user") {
            return NextResponse.json({ error: "Last message must be from user." }, { status: 400 });
        }

        // All messages before the last one go into history
        const historyMsgs = cappedMessages.slice(0, -1).filter(
            (m: any) => m.role === "user" || m.role === "assistant"
        );

        // Drop leading assistant messages so history starts with user
        const firstUserIdx = historyMsgs.findIndex((m: any) => m.role === "user");
        const validHistory = firstUserIdx >= 0 ? historyMsgs.slice(firstUserIdx) : [];

        const geminiHistory = validHistory.map((m: any) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        // ── Call Gemini with JSON response mode ───────────────────────────
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION + profileContext,
            generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 8192,
                temperature: 0.7,
            },
        });

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(lastMsg.content);
        const rawText = result.response.text();

        // ── Parse the JSON response ───────────────────────────────────────
        let parsed: any;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            console.error("[/api/chat] JSON parse failed. Raw:", rawText.slice(0, 500));
            return NextResponse.json({ error: "AI returned invalid data. Please try again." }, { status: 500 });
        }

        // Validate required fields
        if (!parsed.analysis || !Array.isArray(parsed.careers) || !Array.isArray(parsed.courses)) {
            console.error("[/api/chat] Unexpected JSON structure:", JSON.stringify(parsed).slice(0, 300));
            return NextResponse.json({ error: "AI returned unexpected structure. Please try again." }, { status: 500 });
        }

        return NextResponse.json(
            {
                analysis: parsed.analysis,
                careers: parsed.careers,
                courses: parsed.courses,
                followUp: parsed.followUp || "",
            },
            { headers: { "X-RateLimit-Remaining": String(rl.remaining) } }
        );
    } catch (error: any) {
        console.error("[/api/chat] Error:", error?.message ?? error);
        if (error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("retry")) {
            return NextResponse.json({ error: "AI service is busy. Please wait and try again." }, { status: 429 });
        }
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
