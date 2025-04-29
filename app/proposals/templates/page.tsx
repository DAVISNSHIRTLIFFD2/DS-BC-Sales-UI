"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { FileText, Plus, Download } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProposalTemplates() {
  const router = useRouter()

  // Sample template data
  const templates = [
    {
      id: 1,
      name: "Water Pumping Solutions",
      description: "Comprehensive proposal for water pumping systems",
      lastUpdated: "2 weeks ago",
      usageCount: 24,
    },
    {
      id: 2,
      name: "Solar Energy Package",
      description: "Solar panels, batteries, and installation services",
      lastUpdated: "1 month ago",
      usageCount: 18,
    },
    {
      id: 3,
      name: "Water Treatment Systems",
      description: "Filtration and purification solutions",
      lastUpdated: "3 days ago",
      usageCount: 32,
    },
    {
      id: 4,
      name: "Borehole Drilling Package",
      description: "Complete borehole drilling and equipment installation",
      lastUpdated: "1 week ago",
      usageCount: 15,
    },
  ]

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Proposal Templates"
        description="Manage and use standardized proposal templates for Davis & Shirtliff products and services."
        breadcrumbs={[
          { href: "/", label: "Dashboard" },
          { href: "/proposals", label: "Proposals" },
          { href: "/proposals/templates", label: "Templates", current: true },
        ]}
        actions={
          <Button onClick={() => router.push("/proposals?activeTab=create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span>{template.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage count:</span>
                  <span>{template.usageCount}</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/proposals?activeTab=create&templateId=${template.id}`)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Use
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
