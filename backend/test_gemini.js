const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
    console.log("Testing Gemini API Key...");
    console.log("Key present:", !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: No API Key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Attempting model: gemini-2.0-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success with gemini-2.0-flash:", result.response.text());
    } catch (error) {
        console.error("Failed with gemini-2.0-flash:", error.message);
    }
};

run();
