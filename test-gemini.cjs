// Run: node --env-file=.env.local test-gemini.cjs (Node 20+)
// Or: npm install -g dotenv && node test-gemini.cjs
const { GoogleGenerativeAI } = require("@google/generative-ai");

try { require("dotenv").config({ path: ".env.local" }); } catch (e) { /* ignore if not installed */ }

const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
console.log(`Found ${keys.length} keys.`);

async function testKey(key, index) {
    console.log(`\n--- Testing Key ${index + 1}: ${key.slice(0, 10)}... ---`);
    const genAI = new GoogleGenerativeAI(key);
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { maxOutputTokens: 64 },
        });
        const result = await model.generateContent("Say 'Key working' in 2 words.");
        console.log("SUCCESS:", result.response.text().trim());
        return true;
    } catch (err) {
        console.error("FAILED:", err.message.split("{")[0]);
        return false;
    }
}

async function main() {
    if (keys.length === 0) {
        console.error("No keys found in environment.");
        return;
    }

    for (let i = 0; i < keys.length; i++) {
        await testKey(keys[i], i);
    }
}

main();
