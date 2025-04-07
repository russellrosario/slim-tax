"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2, Loader2, FileIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Document = {
  name: string
  path: string
  created_at: string
  size: number
}

export default function DocumentList({ userId }: { userId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.storage.from("documents").list(userId, {
          sortBy: { column: "created_at", order: "desc" },
        })

        if (error) {
          throw error
        }

        if (data) {
          const formattedDocs = data.map((doc) => ({
            name: doc.name,
            path: `${userId}/${doc.name}`,
            created_at: new Date(doc.created_at || "").toLocaleDateString(),
            size: doc.metadata?.size || 0,
          }))
          setDocuments(formattedDocs)
        }
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchDocuments()
    }
  }, [userId, supabase])

  const handleDownload = async (path: string, name: string) => {
    try {
      setActionInProgress(path)
      const { data, error } = await supabase.storage.from("documents").download(path)

      if (error) {
        throw error
      }

      // Create a download link
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading document:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const handleDelete = async (path: string) => {
    try {
      setActionInProgress(path)
      const { error } = await supabase.storage.from("documents").remove([path])

      if (error) {
        throw error
      }

      // Update the documents list
      setDocuments(documents.filter((doc) => doc.path !== path))
    } catch (error) {
      console.error("Error deleting document:", error)
    } finally {
      setActionInProgress(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileIcon className="h-5 w-5 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileIcon className="h-5 w-5 text-blue-500" />
      case "doc":
      case "docx":
        return <FileIcon className="h-5 w-5 text-indigo-500" />
      case "xls":
      case "xlsx":
        return <FileIcon className="h-5 w-5 text-green-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-emerald-600 animate-spin mr-2" />
        <p className="text-emerald-800">Loading documents...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-2" />
        <p>No documents uploaded yet</p>
        <p className="text-sm mt-1">Upload tax documents to get personalized advice</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {getFileIcon(doc.name)}
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal py-0 h-5">
                      {doc.created_at}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal py-0 h-5 bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {formatFileSize(doc.size)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc.path, doc.name)}
                        disabled={actionInProgress === doc.path}
                        className="text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                      >
                        {actionInProgress === doc.path ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.path)}
                        disabled={actionInProgress === doc.path}
                        className="text-gray-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {actionInProgress === doc.path ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

