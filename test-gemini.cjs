// Run: node test-gemini.cjs
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const key = process.env.GEMINI_API_KEY;
console.log("Key loaded:", key ? `${key.slice(0, 10)}...` : "MISSING");

const genAI = new GoogleGenerativeAI(key);

async function main() {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { maxOutputTokens: 128 },
        });
        const result = await model.generateContent("Say hello in one sentence.");
        console.log("SUCCESS:", result.response.text());
    } catch (err) {
        console.error("ERROR MESSAGE:", err.message);
        console.error("STATUS:", err.status);
        console.error("ERROR DETAILS:", JSON.stringify(err.errorDetails ?? err, null, 2));
    }
}

main();
