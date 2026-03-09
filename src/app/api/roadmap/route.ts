import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "@/lib/firebase-admin";
import { Roadmap } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!.trim());

const SYSTEM_INSTRUCTION = `You are CareerAI, an expert career guidance assistant for the Indian market.
Generate a detailed, highly practical, and actionable step-by-step roadmap for a specific career.

You MUST respond with a single valid JSON object representing a Roadmap — no markdown, no extra text, just JSON — with this exact structure:
{
  "title": "Comprehensive Name of the Roadmap",
  "description": "2-3 sentences max on the journey to achieving this career.",
  "steps": {
    "shortTerm": [
      {
        "id": "s1",
        "title": "Clear Actionable Title",
        "description": "1 sentence description of the step.",
        "status": "Pending",
        "type": "Learn" // MUST be exactly one of: "Learn", "Build", "Certify", "Apply"
      }
    ],
    "midTerm": [ ... ],
    "longTerm": [ ... ]
  }
}

Rules:
- Provide exactly 3 shortTerm, 3 midTerm, and 2 longTerm steps.
- Make the steps highly specific to the provided career.
- Return ONLY the JSON object. No markdown code fences. No extra explanation.`;

const GUEST_LIMIT = 5;
const AUTH_LIMIT = 20;

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        const isAuthenticated = !!authHeader?.startsWith("Bearer ");

        const identifier = getRequestIdentifier(req, isAuthenticated ? "roadmap-auth" : "roadmap-guest");
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

        if (isAuthenticated) {
            try {
                initAdminApp();
                await getAuth().verifyIdToken(authHeader!.slice(7));
            } catch {
                return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
            }
        }

        let body: any;
        try { body = await req.json(); }
        catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

        const { careerId, careerTitle, careerDescription } = body;

        if (!careerId || !careerTitle) {
            return NextResponse.json({ error: "careerId and careerTitle are required." }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION,
            generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
        });

        const prompt = `Generate a detailed roadmap for the career: "${careerTitle}". \nContext: ${careerDescription || "No specific context provided."}`;
        
        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        let parsed: Partial<Roadmap>;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            return NextResponse.json({ error: "AI returned invalid data. Please try again." }, { status: 500 });
        }

        if (!parsed.title || !parsed.description || !parsed.steps) {
            return NextResponse.json({ error: "AI returned unexpected structure. Please try again." }, { status: 500 });
        }

        const fullRoadmap: Roadmap = {
            id: `rm_${careerId}_${Date.now()}`,
            careerId: careerId,
            title: parsed.title,
            description: parsed.description,
            steps: parsed.steps
        };

        return NextResponse.json({ roadmap: fullRoadmap }, { headers: { "X-RateLimit-Remaining": String(rl.remaining) } });
    } catch (error: any) {
        console.error("[/api/roadmap] Error:", error?.message ?? error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
