// src/hooks/useChat.ts

import { useState, useCallback, useRef, useEffect } from "react";
import { Message, ConnectionStatus } from "@/types/chat";

/**
 * Custom hook for managing chat functionality
 * Handles message sending, streaming responses, and connection status
 */
export const useChat = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // Refs for managing streaming
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentStreamingMessageRef = useRef<string>("");

  /**
   * Initialize connection status
   */
  useEffect(() => {
    setConnectionStatus("connected");

    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Send a message and handle streaming response
   */
  const sendMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText || input.trim();

      if (!textToSend || isLoading) return;

      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: textToSend,
        timestamp: new Date(),
      };

      // Add user message to chat
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      // Create placeholder for AI response
      const aiMessageId = `assistant-${Date.now()}`;
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();
      currentStreamingMessageRef.current = "";

      try {
        // Prepare history for context (last 10 messages)
        const history = messages.slice(-10).map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: msg.content,
        }));

        // Call the API endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: textToSend,
            history,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Read the streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          // Process each line
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "content") {
                  // Append text to streaming message
                  currentStreamingMessageRef.current += data.text;

                  // Update the AI message with new content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? {
                            ...msg,
                            content: currentStreamingMessageRef.current,
                          }
                        : msg,
                    ),
                  );
                } else if (data.type === "done") {
                  // Streaming complete
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMessageId
                        ? { ...msg, isStreaming: false }
                        : msg,
                    ),
                  );
                } else if (data.type === "error") {
                  console.error("Streaming error:", data.message);
                  throw new Error(data.message);
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }
        }
      } catch (error: unknown) {
        console.error("Send message error:", error);

        // Handle abort
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request aborted");
          return;
        }

        // Update message with error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content: "Sorry, I encountered an error. Please try again.",
                  isStreaming: false,
                }
              : msg,
          ),
        );

        setConnectionStatus("error");

        // Reconnect after error
        setTimeout(() => setConnectionStatus("connected"), 3000);
      } finally {
        setIsLoading(false);
        currentStreamingMessageRef.current = "";
        abortControllerRef.current = null;
      }
    },
    [input, isLoading, messages],
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Stop current streaming
   */
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    connectionStatus,
    sendMessage,
    clearMessages,
    stopStreaming,
  };
};
