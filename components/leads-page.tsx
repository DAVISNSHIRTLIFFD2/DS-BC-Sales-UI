"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/ui/page-header"
import { ExportButton } from "@/components/ui/export-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import type { Lead } from "@/utils/data-utils"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LeadsPageProps {
  leads: Lead[]
}

// Lead status options
const leadStatusOptions = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
  "Nurturing",
  "Follow-up",
  "Hot Lead",
]

export function LeadsPage({ leads }: LeadsPageProps) {
  const router = useRouter()
  const { setSelectedLead } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [leadData, setLeadData] = useState<Lead[]>([])

  // Initialize lead data with the provided leads
  useEffect(() => {
    if (leads && leads.length > 0) {
      setLeadData(leads)
      setFilteredLeads(leads)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      if (!leads) {
        setHasError(true)
      }
    }
  }, [leads])

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "hot lead":
        return <Badge variant="destructive">{status}</Badge>
      case "proposal sent":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
      case "follow-up":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
      case "new lead":
        return <Badge variant="outline">{status}</Badge>
      case "nurturing":
        return <Badge variant="secondary">{status}</Badge>
      case "qualified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
      case "won":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{status}</Badge>
      case "lost":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{status}</Badge>
      case "negotiation":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{status}</Badge>
      case "contacted":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Handle engage button click
  const handleEngageLead = (lead: Lead) => {
    setSelectedLead(lead)
    router.push(`/engagements?leadId=${lead.id}`)
  }

  // Handle send proposal button click
  const handleSendProposal = (lead: Lead) => {
    setSelectedLead(lead)
    router.push(`/proposals?leadId=${lead.id}`)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredLeads(leadData)
      return
    }

    const filtered = leadData.filter(
      (lead) =>
        lead.name.toLowerCase().includes(term) ||
        lead.contact.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term) ||
        lead.region.toLowerCase().includes(term),
    )

    setFilteredLeads(filtered)
  }

  // Handle status change
  const handleStatusChange = (leadId: number, newStatus: string) => {
    // Update the lead status in the state
    const updatedLeads = leadData.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))

    setLeadData(updatedLeads)

    // Also update filtered leads if needed
    if (searchTerm) {
      const updatedFiltered = filteredLeads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      setFilteredLeads(updatedFiltered)
    } else {
      setFilteredLeads(updatedLeads)
    }
  }

  // Get AI suggestion for lead status
  const getAiSuggestion = (lead: Lead): string | null => {
    // This would normally come from an AI model, but for now we'll use some simple logic
    if (lead.score > 90) return "Hot Lead"
    if (lead.score > 80 && lead.status === "New Lead") return "Qualified"
    if (lead.score > 70 && lead.status === "Qualified") return "Proposal Sent"
    if (lead.status === "Proposal Sent" && lead.lastContact.includes("day")) return "Follow-up"
    return null
  }

  // Refresh data
  const refreshData = () => {
    setIsLoading(true)
    setHasError(false)

    // Simulate API call
    setTimeout(() => {
      if (leads) {
        setLeadData(leads)
        setFilteredLeads(leads)
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Lead Management"
        description="View, filter, and manage all your Davis & Shirtliff leads in one place."
        breadcrumbs={[
          { href: "/", label: "Dashboard" },
          { href: "/leads", label: "Leads", current: true },
        ]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        }
      />

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the leads data. Please try refreshing.
            <Button variant="outline" size="sm" className="ml-2" onClick={refreshData}>
              Refresh Data
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>You have {leadData.length} total leads</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ExportButton data={leadData} filename="davis_shirtliff_leads" />
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Sort by
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Score (High to Low)</DropdownMenuItem>
                <DropdownMenuItem>Score (Low to High)</DropdownMenuItem>
                <DropdownMenuItem>Last Contact (Recent)</DropdownMenuItem>
                <DropdownMenuItem>Last Contact (Oldest)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Company Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Company Name (Z-A)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Region</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="font-medium">{lead.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{lead.contact}</span>
                            <span className="text-xs text-muted-foreground">{lead.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{lead.score}</span>
                            <Progress value={lead.score} className="h-2 w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full text-left">
                                      {getStatusBadge(lead.status)}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                      {leadStatusOptions.map((status) => (
                                        <DropdownMenuItem
                                          key={status}
                                          onClick={() => handleStatusChange(lead.id, status)}
                                        >
                                          {status}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to change status</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {getAiSuggestion(lead) && (
                            <div className="mt-1 text-xs text-blue-600 italic">
                              Suggestion: Move to {getAiSuggestion(lead)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{lead.lastContact}</TableCell>
                        <TableCell>{lead.region}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEngageLead(lead)}>
                              Engage
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSendProposal(lead)}>
                                  Send Proposal
                                </DropdownMenuItem>
                                <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {searchTerm ? (
                          <div className="text-muted-foreground">
                            No leads found matching "{searchTerm}". Try a different search term.
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            No leads available. Add a new lead to get started.
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
