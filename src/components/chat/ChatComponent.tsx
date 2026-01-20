// src/components/chat/ChatContainer.tsx

"use client";

import { motion } from "framer-motion";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";

/**
 * Main chat container component
 * Orchestrates all chat-related components and functionality
 */
export const ChatContainer = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    connectionStatus,
    sendMessage,
    clearMessages,
    stopStreaming,
  } = useChat();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Header */}
      <ChatHeader
        connectionStatus={connectionStatus}
        onClearChat={clearMessages}
        messageCount={messages.length}
      />

      {/* Messages area */}
      <ChatMessages messages={messages} isLoading={isLoading} />

      {/* Input area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        onStop={stopStreaming}
        isLoading={isLoading}
        disabled={connectionStatus !== "connected"}
      />
    </motion.div>
  );
};
