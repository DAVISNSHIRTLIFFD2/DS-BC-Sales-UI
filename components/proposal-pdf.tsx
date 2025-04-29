"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Printer, Eye, Loader2 } from "lucide-react"
import { generateProposalPDF } from "@/lib/pdf-service"
import type { Proposal } from "@/utils/data-utils"

interface ProposalPDFProps {
  proposalData: Proposal
}

export function ProposalPDF({ proposalData }: ProposalPDFProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const url = await generateProposalPDF({
        clientName: proposalData.client,
        clientContact: proposalData.contact,
        date: proposalData.date,
        products: proposalData.products,
        services: proposalData.services,
        totalValue: proposalData.value,
        notes: proposalData.notes,
      })
      setPdfUrl(url)
    } catch (err) {
      console.error("Error generating PDF:", err)
      setError("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-60 w-full items-center justify-center rounded-md border border-dashed">
            {pdfUrl ? (
              <iframe src={pdfUrl} className="h-full w-full" title="Proposal Preview" />
            ) : (
              <div className="text-center">
                {isGenerating ? (
                  <>
                    <Loader2 className="mx-auto h-10 w-10 text-slate-400 animate-spin" />
                    <p className="mt-2 text-sm text-slate-500">Generating PDF...</p>
                  </>
                ) : (
                  <>
                    <FileText className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-500">Click generate to create your proposal PDF</p>
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex w-full gap-2">
            <Button onClick={handleGeneratePDF} disabled={isGenerating} className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>

            {pdfUrl && (
              <>
                <Button variant="outline" onClick={() => window.open(pdfUrl, "_blank")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = pdfUrl
                    link.download = `${proposalData.name.replace(/\s+/g, "_")}.pdf`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
