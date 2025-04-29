"use client"

import { useEffect } from "react"
import { DashboardPage } from "@/components/dashboard-page"
import { getLeads, getInsightsData } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"

export default function Home() {
  const { setSelectedLead } = useAppContext()

  // Reset selected lead when navigating to dashboard
  useEffect(() => {
    setSelectedLead(null)
  }, [setSelectedLead])

  // Fetch data
  const leads = getLeads()
  const insightsData = getInsightsData()

  return <DashboardPage leads={leads} insights={insightsData} />
}
