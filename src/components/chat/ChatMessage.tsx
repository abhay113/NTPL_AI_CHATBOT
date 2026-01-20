// src/components/chat/ChatMessages.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
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
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check scroll position to toggle button visibility
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      // If user is more than 100px away from bottom, show button
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom only when new messages arrive (and user hasn't manually scrolled up far)
  useEffect(() => {
    // You can add a check here: only auto-scroll if user is already near bottom
    // For now, we force scroll on new message to ensure visibility
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. Empty state when no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
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
              <motion.button
                key={prompt}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="
                  block w-full text-left
                  text-sm text-slate-400 px-4 py-2 rounded-lg
                  bg-slate-800/50 border border-slate-700/50
                  hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200
                  transition-all duration-200
                "
              >
                `{prompt}`
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Chat Interface
  return (
    <div className="relative flex-1 min-h-0 overflow-hidden group">
      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* Show typing indicator when loading and last message is not streaming */}
        {isLoading && !messages[messages.length - 1]?.isStreaming && (
          <div className="flex justify-start pl-1">
            <TypingIndicator />
          </div>
        )}

        {/* Invisible scroll anchor */}
        <div ref={messagesEndRef} className="h-px w-full" />
      </div>

      {/* 3. Floating Scroll Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToBottom}
            className="
              absolute bottom-6 right-6 z-20
              p-3 rounded-full shadow-xl
              bg-slate-700/90 text-white 
              border border-slate-600/50
              hover:bg-blue-600 hover:border-blue-500
              backdrop-blur-sm transition-colors
            "
          >
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
