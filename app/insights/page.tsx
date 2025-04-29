"use client"

import { InsightsPage } from "@/components/insights-page"
import { getInsightsData } from "@/utils/data-utils"

export default function Insights() {
  // Fetch insights data
  const insightsData = getInsightsData()

  return <InsightsPage data={insightsData} />
}
