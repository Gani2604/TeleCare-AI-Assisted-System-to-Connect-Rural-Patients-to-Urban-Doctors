import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBss5nZXmOUuV4cDSWxUzU85SbordRDX4I";

async function testGemini() {
  try {
    console.log("Initializing Gemini API...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // List available models first
    console.log("Listing available models...");
    const models = await genAI.listModels();
    console.log("Available models:", models);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    console.log("Sending test request...");
    const result = await model.generateContent("Say hello!");
    const response = await result.response;
    console.log("Response:", response.text());
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

testGemini(); 