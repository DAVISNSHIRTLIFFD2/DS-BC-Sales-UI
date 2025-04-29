"use client"

import { useEffect } from "react"
import { EngagementsPage } from "@/components/engagements-page"
import { getLeadById, getEngagementByLeadId } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"
import { useRouter, useSearchParams } from "next/navigation"

export default function Engagements() {
  const { selectedLead, setSelectedLead } = useAppContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get("leadId")

  useEffect(() => {
    // If leadId is provided in URL but no lead is selected, fetch the lead
    if (leadId && !selectedLead) {
      const lead = getLeadById(Number(leadId))
      if (lead) {
        setSelectedLead(lead)
      } else {
        // If lead not found, redirect to engagements list
        router.push("/engagements")
      }
    }
  }, [leadId, selectedLead, setSelectedLead, router])

  // If no lead is selected and no leadId in URL, show a lead selection screen
  if (!selectedLead && !leadId) {
    return <EngagementsPage />
  }

  // Fetch engagement data for the selected lead
  const engagement = selectedLead ? getEngagementByLeadId(selectedLead.id) : null

  return <EngagementsPage lead={selectedLead} engagement={engagement} />
}
