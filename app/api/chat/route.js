import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const systemInstruction = `You are a legal assistant chatbot specialized in Indian Law. 
Your primary purpose is to provide information about:
1. Indian legal sections (IPC, CrPC, etc.)
2. Bail provisions and eligibility criteria in India.
3. General legal guidance related to the Indian judicial system.

Do NOT provide legal advice for specific cases. Always include a disclaimer that you are an AI and not a substitute for a professional lawyer.
If asked about laws outside India, politely decline and steer the conversation back to Indian law.
Keep your answers concise, accurate, and helpful.`;

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please add it to your .env file." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    let chatHistory = history || [];

    // Gemini requires chat history to start with a user message
    if (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory = chatHistory.slice(1);
    }

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process the request." },
      { status: 500 }
    );
  }
}
