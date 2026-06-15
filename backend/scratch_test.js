const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // Try to list models? The SDK might not have a list method exposed easily.
    // Let's try calling gemini-2.5-flash again, but without tool definitions just to see.
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'hello'
    });
    console.log("Success 1.5:", response.text);
  } catch (e) {
    console.error("Error 1.5:", e.message);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hello'
    });
    console.log("Success 2.5:", response.text);
  } catch (e) {
    console.error("Error 2.5:", e.message);
  }
}

run();
