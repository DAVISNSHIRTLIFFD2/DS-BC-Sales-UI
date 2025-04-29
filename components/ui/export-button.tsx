"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, Loader2 } from "lucide-react"
import { exportFile } from "@/utils/pdf-utils"

interface ExportButtonProps extends ButtonProps {
  data: any
  filename?: string
  onExport?: (url: string, format: string) => void
}

export function ExportButton({
  data,
  filename = "export",
  onExport,
  children = "Export",
  ...props
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [format, setFormat] = useState<string | null>(null)

  const handleExport = async (exportFormat: "csv" | "excel" | "pdf") => {
    setFormat(exportFormat)
    setIsExporting(true)

    try {
      const url = await exportFile(data, exportFormat)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename}.${exportFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (onExport) {
        onExport(url, exportFormat)
      }
    } catch (error) {
      console.error("Error exporting file:", error)
    } finally {
      setIsExporting(false)
      setFormat(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} {...props}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting {format?.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {children}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
