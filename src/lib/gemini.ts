// src/lib/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_AI_API_KEY is not set in environment variables");
}

export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Get the Gemini Pro model instance
 * This model supports text generation with streaming
 */
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    // Use 'gemini-2.5-flash' for the best balance of speed and quality.
    // If you want the absolute newest experimental features, use 'gemini-3-flash-preview'.
    model: "gemini-2.5-flash",

    // STRICT SYSTEM INSTRUCTIONS
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: `You are a high-precision AI assistant. 
            Rules for your responses:
            1. **Be Precise:** Answer the user's question directly. Do not start with filler phrases like "Here is the answer."
            2. **Be Concise:** Eliminate fluff. Use bullet points for lists. Avoid long paragraphs.
            3. **Formatting:** Use Markdown (bolding, headers) to make text scannable.
            4. **No Hallucinations:** If you do not know an answer, state that clearly.
            5. **Tone:** Professional, direct, and helpful.
            6. **Limit Length:** Do not give 500-word essays unless explicitly asked to "explain in detail".`,
        },
      ],
    },

    generationConfig: {
      temperature: 0.7, // Keeps answers creative but grounded
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192, // Prevents the "incomplete response" cut-off
    },
  });
};

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[]; // Correct type for SDK v0.1.0+
}

interface AppMessage {
  role: "user" | "assistant";
  content: string;
}

// Helper to format messages for the Google SDK
export const convertToGeminiFormat = (
  messages: AppMessage[],
): ChatMessage[] => {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }], // MUST be an array of objects with a 'text' property
  }));
};
