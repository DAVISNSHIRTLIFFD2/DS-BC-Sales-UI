"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We apologize for the inconvenience. An error occurred while processing your request.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </a>
        </Button>
      </div>
    </div>
  )
}
