import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "@/lib/firebase-admin";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!.trim());

const MAX_REQUESTS_PER_MINUTE = 5;

export async function POST(req: NextRequest) {
    try {
        // ── 1. Rate limit ─────────────────────────────────────────────────
        const ip = getRequestIdentifier(req, "courses");
        const rl = rateLimit(ip, { limit: MAX_REQUESTS_PER_MINUTE, windowMs: 60_000 });
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many requests. Wait ${Math.ceil(rl.retryAfterMs / 1000)}s.` },
                { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
            );
        }

        // ── 2. Auth verification ──────────────────────────────────────────
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
        try {
            initAdminApp();
            await getAuth().verifyIdToken(authHeader.slice(7));
        } catch {
            return NextResponse.json({ error: "Invalid session." }, { status: 401 });
        }

        // ── 3. Parse body ─────────────────────────────────────────────────
        let body: any;
        try { body = await req.json(); } catch {
            return NextResponse.json({ error: "Invalid request." }, { status: 400 });
        }

        const { userProfile, careerTitle } = body;

        const profileSummary = userProfile
            ? `Education: ${JSON.stringify(userProfile.education)}, Skills: ${(userProfile.skills || []).map((s: any) => s.name).join(", ")}, Interests: ${(userProfile.interests || []).join(", ")}`
            : "General student";

        const focus = careerTitle ? `for someone pursuing a career in "${careerTitle}"` : "based on their profile";

        // ── 4. Gemini request ─────────────────────────────────────────────
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { maxOutputTokens: 1024 },
        });

        const prompt = `You are a course recommendation expert for Indian students.

Student profile: ${profileSummary}
Recommend courses ${focus}.

Return a JSON array of exactly 8 course recommendations. Each must have:
{
  "id": "unique string like course1, course2...",
  "title": "Course Title",
  "provider": "Platform name (Coursera, Udemy, YouTube, NPTEL, edX, etc.)",
  "level": "Beginner" or "Intermediate" or "Advanced",
  "duration": "e.g. 8 weeks or 20 hours",
  "rating": number from 3.5 to 5.0,
  "price": "Free" or "Paid" or "Free Audit",
  "url": "Real URL to the course",
  "description": "1 sentence describing the course",
  "tags": ["tag1", "tag2"],
  "skillsCovered": ["skill1", "skill2"]
}

Prioritize free resources (NPTEL, YouTube, Coursera audit). Use real, well-known courses that exist.
Return only the raw JSON array, no markdown.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const courses = JSON.parse(cleaned);

        return NextResponse.json({ courses });
    } catch (error: any) {
        console.error("[/api/courses] Error:", error?.message ?? error);
        return NextResponse.json({ courses: [] }, { status: 500 });
    }
}
