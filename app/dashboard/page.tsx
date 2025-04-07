"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Upload,
  LogOut,
  FileText,
  Settings,
  Bell,
  Search,
  Send,
  Sparkles,
  Loader2,
  Shield,
} from "lucide-react"

// Import the SupabaseStatus component
import SupabaseStatus from "../components/supabase-status"
// Import the DocumentList component
import DocumentList from "../components/document-list"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [uploading, setUploading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      } else {
        setUser(user)
        // Add a welcome message
        setMessages([
          {
            role: "assistant",
            content: `Welcome to Slim Tax! I'm your AI tax strategist. How can I help you today?`,
            timestamp: new Date(),
          },
        ])
      }
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Update the handleSendMessage function to use the chat API
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sendingMessage) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSendingMessage(true)

    try {
      // Call the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setSendingMessage(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploading(true)
      const file = files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error } = await supabase.storage.from("documents").upload(filePath, file)

      if (error) {
        throw error
      }

      // Add a message about the successful upload
      const newMessage: Message = {
        role: "assistant",
        content: `Document "${file.name}" uploaded successfully. I'll analyze this and provide tax insights shortly.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])

      // Force a refresh of the document list by triggering a state change
      setUploading(false)
      setTimeout(() => setUploading(false), 100)
    } catch (error) {
      console.error("Error uploading file:", error)

      // Add an error message
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, there was an error uploading "${files[0].name}". Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setUploading(false)
      // Clear the file input
      if (document.getElementById("file-upload")) {
        ;(document.getElementById("file-upload") as HTMLInputElement).value = ""
      }
    }
  }

  const formatTime = (date?: Date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <p className="text-emerald-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white shadow-sm sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Slim Tax</span>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search tax topics..."
                className="w-full bg-gray-50 pl-8 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-medium text-white">
                2
              </span>
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} alt="User avatar" />
                <AvatarFallback className="bg-emerald-100 text-emerald-800">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border p-1 rounded-lg shadow-sm">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="pb-2 border-b bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      AI Tax Strategist
                    </CardTitle>
                    <CardDescription>Get personalized tax advice and strategies</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                              <AvatarFallback className="bg-emerald-100 text-emerald-800">
                                <Sparkles className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className="flex flex-col">
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === "user"
                                  ? "bg-emerald-600 text-white ml-auto rounded-tr-none"
                                  : "bg-gray-100 text-gray-800 rounded-tl-none"
                              }`}
                            >
                              {message.content}
                            </div>
                            <span className="text-xs text-gray-500 mt-1 px-1">{formatTime(message.timestamp)}</span>
                          </div>

                          {message.role === "user" && (
                            <Avatar className="h-8 w-8 ml-2 mt-1">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
                                alt="User"
                              />
                              <AvatarFallback className="bg-emerald-100 text-emerald-800">
                                {user?.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="border-t p-4 bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Textarea
                        placeholder="Ask about tax strategies, deductions, or financial planning..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 resize-none min-h-[60px] max-h-[120px] border-gray-300 focus-visible:ring-emerald-500"
                      />
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 self-end h-10 px-4"
                        disabled={sendingMessage || !input.trim()}
                      >
                        {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="border-gray-200 shadow-md">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Document Management
                </CardTitle>
                <CardDescription>Upload and manage your tax documents securely</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold">Upload tax documents</h3>
                    <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <div className="mt-4">
                      <label htmlFor="file-upload">
                        <Button
                          variant="outline"
                          className="cursor-pointer border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          disabled={uploading}
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Select File"
                          )}
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <h3 className="font-medium mb-4 flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-emerald-600" />
                      Your Documents
                    </h3>
                    {user && <DocumentList userId={user.id} />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <SupabaseStatus />
        </div>
      </main>
    </div>
  )
}

