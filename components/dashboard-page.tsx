"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  LightbulbIcon,
  PieChart,
  TrendingUp,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/metric-card"
import { LeadCard } from "@/components/lead-card"
import { NotificationCard } from "@/components/notification-card"
import { PageHeader } from "@/components/ui/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import type { Lead } from "@/utils/data-utils"
import { ExportButton } from "@/components/ui/export-button"
import { useState, useEffect } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

interface DashboardPageProps {
  leads: Lead[]
  insights: any
}

export function DashboardPage({ leads, insights }: DashboardPageProps) {
  const router = useRouter()
  const { setSelectedLead } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Format the current date
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Get top leads (highest score)
  const topLeads = leads ? [...leads].sort((a, b) => b.score - a.score).slice(0, 4) : []

  // Handle engage button click
  const handleEngageLead = (lead: Lead) => {
    setSelectedLead(lead)
    router.push(`/engagements?leadId=${lead.id}`)
  }

  // Handle view all leads click
  const handleViewAllLeads = () => {
    router.push("/leads")
  }

  // Handle view insights click
  const handleViewInsights = () => {
    router.push("/insights")
  }

  // Refresh data
  const refreshData = () => {
    setIsLoading(true)
    setHasError(false)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, John. Here's your sales overview."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              {formattedDate}
            </Button>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                3
              </span>
            </Button>
          </>
        }
      />

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the dashboard data. Please try refreshing.
            <Button variant="outline" size="sm" className="ml-2" onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Conversion Rate"
          value={insights.metrics.conversionRate.value}
          change={insights.metrics.conversionRate.change}
          trend={insights.metrics.conversionRate.trend}
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Leads Scored"
          value={insights.metrics.leadsScored.value}
          change={insights.metrics.leadsScored.change}
          trend={insights.metrics.leadsScored.trend}
          icon={<Users className="h-4 w-4 text-blue-500" />}
        />
        <MetricCard
          title="Avg. Response Time"
          value={insights.metrics.responseTime.value}
          change={insights.metrics.responseTime.change}
          trend={insights.metrics.responseTime.trend}
          icon={<Clock className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Pipeline Value"
          value={insights.metrics.pipelineValue.value}
          change={insights.metrics.pipelineValue.change}
          trend={insights.metrics.pipelineValue.trend}
          icon={<DollarSign className="h-4 w-4 text-green-500" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top Leads to Prioritize Today</CardTitle>
              <CardDescription>Based on AI scoring and engagement metrics</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleViewAllLeads}>
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <ErrorBoundary>
                  {topLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onEngage={() => handleEngageLead(lead)} />
                  ))}
                </ErrorBoundary>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Personalized insights for your sales process</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <NotificationCard
                  icon={<LightbulbIcon className="h-5 w-5 text-yellow-500" />}
                  title="Follow up with Mwangi Irrigation"
                  description="Their engagement with solar pump options increased by 15% after your last email."
                  time="Just now"
                />
                <NotificationCard
                  icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                  title="Proposal optimization"
                  description="Add water treatment case studies to increase conversion probability by 23%."
                  time="2 hours ago"
                />
                <NotificationCard
                  icon={<PieChart className="h-5 w-5 text-purple-500" />}
                  title="Lead scoring update"
                  description="3 leads interested in borehole drilling have moved to 'Hot' status."
                  time="Yesterday"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Tabs defaultValue="performance">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>
            <ExportButton data={insights} filename="davis_shirtliff_sales_report" />
          </div>

          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Monthly overview of your sales metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-[300px] w-full bg-slate-50 flex items-center justify-center rounded-md">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-10 w-10 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">Performance chart visualization</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleViewInsights}>
                        View Detailed Insights
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead progression through your sales pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-[300px] w-full bg-slate-50 flex items-center justify-center rounded-md">
                    <div className="text-center">
                      <PieChart className="mx-auto h-10 w-10 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">Conversion funnel visualization</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleViewInsights}>
                        View Detailed Insights
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>How leads are interacting with your communications</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-[300px] w-full bg-slate-50 flex items-center justify-center rounded-md">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-10 w-10 text-slate-400" />
                      <p className="mt-2 text-sm text-slate-500">Engagement metrics visualization</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={handleViewInsights}>
                        View Detailed Insights
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
