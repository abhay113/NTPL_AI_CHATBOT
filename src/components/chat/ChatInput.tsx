// src/components/chat/ChatInput.tsx

"use client";

import { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Send, StopCircle } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const MAX_CHARS = 2000;

/**
 * Chat input component with send button and character counter
 */
export const ChatInput = ({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  disabled,
}: ChatInputProps) => {
  /**
   * Handle Enter key press to send message
   * Shift+Enter creates new line
   */
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSend();
      }
    }
  };

  /**
   * Auto-resize textarea based on content
   */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInput(value);

      // Auto-resize
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    }
  };

  const charCount = input.length;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-slate-800/80 backdrop-blur-xl border-t border-slate-700/50 px-6 py-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          {/* Text input area */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              placeholder={
                disabled
                  ? "Waiting for connection..."
                  : "Type your message... (Shift+Enter for new line)"
              }
              disabled={disabled}
              rows={1}
              className="
                w-full bg-slate-700/50 text-white placeholder-slate-400
                rounded-2xl px-4 py-3 pr-20 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
              style={{
                minHeight: "52px",
                maxHeight: "150px",
              }}
            />

            {/* Character counter */}
            {charCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                  absolute right-16 bottom-3 text-xs font-medium
                  ${isNearLimit ? "text-orange-400" : "text-slate-400"}
                `}
              >
                {charCount}/{MAX_CHARS}
              </motion.div>
            )}
          </div>

          {/* Send/Stop button */}
          <motion.button
            whileHover={{ scale: isLoading || !input.trim() ? 1 : 1.05 }}
            whileTap={{ scale: isLoading || !input.trim() ? 1 : 0.95 }}
            onClick={isLoading ? onStop : onSend}
            disabled={!isLoading && (!input.trim() || disabled)}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${
                isLoading
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : input.trim() && !disabled
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Helper text */}
        {!disabled && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-slate-500 mt-2 text-center"
          >
            Press Enter to send • Shift+Enter for new line
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
