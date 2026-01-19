// src/types/chat.ts

/**
 * Represents a single chat message
 */
export interface Message {
  id: string; // Unique identifier for the message
  role: "user" | "assistant"; // Who sent the message
  content: string; // The actual message text
  timestamp: Date; // When the message was sent
  isStreaming?: boolean; // Whether the message is currently being streamed
}

/**
 * WebSocket connection states
 */
export type ConnectionStatus =
  | "connected" // Successfully connected to WebSocket
  | "connecting" // Attempting to connect
  | "disconnected" // Not connected
  | "reconnecting" // Attempting to reconnect after disconnect
  | "error"; // Connection error occurred

/**
 * Chat state interface for the useChat hook
 */
export interface ChatState {
  messages: Message[]; // Array of all chat messages
  input: string; // Current input field value
  isLoading: boolean; // Whether AI is generating response
  connectionStatus: ConnectionStatus; // Current WebSocket connection status
}

/**
 * Props for chat-related components
 */
export interface ChatComponentProps {
  className?: string; // Optional CSS classes for styling
}

/**
 * Message component props
 */
export interface MessageProps {
  message: Message;
  isLatest?: boolean; // Whether this is the most recent message
}
