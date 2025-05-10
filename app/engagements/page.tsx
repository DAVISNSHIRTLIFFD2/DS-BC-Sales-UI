"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/ui/page-header"
import { useAppContext } from "@/context/app-context"
import { Send, Loader2, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Lead } from "@/utils/data-utils"
import { generateProposalPDF } from "@/utils/pdf-utils"

interface Message {
  content: string
  role: "customer" | "sales"
  timestamp: string
}

// Initial dummy conversation from customer's perspective
const dummyMessages: Message[] = [
  {
    content: "Hi, I'm John from Acme Corporation. We're looking for water treatment solutions for our new office building in Westlands.",
    role: "customer",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    content: "Hello John! Thank you for reaching out. I'd be happy to help you with water treatment solutions for your new office building. Could you tell me more about your specific requirements?",
    role: "sales",
    timestamp: new Date(Date.now() - 3500000).toISOString()
  },
  {
    content: "We have a 5-story building with about 200 employees. We need both drinking water and water for our cooling systems. What solutions do you recommend?",
    role: "customer",
    timestamp: new Date(Date.now() - 3400000).toISOString()
  }
];

// Different sets of suggestions based on conversation stage
const suggestionSets = {
  initial: [
    "What's your current water consumption like?",
    "Do you have any specific water quality requirements?",
    "What's your budget range for this project?",
    "When do you need the system installed?"
  ],
  requirements: [
    "Can you share more about your cooling system requirements?",
    "What's your expected daily water usage?",
    "Do you need water storage solutions as well?",
    "Are you looking for a complete package or specific components?"
  ],
  proposal: [
    "Can you break down the costs for me?",
    "What's included in the maintenance package?",
    "How long will the installation take?",
    "Do you offer any financing options?"
  ],
  closing: [
    "When can we schedule a site visit?",
    "Can you send me the detailed proposal?",
    "What are the next steps if we decide to proceed?",
    "Do you have any references from similar projects?"
  ]
};

// Lead personas and their contexts
const leadPersonas = {
  "Acme Corporation": {
    initialMessage: "Hi, I'm John from Acme Corporation. We're looking for water treatment solutions for our new office building in Westlands.",
    context: "commercial",
    requirements: "5-story building, 200 employees, need drinking water and cooling systems",
    suggestions: {
      initial: [
        "What's your current water consumption like?",
        "Do you have any specific water quality requirements?",
        "What's your budget range for this project?",
        "When do you need the system installed?"
      ],
      requirements: [
        "Can you share more about your cooling system requirements?",
        "What's your expected daily water usage?",
        "Do you need water storage solutions as well?",
        "Are you looking for a complete package or specific components?"
      ],
      proposal: [
        "Can you break down the costs for me?",
        "What's included in the maintenance package?",
        "How long will the installation take?",
        "Do you offer any financing options?"
      ],
      closing: [
        "When can we schedule a site visit?",
        "Can you send me the detailed proposal?",
        "What are the next steps if we decide to proceed?",
        "Do you have any references from similar projects?"
      ]
    }
  },
  "Tech Solutions Ltd": {
    initialMessage: "Hello, I'm Jane from Tech Solutions. We're expanding our data center and need industrial water treatment for our cooling systems.",
    context: "industrial",
    requirements: "data center cooling, high water volume, 24/7 operation",
    suggestions: {
      initial: [
        "What's your current cooling system capacity?",
        "Do you need redundancy in your water treatment?",
        "What's your uptime requirement?",
        "Are you looking for automated monitoring?"
      ],
      requirements: [
        "Can you share your peak water usage?",
        "What's your backup power situation?",
        "Do you need remote monitoring capabilities?",
        "What's your maintenance schedule like?"
      ],
      proposal: [
        "What's the total cost of ownership?",
        "How does the maintenance schedule work?",
        "What's the installation timeline?",
        "Do you offer 24/7 support?"
      ],
      closing: [
        "Can we get a technical assessment?",
        "When can we see a demo?",
        "What's the implementation process?",
        "Do you have similar data center references?"
      ]
    }
  },
  "Global Industries": {
    initialMessage: "Hi, I'm Mike from Global Industries. We're setting up a new manufacturing plant and need water treatment for our production processes.",
    context: "manufacturing",
    requirements: "production water, wastewater treatment, large volume",
    suggestions: {
      initial: [
        "What's your production water quality needs?",
        "Do you need wastewater treatment?",
        "What's your daily water volume?",
        "Are there any specific contaminants to handle?"
      ],
      requirements: [
        "Can you detail your production processes?",
        "What's your wastewater composition?",
        "Do you need water recycling?",
        "What are your discharge requirements?"
      ],
      proposal: [
        "What's the ROI on this system?",
        "How does the maintenance work?",
        "What's the installation impact on production?",
        "Do you offer training for our staff?"
      ],
      closing: [
        "Can we get a site assessment?",
        "When can we start implementation?",
        "What's the training process?",
        "Do you have similar manufacturing references?"
      ]
    }
  },
  "Innovative Systems": {
    initialMessage: "Hello, I'm Sarah from Innovative Systems. We're developing a new residential complex and need water treatment for 500 units.",
    context: "residential",
    requirements: "large residential complex, drinking water, irrigation",
    suggestions: {
      initial: [
        "What's your expected water demand?",
        "Do you need irrigation systems?",
        "What's your timeline for completion?",
        "Are you looking for smart monitoring?"
      ],
      requirements: [
        "Can you share the unit breakdown?",
        "What's your peak usage estimate?",
        "Do you need water storage?",
        "Are you planning any amenities?"
      ],
      proposal: [
        "What's the cost per unit?",
        "How does the maintenance work?",
        "What's the installation timeline?",
        "Do you offer resident support?"
      ],
      closing: [
        "When can we get a site visit?",
        "Can you provide a detailed proposal?",
        "What's the implementation process?",
        "Do you have similar residential references?"
      ]
    }
  }
};

