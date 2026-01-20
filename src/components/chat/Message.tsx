"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageProps } from "@/types/chat";

export const Message = ({ message, isLatest }: MessageProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} w-full`}
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
          shadow-md
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
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] lg:max-w-[75%]`}
      >
        <div
          className={`
            px-5 py-4 rounded-2xl shadow-sm
            ${
              isUser
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none"
                : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50"
            }
          `}
        >
          {/* We removed 'prose' because it conflicts with custom styling in small bubbles.
            Instead, we manually style every element below for perfect control.
          */}
          <div className="text-sm md:text-base leading-relaxed break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 1. Paragraphs: Add spacing between blocks
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0">{children}</p>
                ),

                // 2. Headings: Make them pop with color and margin
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-3 mt-4 border-b border-slate-600 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mb-2 mt-4 text-blue-200">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold mb-1 mt-3 text-blue-100">
                    {children}
                  </h3>
                ),

                // 3. Lists: CRITICAL fix for your "Wall of Text" issue
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-3 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="pl-1">{children}</li>,

                // 4. Bold Text: Make sure it stands out
                strong: ({ children }) => (
                  <strong className="font-bold text-white/90">
                    {children}
                  </strong>
                ),

                // 5. Blockquotes: For notes or tips
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-3 bg-slate-900/30 rounded-r text-slate-300 italic">
                    {children}
                  </blockquote>
                ),

                // 6. Tables: Essential for data comparison
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4 rounded-lg border border-slate-600">
                    <table className="min-w-full text-left text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-900/50 font-semibold">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-slate-600/50">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-slate-700/30 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-blue-200">{children}</th>
                ),
                td: ({ children }) => <td className="px-4 py-3">{children}</td>,

                // 7. Links: Make them visible
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>

            {/* Streaming cursor */}
            {message.isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-4 ml-1 bg-blue-400 align-middle rounded-sm"
              />
            )}
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-slate-500 mt-1 px-1">
          {format(new Date(message.timestamp), "h:mm a")}
        </span>
      </div>
    </motion.div>
  );
};
