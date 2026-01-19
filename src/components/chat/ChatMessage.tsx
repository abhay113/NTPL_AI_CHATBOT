// src/components/chat/ChatMessages.tsx

"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Message } from "./Message";
import { TypingIndicator } from "./TypingIndicator";
import { Message as MessageType } from "@/types/chat";

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
}

/**
 * Messages container with auto-scroll and empty state
 */
export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Empty state when no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          {/* Animated sparkle icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Start a Conversation
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Send a message below to begin chatting with the AI assistant. Ask me
            anything!
          </p>

          {/* Example prompts */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">
              Try asking:
            </p>
            {[
              "Explain quantum computing",
              "Write a creative story",
              "Help me learn JavaScript",
            ].map((prompt, index) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="
                  text-sm text-slate-400 px-4 py-2 rounded-lg
                  bg-slate-800/50 border border-slate-700/50
                  hover:border-slate-600/50 transition-colors
                "
              >
                `{prompt}`
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
          />
        ))}

        {/* Show typing indicator when loading and last message is not streaming */}
        {isLoading && !messages[messages.length - 1]?.isStreaming && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
      </AnimatePresence>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};