// Helper function to build a proposal from context
function buildProposalFromContext({
  selectedLead,
  engagementContext,
  value = "KES 0.00",
  products = [],
  services = [],
  notes = "Auto-generated proposal based on engagement."
}: {
  selectedLead: any,
  engagementContext?: string,
  value?: string,
  products?: string[],
  services?: string[],
  notes?: string
}) {
  return {
    id: Date.now(),
    name: selectedLead?.name || "Proposal",
    leadId: selectedLead && 'id' in selectedLead ? String((selectedLead as any).id) : selectedLead?._id,
    client: selectedLead?.name,
    contact: selectedLead?.contact,
    date: new Date().toLocaleDateString(),
    status: "Draft",
    value,
    products,
    services,
    notes: notes + (engagementContext ? `\n\nContext: ${engagementContext}` : "")
  };
}

export default function EngagementsPage() {
  const searchParams = useSearchParams()
  const leadId = searchParams.get("leadId")
  const { selectedLead, setSelectedLead } = useAppContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [leadScore, setLeadScore] = useState<number>(selectedLead?.score || 0)
  const [leadStatus, setLeadStatus] = useState<string>(selectedLead?.status || "New Lead")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [proposalNotification, setProposalNotification] = useState<null | { id: number; name: string }>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Fetch AI suggestions for the current engagement
  const fetchSuggestions = async () => {
    if (!selectedLead?._id) return;
    try {
      const res = await fetch(`/api/engagements/suggestions?leadId=${selectedLead._id}`);
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (error) {
      setAiSuggestions([]);
    }
  };

  // Fetch messages from backend when selectedLead changes
  useEffect(() => {
    if (selectedLead && selectedLead._id) {
      fetchMessages();
      fetchSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLead]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/engagements?leadId=${leadId}`)
      if (!response.ok) throw new Error("Failed to fetch messages")
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !leadId || !selectedLead) return

    setIsLoading(true)
    try {
      // Add sales rep message immediately
      const salesMessage: Message = {
        content: newMessage,
        role: "sales",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, salesMessage])

      const response = await fetch("/api/engagements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          message: newMessage,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")
      const data = await response.json()

      // Replace all messages with the latest from the backend
      if (data.engagement?.messages?.length > 0) {
        setMessages(data.engagement.messages);
      }

      // Update lead score and status
      if (data.lead) {
        setLeadScore(data.lead.score)
        setLeadStatus(data.lead.status)
        const updatedLead: Lead = {
          ...selectedLead,
          score: data.lead.score,
          status: data.lead.status,
          lastContact: data.lead.lastContact
        }
        setSelectedLead(updatedLead)
      }

      // Show proposal notification if proposal was generated
      if (data.proposal) {
        setProposalNotification({ id: data.proposal.id, name: data.proposal.name });
      }

      setNewMessage("")
      // Fetch new AI suggestions after sending a message
      fetchSuggestions();
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add download handler for proposal
  const handleDownloadProposal = async (proposal: any) => {
    if (!proposal) return;
    const url = await generateProposalPDF(proposal);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${proposal.name.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!selectedLead) {
    return (
      <div className="flex flex-col p-6 space-y-6">
        <PageHeader
          title="Engagements"
          description="Select a lead to start a conversation."
          breadcrumbs={[
            { href: "/", label: "Dashboard" },
            { href: "/leads", label: "Leads" },
            { href: "/engagements", label: "Engagements", current: true },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6 space-y-6">
      <PageHeader
        title={`Engagement with ${selectedLead.name}`}
        description="Chat with your lead and get AI-powered assistance."
        breadcrumbs={[
          { href: "/", label: "Dashboard" },
          { href: "/leads", label: "Leads" },
          { href: "/engagements", label: "Engagements", current: true },
        ]}
      />

      <div className="flex gap-4 mb-4">
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lead Score</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">{leadScore}</span>
                  <Progress value={leadScore} className="w-32" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <Badge className="mt-1">{leadStatus}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {proposalNotification && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 flex items-center justify-between gap-2">
          <span>Proposal draft "{proposalNotification.name}" has been generated!</span>
          <Button size="sm" variant="outline" onClick={() => window.location.href = `/proposals?proposalId=${proposalNotification.id}`}>View Proposal</Button>
          <Button size="sm" variant="default" onClick={() => handleDownloadProposal({
            id: proposalNotification.id,
            name: proposalNotification.name,
            leadId: selectedLead && 'id' in selectedLead ? String((selectedLead as any).id) : selectedLead?._id,
            client: selectedLead?.name,
            contact: selectedLead?.contact,
            date: new Date().toLocaleDateString(),
            status: "Draft",
            value: "KES 0.00",
            products: [],
            services: [],
            notes: "Auto-generated proposal based on engagement."
          })}>
            Download Proposal
          </Button>
        </div>
      )}

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "sales" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "sales"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Suggestions */}
            {selectedLead && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">AI Suggestions</h4>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.length > 0 ? (
                    aiSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto py-1.5 text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                        <ThumbsUp className="ml-1.5 h-3 w-3" />
                      </Button>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No suggestions available.</span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={sendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
