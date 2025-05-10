"use client"

import { useEffect, useState } from "react"
import { LeadsPage } from "@/components/leads-page"
import { getLeads } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"
import type { Lead } from "@/utils/data-utils"

export default function Leads() {
  const { setSelectedLead } = useAppContext()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reset selected lead when navigating to leads page
  useEffect(() => {
    setSelectedLead(null)
  }, [setSelectedLead])

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Fetching leads...')
        const data = await getLeads()
        console.log('Leads received:', data)
        setLeads(data)
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError('Failed to fetch leads')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLeads()
  }, [])

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  if (isLoading) {
    return <div className="p-4">Loading leads...</div>
  }

  return <LeadsPage leads={leads} />
}
