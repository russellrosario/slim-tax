# Slim Tax - Application Specification

## 1. Overview

Slim Tax is a Next.js web application designed to assist users with tax planning and strategy. It allows authenticated users to upload tax-related documents and interact with an AI assistant for personalized advice. The application uses Supabase for backend services, including authentication and file storage.

## 2. Technology Stack

* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript
* **UI Library**: React 19
* **Styling**: Tailwind CSS
* **Components**: shadcn/ui
* **Backend**: Supabase (Auth, Storage)
* **Package Manager**: pnpm (implied by `pnpm-lock.yaml`)

## 3. Environment Configuration

* File: `.env.local`
* Purpose: Stores Supabase credentials required for connecting to the backend.

```local
# .env.local
NEXT_PUBLIC_SUPABASE_URL=[https://lfzxbiusbsjuhrqnscni.supabase.co](https://lfzxbiusbsjuhrqnscni.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmenhiaXVzYnNqdWhycW5zY25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTcyNDQsImV4cCI6MjA1OTU3MzI0NH0.M4HPo_VWZ6g804HfPCCH-zDCE1xyONSGl9p743Y4YSA

# Note: These are public keys, safe for client-side exposure.
# Server-side operations requiring elevated privileges would need a SUPABASE_SERVICE_ROLE_KEY (not present in the provided code).
```

## 4. Core Functionality

### 4.1. Authentication

* **Provider**: Supabase Auth
* **Methods**: Email/Password, Google OAuth
* **Flow**:
    1.  User visits `/login` or `/signup`.
    2.  Enters credentials or uses Google OAuth.
    3.  **Email/Password Sign Up (`/signup`)**:
        * Calls `supabase.auth.signUp`.
        * Requires email verification (redirects to `/signup-success`).
        * Email verification link points to `/auth/callback`.
    4.  **Email/Password Login (`/login`)**:
        * Calls `supabase.auth.signInWithPassword`.
        * On success, redirects to `/dashboard`.
    5.  **Google OAuth (Login/Signup)**:
        * Calls `supabase.auth.signInWithOAuth` with provider 'google'.
        * Specifies `redirectTo` as `/auth/callback`.
    6.  **Callback (`/auth/callback`)**:
        * Handles the OAuth code exchange or email verification link.
        * Calls `supabase.auth.exchangeCodeForSession`.
        * Redirects authenticated users to `/dashboard`.
* **Middleware (`middleware.ts`)**:
    * Intercepts requests to defined routes (`matcher`).
    * Checks Supabase session status using server client.
    * Redirects unauthenticated users trying to access protected routes (e.g., `/dashboard`) to `/login`.
    * Redirects authenticated users trying to access auth routes (`/login`, `/signup`) to `/dashboard`.

```ts
// app/auth/callback/route.ts
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(requestUrl.origin + "/dashboard")
}

// app/login/page.tsx (Relevant Logic)
// ... state and imports
const handleLogin = async (e: React.FormEvent) => {
  // ... loading/error handling
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  // ... error handling
  router.push("/dashboard")
  router.refresh()
  // ... finally block
}
const handleGoogleSignIn = async () => {
  // ... loading/error handling
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  // ... error handling
}
// ... JSX

// app/signup/page.tsx (Relevant Logic)
// ... state and imports
const handleSignUp = async (e: React.FormEvent) => {
  // ... validation/loading/error handling
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  })
  // ... error handling
  router.push("/signup-success")
  // ... finally block
}
const handleGoogleSignIn = async () => {
 // ... (same as login)
}
// ... JSX

// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup") || request.nextUrl.pathname === "/"

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  if (isLoggedIn && isAuthRoute && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|auth/callback|api).*)"],
}
```

### 4.2. Dashboard (`/dashboard`)

* **Layout**: Tabbed interface ("Chat with AI", "Documents"). Uses shadcn/ui components extensively (`Tabs`, `Card`, `Button`, `Avatar`, `Input`, `Textarea`, `ScrollArea`, `Badge`, etc.).
* **Data Fetching**: Fetches user data (`supabase.auth.getUser()`) on the client-side to personalize the UI and manage documents/chat.
* **State**: Manages user info, chat messages, input state, loading states (page, uploading, sending message).
* **Navigation**: Includes header with logo, search (placeholder), notifications (placeholder), settings (placeholder), user avatar/email, and sign-out button.
* **Sign Out**: Calls `supabase.auth.signOut()` and redirects to the home page (`/`).

#### 4.2.1. AI Chat

* **UI**: Displays messages from 'user' and 'assistant'. Includes timestamps. Input via `Textarea`, send via `Button`. Uses `ScrollArea` for messages.
* **Functionality**:
    * Sends user message to `/api/chat` endpoint via POST request.
    * Displays AI response received from the API.
    * Handles loading state (`sendingMessage`).
    * Includes a default welcome message.
* **API Interaction**: Fetches from `/api/chat`. See API section for details.

