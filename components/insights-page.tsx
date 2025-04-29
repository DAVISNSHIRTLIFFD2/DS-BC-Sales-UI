"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/ui/page-header"
import { ExportButton } from "@/components/ui/export-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { generateReportPDF } from "@/lib/pdf-service"

interface InsightsPageProps {
  data: any
}

// Enhanced lead source data with more realistic sources
const enhancedLeadSourceData = [
  { name: "Website", value: 30, color: "#3b82f6" },
  { name: "Referrals", value: 25, color: "#10b981" },
  { name: "Social Media", value: 20, color: "#6366f1" },
  { name: "Walk-ins", value: 15, color: "#f59e0b" },
  { name: "Outbound Calls", value: 10, color: "#ef4444" },
]

export function InsightsPage({ data }: InsightsPageProps) {
  const [period, setPeriod] = useState("last30")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Find the top performing source
  const topSource = [...enhancedLeadSourceData].sort((a, b) => b.value - a.value)[0]

  // Handle download report
  const handleDownloadReport = async (type: string) => {
    setReportType(type)
    setIsGenerating(true)

    try {
      // Get the appropriate data based on report type
      let reportData

      switch (type) {
        case "performance":
          reportData = {
            title: "Performance Report",
            data: data.salesTrendData,
          }
          break
        case "forecast":
          reportData = {
            title: "Forecast Report",
            data: data.productPerformance,
          }
          break
        case "customer":
          reportData = {
            title: "Customer Analysis",
            data: enhancedLeadSourceData,
          }
          break
        default:
          reportData = {
            title: "Sales Report",
            data: data,
          }
      }

      // Generate PDF
      const url = await generateReportPDF(type, reportData)

      // Open the PDF in a new tab
      window.open(url, "_blank")
    } catch (error) {
      console.error(`Error generating ${type} report:`, error)
      setHasError(true)
    } finally {
      setIsGenerating(false)
      setReportType(null)
    }
  }

  // Simulate data loading
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
        title="Sales Insights"
        description="Analyze your Davis & Shirtliff sales performance and identify opportunities."
        breadcrumbs={[
          { href: "/", label: "Dashboard" },
          { href: "/insights", label: "Insights", current: true },
        ]}
        actions={
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <ExportButton data={data} filename="davis_shirtliff_insights_report" />
          </div>
        }
      />

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the insights data. Please try refreshing.
            <Button variant="outline" size="sm" className="ml-2" onClick={refreshData}>
              Refresh Data
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly sales performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) =>
                        `KES ${value >= 1000000 ? (value / 1000000).toFixed(1) + "M" : (value / 1000).toFixed(0) + "K"}`
                      }
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>
              Where your leads are coming from
              {topSource && (
                <span className="block mt-1 font-medium text-sm text-blue-600">
                  Top source: {topSource.name} ({topSource.value}%)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enhancedLeadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {enhancedLeadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regional Performance</CardTitle>
            <CardDescription>Sales distribution by region</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.regionalPerformance}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" tickFormatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
                    <YAxis type="category" dataKey="region" width={100} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.productPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" angle={-45} textAnchor="end" height={70} />
                    <YAxis tickFormatter={(value) => `KES ${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sales Objections Analysis</CardTitle>
              <CardDescription>Common objections and recommended responses</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleDownloadReport("objections")}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.objectionData.map((objection: any, index: number) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{objection.objection}</h3>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {objection.count} instances
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{objection.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
