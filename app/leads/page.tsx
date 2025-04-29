"use client"

import { useEffect } from "react"
import { LeadsPage } from "@/components/leads-page"
import { getLeads } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"

export default function Leads() {
  const { setSelectedLead } = useAppContext()

  // Reset selected lead when navigating to leads page
  useEffect(() => {
    setSelectedLead(null)
  }, [setSelectedLead])

  // Fetch leads data
  const leads = getLeads()

  return <LeadsPage leads={leads} />
}