```tsx
// app/dashboard/page.tsx (Chat Logic)
// ... state: messages, input, sendingMessage
// ... useEffect to check user and add welcome message
// ... useEffect to scroll messages

const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim() || sendingMessage) return
  const userMessage: Message = { /*...*/ }
  setMessages((prev) => [...prev, userMessage])
  setInput("")
  setSendingMessage(true)
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    })
    if (!response.ok) throw new Error("Failed to get response")
    const data = await response.json()
    const aiMessage: Message = { role: "assistant", content: data.response, timestamp: new Date() }
    setMessages((prev) => [...prev, aiMessage])
  } catch (error) {
    // ... add error message to chat
  } finally {
    setSendingMessage(false)
  }
}

// ... JSX for Chat UI (TabsContent value="chat")
```

#### 4.2.2. Document Management

* **UI**: Displays a list of uploaded documents (`DocumentList` component). Includes an upload area (`Input type="file"` styled as a dropzone).
* **Storage**: Uses Supabase Storage bucket named "documents".
* **File Path**: Documents are stored under a path specific to the user ID (`userId/fileName`).
* **Upload**:
    * Handles file selection via input change (`handleFileUpload`).
    * Generates a random file name to avoid conflicts.
    * Calls `supabase.storage.from("documents").upload()`.
    * Updates chat with success/error message.
    * Refreshes the `DocumentList` (indirectly via state change).
* **Listing (`DocumentList` component)**:
    * Fetches documents for the current `userId` using `supabase.storage.from("documents").list()`.
    * Sorts documents by creation date (descending).
    * Displays document name, upload date, and file size.
    * Shows icons based on file extension.
    * Includes download and delete buttons per document.
* **Download**:
    * Calls `supabase.storage.from("documents").download()`.
    * Creates a temporary URL (`URL.createObjectURL`) and triggers browser download.
* **Delete**:
    * Calls `supabase.storage.from("documents").remove()`.
    * Updates the local document list state on success.
* **States**: Handles loading and empty states for the document list.

```tsx
// app/dashboard/page.tsx (Document Upload Logic)
// ... state: uploading
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  try {
    setUploading(true)
    const file = files[0]
    const filePath = `${user.id}/${ /* generated fileName */ }`
    const { error } = await supabase.storage.from("documents").upload(filePath, file)
    if (error) throw error
    // ... add success message to chat
    // ... trigger document list refresh (e.g., by setting uploading state)
  } catch (error) {
    // ... add error message to chat
  } finally {
    setUploading(false)
    // ... clear file input
  }
}
// ... JSX for Documents Tab (TabsContent value="documents") including <DocumentList />

// app/components/document-list.tsx
// ... state: documents, loading, actionInProgress
// ... useEffect fetchDocuments:
const { data, error } = await supabase.storage.from("documents").list(userId, {
  sortBy: { column: "created_at", order: "desc" },
})
// ... handle data/error, format, setDocuments

const handleDownload = async (path: string, name: string) => {
  // ... setActionInProgress
  const { data, error } = await supabase.storage.from("documents").download(path)
  // ... handle error, create URL, trigger download link
  // ... finally setActionInProgress(null)
}

const handleDelete = async (path: string) => {
  // ... setActionInProgress
  const { error } = await supabase.storage.from("documents").remove([path])
  // ... handle error, filter documents state
  // ... finally setActionInProgress(null)
}
// ... helper functions: formatFileSize, getFileIcon
// ... JSX for rendering document cards, loading/empty states
```

## 5. API Endpoints

### 5.1. `/api/chat` (POST)

* **File**: `app/api/chat/route.ts`
* **Purpose**: Handles chat messages from the user and returns an AI response.
* **Authentication**: Checks for a valid Supabase session. Returns 401 Unauthorized if no session exists.
* **Request Body**: Expects JSON `{ "message": "user's input string" }`.
* **Response Body**: Returns JSON `{ "response": "AI's response string" }` on success, or `{ "error": "error message" }` on failure.
* **Current Implementation**:
    * **Mock AI**: Does *not* call a real AI service.
    * Selects a random pre-defined tax tip from `taxResponses` array.
    * Adds a generic follow-up question.
    * Simulates a 1-second delay.
* **Enhancement**: Replace the mock response logic with a call to an actual AI service (e.g., OpenAI API, Google Gemini API) using the user's message (`message`) as input. Potentially integrate document context if RAG (Retrieval-Augmented Generation) is desired.

```ts
// app/api/chat/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

// Simple tax-related responses for demonstration
const taxResponses = [ /* ... array of strings ... */ ]

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message } = await request.json() // User message (currently unused by mock)

    // --- TODO: Replace Mock Logic ---
    // In a real application, call an AI service here with 'message'
    const randomResponse = taxResponses[Math.floor(Math.random() * taxResponses.length)]
    const personalizedResponse = `${randomResponse} Would you like more specific advice about your tax situation?`
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
    // --- End TODO ---

    return NextResponse.json({ response: personalizedResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
```

## 6. Frontend Components

### 6.1. Pages

