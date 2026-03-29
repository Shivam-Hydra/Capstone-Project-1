import { GoogleGenerativeAI } from "@google/generative-ai";

const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

// Current key index persisted in the server instance to balance load across keys
let currentKeyIndex = 0;

/**
 * Executes a Gemini operation with automatic key rotation on quota exhaustion.
 */
export async function runWithGemini<T>(
  operation: (genAI: GoogleGenerativeAI) => Promise<T>
): Promise<T> {
  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables (GEMINI_API_KEYS).");
  }

  let lastError: any;
  const initialIndex = currentKeyIndex;

  // Try each available key at least once
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const key = keys[currentKeyIndex];
    const keyPrefix = key.slice(0, 10);
    const genAI = new GoogleGenerativeAI(key);

    try {
      // console.log(`[Gemini] Using key ${keyPrefix}... (Index: ${currentKeyIndex})`);
      return await operation(genAI);
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message?.split("{")[0] || error?.message || ""; // Clean up the JSON from error message
      const status = error?.status;

      // Detect quota exceeded or rate limit errors
      // Google API usually returns 429 for rate limit/quota
      const isQuotaError = 
        status === 429 || 
        errorMsg.toLowerCase().includes("quota") || 
        errorMsg.toLowerCase().includes("rate limit") ||
        errorMsg.toLowerCase().includes("429");

      if (isQuotaError) {
        console.warn(`[Gemini] Key ${keyPrefix}... exhausted (Status: ${status}). Switching to next key.`);
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        
        // If we've circled back to the initial key, we've exhausted all keys
        if (currentKeyIndex === initialIndex && attempt > 0) {
          break;
        }
        continue;
      }

      // If it's a different error (e.g. invalid prompt), throw it immediately
      throw error;
    }
  }

  console.error("[Gemini] All API keys have been exhausted.");
  throw lastError;
}
