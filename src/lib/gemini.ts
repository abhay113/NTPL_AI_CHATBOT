// src/lib/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initialize Google Generative AI with API key from environment variables
 * This is used on the server side only
 */
const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_AI_API_KEY is not set in environment variables");
}

// Create a new instance of GoogleGenerativeAI
export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Get the Gemini Pro model instance
 * This model supports text generation with streaming
 */
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      temperature: 0.9, // Controls randomness (0-1, higher = more creative)
      topK: 1, // Number of highest probability tokens to consider
      topP: 1, // Cumulative probability threshold
      maxOutputTokens: 2048, // Maximum length of response
    },
  });
};

/**
 * Chat configuration for maintaining conversation context
 */
export interface ChatMessage {
  role: "user" | "model";
  parts: string;
}

interface AppMessage {
  role: "user" | "assistant";
  content: string;
}

export const convertToGeminiFormat = (
  messages: AppMessage[],
): ChatMessage[] => {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: msg.content,
  }));
};
