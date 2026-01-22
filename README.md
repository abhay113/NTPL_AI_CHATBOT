# AI Chat Assistant

A modern, real-time AI chatbot built with **Next.js 16**, **React 19**, and **Google Gemini AI**. Features streaming responses, beautiful UI with Framer Motion animations, and full mobile responsiveness with safe area support.

🌐 **Live Demo:** [https://ntpl-ai-chatbot.vercel.app/](https://ntpl-ai-chatbot.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Components Documentation](#components-documentation)
- [Hooks Documentation](#hooks-documentation)
- [Types Reference](#types-reference)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🤖 **Google Gemini AI Integration** - Powered by Gemini 2.5 Flash model
- 🌊 **Real-time Streaming** - Watch AI responses appear character by character
- 📱 **Mobile Responsive** - Full support for mobile devices with safe area insets
- ✨ **Beautiful Animations** - Smooth transitions using Framer Motion
- 📝 **Markdown Support** - Rich text formatting with tables, code blocks, and more
- 🔄 **Auto-retry Logic** - Automatic reconnection with exponential backoff
- 💾 **Chat History** - Maintains conversation context for better responses
- ⚡ **Health Monitoring** - Real-time connection status indicator
- 📋 **Copy to Clipboard** - Easy copying of AI responses

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1.3 | React framework with App Router |
| [React](https://react.dev/) | 19.2.3 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.0 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 12.27.1 | Animations |
| [Google Generative AI](https://ai.google.dev/) | 0.24.1 | Gemini AI SDK |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 10.1.0 | Markdown rendering |
| [Lucide React](https://lucide.dev/) | 0.562.0 | Icons |
| [date-fns](https://date-fns.org/) | 4.1.0 | Date formatting |

---

## Project Structure

```
ai-chatbot/
├── public/                     # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts    # Chat API endpoint (streaming)
│   │   │   └── health/
│   │   │       └── route.ts    # Health check endpoint
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── favicon.ico
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatComponent.tsx   # Main chat container
│   │   │   ├── ChatHeader.tsx      # Header with status & actions
│   │   │   ├── ChatInput.tsx       # Message input area
│   │   │   ├── ChatMessage.tsx     # Messages list container
│   │   │   ├── Message.tsx         # Individual message bubble
│   │   │   └── TypingIndicator.tsx # AI typing animation
│   │   ├── layout/             # Layout components
│   │   └── ui/
│   │       └── ConnectionStatus.tsx # Connection indicator
│   ├── hooks/
│   │   └── useChat.ts          # Main chat logic hook
│   ├── lib/
│   │   └── gemini.ts           # Gemini AI configuration
│   └── types/
│       └── chat.ts             # TypeScript interfaces
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

## Installation

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, **pnpm**, or **bun**
- **Google AI API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-chatbot.git
   cd ai-chatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_AI_API_KEY` | ✅ Yes | Your Google AI Studio API key for Gemini access |

### Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/api-keys)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env.local` file

---

## Usage

### Basic Usage

1. Open the application in your browser
2. Type your message in the input box at the bottom
3. Press **Enter** or click the **Send** button
4. Watch the AI response stream in real-time

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in message |

### Features

- **Clear Chat**: Click the "Clear" button in the header to reset the conversation
- **Copy Response**: Hover over any AI message and click the copy icon
- **Stop Generation**: Click the stop button while AI is responding to cancel

---

## API Reference

### POST `/api/chat`

Sends a message to the AI and receives a streaming response.

**Request Body:**

```typescript
{
  message: string;           // The user's message
  history?: ChatMessage[];   // Previous conversation history
}
```

**Response:** Server-Sent Events (SSE) stream

```typescript
// Content chunk
data: { "type": "content", "text": "Hello" }

// Completion signal
data: { "type": "done" }

// Error
data: { "type": "error", "message": "Error description" }
```

### GET `/api/health`

Health check endpoint for monitoring connection status.

**Response:**

```typescript
{
  status: "healthy" | "unhealthy";
  timestamp: string;  // ISO 8601 format
  error?: string;     // Only present if unhealthy
}
```

---

## Components Documentation

### `ChatContainer`

**File:** [`src/components/chat/ChatComponent.tsx`](src/components/chat/ChatComponent.tsx)

The main orchestrator component that combines all chat-related components.

**Internal State:** Uses the `useChat` hook for all state management.

---

### `ChatHeader`

**File:** [`src/components/chat/ChatHeader.tsx`](src/components/chat/ChatHeader.tsx)

Displays the app title, connection status, and clear chat button.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `connectionStatus` | `ConnectionStatus` | Current connection state |
| `onClearChat` | `() => void` | Callback to clear all messages |
| `messageCount` | `number` | Number of messages (shows clear button if > 0) |

---

### `ChatInput`

**File:** [`src/components/chat/ChatInput.tsx`](src/components/chat/ChatInput.tsx)

The message input area with send/stop button and character counter.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `input` | `string` | Current input value |
| `setInput` | `(value: string) => void` | Input setter function |
| `onSend` | `() => void` | Send message callback |
| `onStop` | `() => void` | Stop streaming callback |
| `isLoading` | `boolean` | Whether AI is generating |
| `disabled` | `boolean` | Disable input (e.g., when disconnected) |

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| `MAX_CHARS` | `2000` | Maximum characters allowed in input |

---

### `ChatMessages`

**File:** [`src/components/chat/ChatMessage.tsx`](src/components/chat/ChatMessage.tsx)

Container for all messages with auto-scroll and empty state.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `Message[]` | Array of all chat messages |
| `isLoading` | `boolean` | Whether AI is generating |

**Internal State:**

| State | Type | Description |
|-------|------|-------------|
| `showScrollButton` | `boolean` | Whether to show scroll-to-bottom button |

**Refs:**

| Ref | Type | Description |
|-----|------|-------------|
| `messagesEndRef` | `HTMLDivElement` | Scroll anchor at bottom |
| `containerRef` | `HTMLDivElement` | Scrollable container |

---

### `Message`

**File:** [`src/components/chat/Message.tsx`](src/components/chat/Message.tsx)

Individual message bubble with markdown rendering and copy functionality.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `message` | `Message` | The message object to display |
| `isLatest` | `boolean` | Whether this is the most recent message |

**Internal State:**

| State | Type | Description |
|-------|------|-------------|
| `copied` | `boolean` | Whether message was just copied |

---

### `TypingIndicator`

**File:** [`src/components/chat/TypingIndicator.tsx`](src/components/chat/TypingIndicator.tsx)

Animated three-dot indicator shown while AI is thinking.

**Props:** None

---

### `ConnectionStatus`

**File:** [`src/components/ui/ConnectionStatus.tsx`](src/components/ui/ConnectionStatus.tsx)

Visual indicator of the current connection state.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `status` | `ConnectionStatus` | Current connection state |

**Status Configurations:**

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `connected` | Wifi | Green | Successfully connected |
| `connecting` | Loader2 (spinning) | Yellow | Attempting to connect |
| `disconnected` | WifiOff | Red | Not connected |
| `reconnecting` | Loader2 (spinning) | Orange | Attempting to reconnect |
| `error` | AlertCircle | Red | Connection error |

---

## Hooks Documentation

### `useChat`

**File:** [`src/hooks/useChat.ts`](src/hooks/useChat.ts)

The main hook that manages all chat state and logic.

**Returned Values:**

| Value | Type | Description |
|-------|------|-------------|
| `messages` | `Message[]` | Array of all chat messages |
| `input` | `string` | Current input field value |
| `setInput` | `(value: string) => void` | Function to update input |
| `isLoading` | `boolean` | Whether AI is generating a response |
| `connectionStatus` | `ConnectionStatus` | Current connection state |
| `sendMessage` | `(messageText?: string) => Promise<void>` | Send a message |
| `clearMessages` | `() => void` | Clear all messages |
| `stopStreaming` | `() => void` | Stop current AI generation |

**Internal State:**

| State | Type | Initial Value | Description |
|-------|------|---------------|-------------|
| `messages` | `Message[]` | `[]` | All chat messages |
| `input` | `string` | `""` | Current input text |
| `isLoading` | `boolean` | `false` | Loading state |
| `connectionStatus` | `ConnectionStatus` | `"connecting"` | Connection state |

**Internal Refs:**

| Ref | Type | Description |
|-----|------|-------------|
| `abortControllerRef` | `AbortController \| null` | For cancelling requests |
| `healthCheckIntervalRef` | `NodeJS.Timeout \| null` | Health check interval ID |

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| `MAX_RETRIES` | `3` | Maximum retry attempts for failed requests |
| Health check interval | `30000ms` | Time between health checks |
| Request timeout | `120000ms` | Maximum time for a request (2 minutes) |

**Key Functions:**

#### `checkHealth()`
Checks API health by calling `/api/health`. Updates `connectionStatus` based on response.

#### `sendMessage(messageText?: string)`
1. Validates input and connection status
2. Creates user message and adds to state
3. Creates placeholder AI message with `isStreaming: true`
4. Sends request to `/api/chat` with message and last 10 messages as history
5. Processes SSE stream and updates AI message content
6. Handles errors with retry logic (exponential backoff)

#### `clearMessages()`
Resets `messages` array to empty.

#### `stopStreaming()`
Aborts the current request using `AbortController`.

---

## Types Reference

**File:** [`src/types/chat.ts`](src/types/chat.ts)

### `Message`

Represents a single chat message.

```typescript
interface Message {
  id: string;              // Unique identifier (e.g., "user-1642..." or "assistant-1642...")
  role: "user" | "assistant";  // Who sent the message
  content: string;         // The message text (supports Markdown)
  timestamp: Date;         // When the message was sent
  isStreaming?: boolean;   // Whether the message is currently being streamed
}
```

### `ConnectionStatus`

Possible connection states.

```typescript
type ConnectionStatus =
  | "connected"      // Successfully connected to API
  | "connecting"     // Initial connection attempt
  | "disconnected"   // Not connected (offline or API down)
  | "reconnecting"   // Attempting to reconnect after failure
  | "error";         // Connection error occurred
```

### `ChatState`

Full chat state interface (used internally by `useChat`).

```typescript
interface ChatState {
  messages: Message[];           // All chat messages
  input: string;                 // Current input field value
  isLoading: boolean;            // Whether AI is generating
  connectionStatus: ConnectionStatus;  // Current connection state
}
```

### `ChatComponentProps`

Base props for chat components.

```typescript
interface ChatComponentProps {
  className?: string;  // Optional CSS classes
}
```

### `MessageProps`

Props for the Message component.

```typescript
interface MessageProps {
  message: Message;      // The message to display
  isLatest?: boolean;    // Whether this is the most recent message
}
```

### `ChatMessage` (Gemini SDK format)

Format required by Google Generative AI SDK.

```typescript
interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}
```

---

## Styling

### Tailwind CSS Configuration

This project uses **Tailwind CSS v4** with the new CSS-first configuration approach.

**PostCSS Config:** [`postcss.config.mjs`](postcss.config.mjs)

### Global Styles

**File:** [`src/app/globals.css`](src/app/globals.css)

Key style features:

- **Custom Scrollbar**: Styled scrollbars for webkit browsers
- **Smooth Scrolling**: `scroll-behavior: smooth`
- **Hidden Overflow**: Body has `overflow: hidden` to prevent page scroll
- **Custom Animations**: `fadeIn`, `slideUp`, `pulse-slow`

### Color Palette

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Background | Slate 900 | `bg-slate-900` |
| Card Background | Slate 800 | `bg-slate-800` |
| Primary Accent | Blue 500-600 | `from-blue-500 to-blue-600` |
| Secondary Accent | Purple 500-600 | `from-purple-500 to-purple-600` |
| Text Primary | White | `text-white` |
| Text Secondary | Slate 400 | `text-slate-400` |
| Border | Slate 700 | `border-slate-700` |

### Mobile Safe Area

The app supports mobile safe area insets for devices with notches or gesture navigation:

```tsx
// In ChatInput.tsx
style={{
  paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
}}
```

```html
<!-- In layout.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

---

## Deployment

### 🚀 Live Demo

The application is deployed and live at:

**[https://ntpl-ai-chatbot.vercel.app/](https://ntpl-ai-chatbot.vercel.app/)**

<p align="center">
  Made with ❤️ using Next.js and Google Gemini AI
</p>
