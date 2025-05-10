"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check, Download, FileText, Plus, Upload, Wand2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/page-header"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { type Lead, type Proposal, getLeads, getProducts } from "@/utils/data-utils"
import { useState, useEffect } from "react"
import { generateProposalPDF } from "@/utils/pdf-utils"
import { DavisShirtliffProposalTemplate } from "@/components/davis-shirtliff-proposal-template"
import leadsData from "@/data/leads.json";
import proposalsData from "@/data/proposals.json";

interface ProposalsPageProps {
  lead?: Lead | null
  proposal?: Proposal | null
  proposals?: Proposal[]
  activeTab?: "create" | "manage"
  templateId?: number
}

export function ProposalsPage({ lead, proposal, proposals, ...props }: ProposalsPageProps) {
  const router = useRouter()
  const { setSelectedLead, setSelectedProposal } = useAppContext()
  const [activeTab, setActiveTab] = useState(props.activeTab || (lead ? "create" : "manage"))
  const [selectedClient, setSelectedClient] = useState(lead?._id.toString() || "")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [estimatedValue, setEstimatedValue] = useState("")
  const [notes, setNotes] = useState("")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Get all leads for the client dropdown
  const leads = leadsData

  // Get all products
  const products = getProducts()

  // Templates
  const templates = [
    { id: 1, name: "Water Pumping Solutions", description: "Comprehensive proposal for water pumping systems" },
    { id: 2, name: "Solar Energy Package", description: "Solar panels, batteries, and installation services" },
    { id: 3, name: "Water Treatment Systems", description: "Filtration and purification solutions" },
    { id: 4, name: "Borehole Drilling Package", description: "Complete borehole drilling and equipment installation" },
  ]

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sent</Badge>
      case "viewed":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Viewed</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Handle client selection
  const handleClientChange = (value: string) => {
    setSelectedClient(value)
    const selectedLead = leads.find((l) => l.id.toString() === value)
    if (selectedLead) {
      setSelectedLead({ ...selectedLead, _id: selectedLead.id.toString() })
    }
  }

  // Handle view proposal
  const handleViewProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    const proposalLead = leads.find((l) => l.id === proposal.leadId)
    if (proposalLead) {
      setSelectedLead({ ...proposalLead, _id: proposalLead.id.toString() })
    }
    router.push(`/proposals?proposalId=${proposal.id}&leadId=${proposal.leadId}`)
  }

  // Handle generate PDF
  const handleGeneratePDF = async () => {
    if (!selectedClient) return

    setIsGenerating(true)

    try {
      // Get the selected lead
      const selectedLead = leads.find((l) => l.id.toString() === selectedClient)

      if (!selectedLead) {
        throw new Error("Selected lead not found")
      }

      // Create proposal data
      const proposalData = {
        id: 0,
        name: selectedLead.name,
        leadId: selectedLead.id,
        client: selectedLead.name,
        contact: selectedLead.contact,
        date: new Date().toLocaleDateString(),
        status: "Draft",
        value: estimatedValue || "KES 1,250,000",
        products: ["Lorentz PS2-4000 Solar Pump System", "25kW Solar Panel Array"],
        services: ["Site Assessment and System Design", "Complete Installation and Commissioning"],
        notes: notes || "Customized solution with projected 40% reduction in operational costs."
      }

      // Generate PDF
      const url = await generateProposalPDF(proposalData)
      setPdfUrl(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle template selection if templateId is provided
  useEffect(() => {
    if (props.templateId) {
      // Find the template and set it
      const template = templates.find((t) => t.id === props.templateId)
      if (template) {
        setSelectedTemplate(template.id.toString())
      }
    }
  }, [props.templateId])

  // Define proposalData in the component scope
  const selectedLeadObj = leads.find((l) => l.id.toString() === selectedClient);
  const proposalData = selectedLeadObj ? {
    id: 0,
    name: selectedLeadObj.name,
    leadId: selectedLeadObj.id, // always a number
    client: selectedLeadObj.name,
    contact: selectedLeadObj.contact,
    date: new Date().toLocaleDateString(),
    status: "Draft",
    value: estimatedValue || "KES 1,250,000",
    products: ["Lorentz PS2-4000 Solar Pump System", "25kW Solar Panel Array"],
    services: ["Site Assessment and System Design", "Complete Installation and Commissioning"],
    notes: notes || "Customized solution with projected 40% reduction in operational costs."
  } : undefined;

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Proposals"
        description="Create, manage, and track your Davis & Shirtliff sales proposals."
        breadcrumbs={[
          { href: "/", label: "Dashboard" },
          { href: "/proposals", label: "Proposals", current: true },
        ]}
        actions={
          <Button onClick={() => setActiveTab("create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Proposal
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as "create" | "manage")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="create">Create Proposal</TabsTrigger>
          <TabsTrigger value="manage">Manage Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6 pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Generator</CardTitle>
                <CardDescription>Create a customized proposal for your client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Select value={selectedClient} onValueChange={handleClientChange}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(leads) && leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id.toString()}>
                          {lead.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">Products & Services</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger id="products">
                      <SelectValue placeholder="Select products" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.category}>
                          {product.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Estimated Value</Label>
                  <Input
                    id="value"
                    placeholder="KES 0.00"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any specific requirements or notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={handleGeneratePDF} disabled={isGenerating}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Proposal"}
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview and customize your proposal before sending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[450px] items-center justify-center rounded-md border border-dashed p-4 overflow-auto">
                  {pdfUrl ? (
                    <iframe src={pdfUrl} className="h-full w-full" title="Proposal Preview" />
                  ) : selectedClient ? (
                    <div className="h-full w-full overflow-auto">
                      {proposalData && (
                        <DavisShirtliffProposalTemplate data={proposalData} />
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText className="mx-auto h-10 w-10 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">
                        Select a client and template to preview your proposal
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button className="flex-1">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Send Proposal
                  </Button>
                </div>
                {pdfUrl && (
                  <div className="mt-2">
                    <Button variant="outline" className="w-full" onClick={() => window.open(pdfUrl, "_blank")}>
                      <Download className="mr-2 h-4 w-4" />
                      Download as PDF
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Proposals</CardTitle>
                  <CardDescription>View and manage your recent proposals</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(proposalsData) && proposalsData
                  .filter((proposal) => !isNaN(Number(proposal.leadId)))
                  .map((proposal) => {
                    const normalizedProposal = { ...proposal, leadId: Number(proposal.leadId) };
                    return (
                      <div key={normalizedProposal.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <FileText className="h-5 w-5 text-slate-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{normalizedProposal.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{normalizedProposal.date}</span>
                              <span>•</span>
                              <span>{normalizedProposal.value}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(normalizedProposal.status)}
                          <Button variant="ghost" size="sm" onClick={() => handleViewProposal(normalizedProposal)}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
