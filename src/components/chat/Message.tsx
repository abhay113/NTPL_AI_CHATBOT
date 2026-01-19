// src/components/chat/Message.tsx

"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { User, Bot } from "lucide-react";
import { MessageProps } from "@/types/chat";

/**
 * Individual message component with animations and formatting
 */
export const Message = ({ message, isLatest }: MessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600"
              : "bg-gradient-to-br from-purple-500 to-purple-600"
          }
        `}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}
      >
        {/* Message bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${
              isUser
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md"
                : "bg-slate-700/50 text-slate-100 rounded-bl-md"
            }
          `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}

            {/* Streaming cursor */}
            {message.isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1 h-4 ml-1 bg-current align-middle"
              />
            )}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-slate-500 mt-1 px-1">
          {format(message.timestamp, "h:mm a")}
        </span>
      </div>
    </motion.div>
  );
};
