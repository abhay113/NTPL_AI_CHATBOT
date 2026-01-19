// src/app/api/chat/route.ts

import { getGeminiModel } from "@/lib/gemini";
import { NextRequest } from "next/server";

/**
 * POST endpoint for chat messages
 * This endpoint handles streaming responses from Google Gemini AI
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { message, history } = await req.json();

    // Validate the message
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Invalid message format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the Gemini model instance
    const model = getGeminiModel();

    // Create a chat session with history if provided
    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the user message and get streaming result
          const result = await chat.sendMessageStream(message);

          // Stream each chunk of the response
          for await (const chunk of result.stream) {
            const text = chunk.text();

            // Send the chunk as Server-Sent Event format
            const data = `data: ${JSON.stringify({
              type: "content",
              text,
            })}\n\n`;

            controller.enqueue(encoder.encode(data));
          }

          // Send completion signal
          const doneData = `data: ${JSON.stringify({
            type: "done",
          })}\n\n`;
          controller.enqueue(encoder.encode(doneData));

          // Close the stream
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);

          // Send error to client
          const errorData = `data: ${JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * OPTIONS endpoint for CORS preflight requests
 */
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
