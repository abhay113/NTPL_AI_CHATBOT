import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat Assistant - Powered by Google Gemini",
  description:
    "Real-time AI chatbot with streaming responses using Google Gemini AI",
  keywords: ["AI", "chatbot", "Google Gemini", "Next.js", "streaming"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