* `/` (`app/page.tsx`): Landing/Marketing page. Introduces the app, highlights features, and directs users to Login/Sign Up.
* `/login` (`app/login/page.tsx`): Login form (Email/Password, Google OAuth).
* `/signup` (`app/signup/page.tsx`): Sign up form (Email/Password, Google OAuth). Includes terms agreement checkbox.
* `/dashboard` (`app/dashboard/page.tsx`): Main application interface after login (Chat, Documents).
* `/signup-success` (`app/signup-success/page.tsx`): Page shown after successful email/password signup, prompting the user to check their email for verification.
* `/auth/callback` (`app/auth/callback/route.ts`): Server-side route handler for authentication callbacks.
* `/dashboard/loading.tsx`: Basic loading component (currently returns null, potentially for future use with Suspense).

### 6.2. Custom Components

* `app/components/document-list.tsx`: Renders the list of user documents fetched from Supabase Storage. Handles download and delete actions.
* `app/components/supabase-status.tsx`: Checks and displays the connection status to Supabase. Uses a dummy query to test connectivity.

### 6.3. UI Components (`components/ui/`)

* Standard shadcn/ui components generated via CLI.
* Provides building blocks like `Button`, `Card`, `Input`, `Tabs`, `Avatar`, `Dialog`, `Tooltip`, etc.
* Customized styling via Tailwind CSS (`tailwind.config.ts`, `globals.css`).

## 7. Supabase Integration

* **Client Utility (`utils/supabase/client.ts`)**: Creates a Supabase client instance for use in client-side components (`"use client"`). Uses public environment variables.
* **Server Utility (`utils/supabase/server.ts`)**: Creates a Supabase client instance for use in server-side contexts (Server Components, Route Handlers, Middleware). Manages cookies for session handling. Uses public environment variables.
* **Auth**: Used for user sign-up, sign-in, sign-out, session management, and retrieving user data.
* **Storage**: Used for uploading, listing, downloading, and deleting user documents in the `documents` bucket. Access control is likely configured via Supabase RLS policies (not shown in code, but essential for security).

```ts
// utils/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// utils/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import type { cookies } from "next/headers"
export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set({ name, value, ...options }),
      remove: (name: string, options: any) => cookieStore.set({ name, value: "", ...options }),
    },
  })
}
```

## 8. Styling

* **Primary Tool**: Tailwind CSS
* **Configuration**: `tailwind.config.ts` defines theme colors (including custom `sidebar`, `chart` palettes), spacing, animations (`accordion-up`, `accordion-down`), etc. Extends base Tailwind configuration.
* **Base Styles**: `app/globals.css` (and potentially `styles/globals.css` - likely duplication) includes Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`), base CSS variables for light/dark themes, and applies base styles (`border-border`, `bg-background`, `text-foreground`) to the body.
* **Utility Class**: `lib/utils.ts` provides a `cn` function (combining `clsx` and `tailwind-merge`) for conditionally merging Tailwind classes.

```ts
// tailwind.config.ts (Excerpt)
const config: Config = {
  darkMode: ["class"],
  content: [ /* ...paths... */ ],
  theme: {
    extend: {
      colors: { /* ...standard + custom colors (sidebar, chart)... */ },
      borderRadius: { /* ...radius definitions... */ },
      keyframes: { /* ...accordion animations... */ },
      animation: { /* ...accordion animations... */ },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

// app/globals.css (Excerpt)
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root { /* ...CSS variables for light theme... */ }
  .dark { /* ...CSS variables for dark theme... */ }
}
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 9. Build & Configuration

* `next.config.mjs`: Configures Next.js build options. Includes settings to ignore ESLint/TypeScript errors during builds and enables experimental build features. Allows merging with a user-defined config (`v0-user-next.config.mjs`).
* `tsconfig.json`: (Not provided, but standard for Next.js TypeScript projects) Configures TypeScript compiler options, paths aliases (`@/*`), included/excluded files.
* `postcss.config.mjs`: Configures PostCSS, primarily enabling the Tailwind CSS plugin.

## 10. Potential Enhancements & TODOs

* **Real AI Integration**: Replace the mock response in `/api/chat` with calls to a genuine language model API (e.g., OpenAI, Gemini).
* **Document Analysis (RAG)**: Enhance the AI chat to use the content of uploaded documents to provide more personalized and context-aware tax advice (Retrieval-Augmented Generation). This would involve parsing documents and integrating their content into the AI prompt or using vector embeddings.
* **Error Handling**: Improve user-facing error messages and potentially add more robust logging.
* **Security**: Implement and review Supabase Row Level Security (RLS) policies for Auth and Storage to ensure users can only access their own data.
* **State Management**: For larger applications, consider a dedicated state management library (e.g., Zustand, Redux Toolkit) instead of relying solely on `useState` and props drilling.
* **Testing**: Add unit, integration, and end-to-end tests.
* **UI/UX**: Implement placeholders/skeletons more consistently during data loading (e.g., in `/dashboard/loading.tsx`). Implement functional Search, Notifications, and Settings features.
* **Code Cleanup**: Remove duplicated CSS file (`styles/globals.css` if `app/globals.css` is used). Refactor large components if needed.
