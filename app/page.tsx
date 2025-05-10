"use client"

import { useEffect, useState } from "react"
import { DashboardPage } from "@/components/dashboard-page"
import { getLeads, getInsightsData } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"
import type { Lead } from "@/utils/data-utils"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { setSelectedLead } = useAppContext()
  const [leads, setLeads] = useState<Lead[]>([])
  const [insightsData, setInsightsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reset selected lead when navigating to dashboard
  useEffect(() => {
    setSelectedLead(null)
  }, [setSelectedLead])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch leads
        const leadsData = await getLeads()
        setLeads(leadsData)
        
        // Fetch insights
        const insights = await getInsightsData()
        setInsightsData(insights)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <DashboardPage leads={leads} insights={insightsData} />
}
