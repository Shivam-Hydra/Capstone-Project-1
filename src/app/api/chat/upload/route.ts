import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { getAuth } from "firebase-admin/auth";
import { initAdminApp } from "@/lib/firebase-admin";

const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

const GUEST_LIMIT = 50;
const AUTH_LIMIT = 200;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        const isAuthenticated = !!authHeader?.startsWith("Bearer ");

        // ── Rate limiting ─────────────────────────────────────────────────
        const identifier = getRequestIdentifier(req, isAuthenticated ? "upload-auth" : "upload-guest");
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

        // ── Form Data parsing ───────────────────────────────────────────
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File exceeds the 5MB limit." }, { status: 400 });
        }

        const extension = file.name.split('.').pop()?.toLowerCase();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        let text = "";

        // ── PDF Parsing ──────────────────────────────────────────────────
        if (extension === "pdf" || file.type === "application/pdf") {
            try {
                const parser = new pdfParse.PDFParse({ data: buffer });
                const result = await parser.getText();
                text = result.text || "";
            } catch (err: any) {
                console.error("[/api/chat/upload] PDF Parse Error details:", {
                    message: err.message,
                    stack: err.stack,
                    name: err.name,
                    err
                });
                return NextResponse.json({ error: `Failed to parse PDF document: ${err.message || 'Unknown error'}` }, { status: 500 });
            }
        } 
        
        // ── DOCX Parsing ─────────────────────────────────────────────────
        else if (extension === "docx" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            try {
                const data = await mammoth.extractRawText({ buffer });
                text = data.value;
            } catch (err: any) {
                console.error("[/api/chat/upload] DOCX Parse Error details:", err);
                return NextResponse.json({ error: `Failed to parse DOCX document: ${err.message || 'Unknown error'}` }, { status: 500 });
            }
        } 
        
        // ── Unsupported type ─────────────────────────────────────────────
        else {
            return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or DOCX." }, { status: 400 });
        }

        // Clean up extracted text: remove multiple newlines and spaces
        const cleanText = text.replace(/\s+/g, ' ').trim();
        
        if (!cleanText) {
            return NextResponse.json({ error: "Could not extract any readable text from the file." }, { status: 400 });
        }
        
        // Cap parsed length at ~4000 words to ensure it fits comfortably within the context window
        const truncatedText = cleanText.length > 25000 ? cleanText.substring(0, 25000) + "... [Truncated]" : cleanText;

        return NextResponse.json(
            { text: truncatedText },
            { headers: { "X-RateLimit-Remaining": String(rl.remaining) } }
        );

    } catch (error: any) {
        console.error("[/api/chat/upload] Fatal Error:", error?.message ?? error);
        return NextResponse.json({ error: "An unexpected error occurred during processing." }, { status: 500 });
    }
}
