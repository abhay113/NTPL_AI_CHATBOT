import { useState, useCallback, useRef, useEffect } from "react";
import { Message, ConnectionStatus } from "@/types/chat";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const abortControllerRef = useRef<AbortController | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check API health
   */
  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        setConnectionStatus("connected");
        return true;
      } else {
        setConnectionStatus("disconnected");
        return false;
      }
    } catch (error) {
      console.error("Health check failed:", error);
      setConnectionStatus("disconnected");
      return false;
    }
  }, []);

  /**
   * Initialize connection and set up health checks
   */
  useEffect(() => {
    // Initial health check
    checkHealth();

    // Set up periodic health checks every 30 seconds
    healthCheckIntervalRef.current = setInterval(() => {
      checkHealth();
    }, 30000);

    // Listen for online/offline events
    const handleOnline = () => {
      setConnectionStatus("connecting");
      checkHealth();
    };

    const handleOffline = () => {
      setConnectionStatus("disconnected");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
      }
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkHealth]);

  /**
   * Send a message with retry logic
   */
  const sendMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText || input.trim();

      if (!textToSend || isLoading || connectionStatus !== "connected") {
        if (connectionStatus !== "connected") {
          alert("❌ No connection. Please wait for reconnection.");
        }
        return;
      }

      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: textToSend,
        timestamp: new Date(),
      };

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

      abortControllerRef.current = new AbortController();
      let accumulatedContent = "";
      let retryCount = 0;
      const MAX_RETRIES = 3;

      /**
       * Attempt to send message with retry
       */
      const attemptSend = async () => {
        try {
          const history = messages.slice(-10).map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          }));

          console.log(
            "📤 Sending request (attempt " + (retryCount + 1) + ")...",
          );

          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: textToSend,
              history,
            }),
            signal: AbortSignal.timeout(120000), // 2 minute timeout
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error("No reader available");
          }

          console.log("📥 Starting to read stream...");

          // Process the stream
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log("✅ Stream reading complete");
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.type === "content") {
                    accumulatedContent += data.text;

                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMessageId
                          ? {
                              ...msg,
                              content: accumulatedContent,
                              isStreaming: true,
                            }
                          : msg,
                      ),
                    );

                    // Add streaming delay for visibility
                    await new Promise((resolve) => setTimeout(resolve, 30));
                  } else if (data.type === "done") {
                    console.log("🏁 Stream done");

                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === aiMessageId
                          ? {
                              ...msg,
                              content: accumulatedContent,
                              isStreaming: false,
                            }
                          : msg,
                      ),
                    );
                  } else if (data.type === "error") {
                    throw new Error(data.message);
                  }
                } catch (e) {
                  console.error("⚠️ Parse error:", e);
                }
              }
            }
          }
        } catch (error: unknown) {
          console.error("💥 Send message error:", error);

          // Check if should retry
          if (
            retryCount < MAX_RETRIES &&
            !(error instanceof Error && error.name === "AbortError")
          ) {
            retryCount++;
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            console.log(`🔄 Retrying in ${delay}ms...`);
            setConnectionStatus("reconnecting");
            await new Promise((resolve) => setTimeout(resolve, delay));
            return attemptSend();
          }

          // Final error
          if (error instanceof Error && error.name === "AbortError") {
            console.log("🛑 Request aborted");
            return;
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content:
                      accumulatedContent ||
                      "❌ Failed to get response. Please try again.",
                    isStreaming: false,
                  }
                : msg,
            ),
          );

          setConnectionStatus("error");
          await checkHealth(); // Re-check connection
        }
      };

      await attemptSend();
      setIsLoading(false);
      abortControllerRef.current = null;
    },
    [input, isLoading, messages, connectionStatus, checkHealth],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

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
