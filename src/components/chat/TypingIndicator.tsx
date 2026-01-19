// src/components/chat/TypingIndicator.tsx

"use client";

import { motion } from "framer-motion";

/**
 * Animated typing indicator shown while AI is thinking
 */
export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 rounded-2xl rounded-bl-md max-w-[80px]"
    >
      {/* Three animated dots */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-slate-400 rounded-full"
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};
