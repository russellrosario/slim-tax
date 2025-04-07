"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("_dummy_query").select("*").limit(1)

        // This query will fail with a 400 error (relation does not exist), but that means
        // the connection is working - we're just querying a non-existent table
        if (error && error.code === "42P01") {
          setStatus("connected")
        } else if (error && error.code !== "42P01") {
          // If we get a different error, there might be a connection issue
          setStatus("error")
          setErrorMessage(error.message)
        } else {
          setStatus("connected")
        }
      } catch (err) {
        setStatus("error")
        setErrorMessage("Failed to connect to Supabase")
        console.error(err)
      }
    }

    checkConnection()
  }, [])

  if (status === "loading") {
    return (
      <Alert className="mt-4">
        <AlertTitle className="flex items-center">Checking Supabase connection...</AlertTitle>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mt-4">
        <XCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>{errorMessage || "Could not connect to Supabase"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mt-4 border-emerald-200 bg-emerald-50">
      <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
      <AlertTitle className="text-emerald-800">Supabase Connected</AlertTitle>
      <AlertDescription className="text-emerald-700">
        Your application is successfully connected to Supabase
      </AlertDescription>
    </Alert>
  )
}

