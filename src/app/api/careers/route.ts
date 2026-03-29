import { NextRequest, NextResponse } from "next/server";
import { runWithGemini } from "@/lib/gemini";
import { rateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "@/lib/firebase-admin";


const MAX_REQUESTS_PER_MINUTE = 5; // career gen is heavier

export async function POST(req: NextRequest) {
    try {
        // ── 1. Rate limit ─────────────────────────────────────────────────
        const ip = getRequestIdentifier(req, "careers");
        const rl = rateLimit(ip, { limit: MAX_REQUESTS_PER_MINUTE, windowMs: 60_000 });

        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many requests. Please wait ${Math.ceil(rl.retryAfterMs / 1000)} seconds.` },
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
            return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
        }

        // ── 3. Parse + validate ───────────────────────────────────────────
        let body: any;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
        }

        const { userProfile } = body;

        const profileSummary = userProfile
            ? `Education: ${JSON.stringify(userProfile.education)}, Skills: ${(userProfile.skills || []).map((s: any) => s.name).join(", ")}, Interests: ${(userProfile.interests || []).join(", ")}`
            : "General student, no specific profile";

        const prompt = `Based on this student profile: ${profileSummary}

Return a JSON array of exactly 6 career recommendations. Each career must have these exact fields:
{
  "id": "unique string like c1, c2...",
  "title": "Career Title",
  "description": "2 sentence description",
  "domain": "Domain like Technology, Finance, Healthcare...",
  "matchScore": number between 60-99,
  "matchReason": "1 sentence why this matches their profile",
  "salaryRange": { "min": number in INR, "max": number in INR, "currency": "INR" },
  "outlook": "Growing" or "Stable" or "Declining",
  "requiredSkills": ["skill1", "skill2", "skill3"]
}

Important: Return only the raw JSON array, no markdown code blocks, no explanation.`;

        // ── 4. Build Gemini request ───────────────────────────────────────
        const text = await runWithGemini(async (genAI) => {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { maxOutputTokens: 1024 },
            });
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        });

        // Strip any accidental markdown wrapping
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const careers = JSON.parse(cleaned);

        return NextResponse.json({ careers });
    } catch (error: any) {
        console.error("[/api/careers] Error:", error?.message ?? error);
        return NextResponse.json({ careers: [] }, { status: 500 });
    }
}
