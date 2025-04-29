"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, FileText, MessageSquare, Phone, Send, ThumbsUp, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/ui/page-header"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { type Engagement, type Lead, getLeads } from "@/utils/data-utils"
import { useState } from "react"

interface EngagementsPageProps {
  lead?: Lead | null
  engagement?: Engagement | null
}

export function EngagementsPage({ lead, engagement }: EngagementsPageProps) {
  const router = useRouter()
  const { setSelectedLead } = useAppContext()
  const [message, setMessage] = useState("")

  // If no lead is selected, show a lead selection screen
  if (!lead) {
    const leads = getLeads()

    return (
      <div className="flex flex-col p-6 space-y-6">
        <PageHeader
          title="Engagements"
          description="Select a lead to view or start a conversation"
          breadcrumbs={[
            { href: "/", label: "Dashboard" },
            { href: "/engagements", label: "Engagements", current: true },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col rounded-lg border p-4 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => {
                setSelectedLead(lead)
                router.push(`/engagements?leadId=${lead.id}`)
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40&text=${lead.name.substring(0, 2)}`}
                    alt={lead.name}
                  />
                  <AvatarFallback>{lead.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.contact}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{lead.status}</Badge>
                <span className="text-xs text-muted-foreground">Last contact: {lead.lastContact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim()) return

    // In a real app, this would send the message to the API
    console.log("Sending message:", message)

    // Clear the input
    setMessage("")
  }

  // Handle generate proposal
  const handleGenerateProposal = () => {
    router.push(`/proposals?leadId=${lead.id}`)
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] p-4">
      <div className="flex flex-1 overflow-hidden rounded-lg border">
        <div className="flex w-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40&text=${lead.name.substring(0, 2)}`}
                  alt={lead.name}
                />
                <AvatarFallback>
                  {lead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{lead.name}</h2>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{lead.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lead.contact} - {lead.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chat area */}
            <div className="flex flex-1 flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {engagement?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[80%] gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.name} />
                          <AvatarFallback>{message.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.sender === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* AI suggestions */}
              <div className="border-t bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium text-slate-500">AI SUGGESTIONS</p>
                <div className="flex flex-wrap gap-2">
                  {engagement?.aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto py-1.5 text-xs justify-start"
                      onClick={() => setMessage(suggestion)}
                    >
                      {suggestion}
                      <ThumbsUp className="ml-1.5 h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer info sidebar */}
            <div className="hidden w-80 border-l bg-slate-50 lg:block">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Contact Information</h3>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>{lead.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Lead Information</h3>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Score</span>
                          <Badge variant="outline" className="font-medium text-blue-600">
                            {lead.score}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{lead.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Last Interaction</span>
                          <span className="text-slate-600">{lead.lastContact}</span>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Notes</h3>
                      <p className="mt-2 text-sm text-slate-600">{lead.notes}</p>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" className="w-full" onClick={handleGenerateProposal}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Proposal
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="p-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-500">Interaction History</h3>
                    <div className="space-y-4">
                      {engagement?.history.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="relative mt-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                              <Clock className="h-3 w-3 text-slate-500" />
                            </div>
                            {index < (engagement?.history.length || 0) - 1 && (
                              <div className="absolute bottom-0 left-1/2 top-6 w-px -translate-x-1/2 bg-slate-200" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.action}</p>
                            <p className="text-xs text-slate-500">{item.date}</p>
                            <p className="text-xs text-slate-600">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View Full History
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
