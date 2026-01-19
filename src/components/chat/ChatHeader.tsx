// src/components/chat/ChatHeader.tsx

"use client";

import { motion } from "framer-motion";
import { MessageSquare, Trash2 } from "lucide-react";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { ConnectionStatus as ConnectionStatusType } from "@/types/chat";

interface ChatHeaderProps {
  connectionStatus: ConnectionStatusType;
  onClearChat: () => void;
  messageCount: number;
}

/**
 * Header component for the chat interface
 * Shows app title, connection status, and clear button
 */
export const ChatHeader = ({
  connectionStatus,
  onClearChat,
  messageCount,
}: ChatHeaderProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Chat Assistant</h1>
            <p className="text-sm text-slate-400">Powered by Google Gemini</p>
          </div>
        </div>

        {/* Right side - Status and actions */}
        <div className="flex items-center gap-3">
          <ConnectionStatus status={connectionStatus} />

          {/* Clear chat button */}
          {messageCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClearChat}
              className="
                flex items-center gap-2 px-3 py-1.5 rounded-lg
                bg-red-500/10 hover:bg-red-500/20 border border-red-500/20
                text-red-400 text-sm font-medium transition-colors
              "
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
