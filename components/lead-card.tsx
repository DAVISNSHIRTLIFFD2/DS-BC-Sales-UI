"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Lead } from "@/utils/data-utils"
import { Calendar, MessageSquare, Phone } from "lucide-react"

interface LeadCardProps {
  lead: Lead
  onEngage?: () => void
  onCall?: () => void
  onSchedule?: () => void
}

export function LeadCard({ lead, onEngage, onCall, onSchedule }: LeadCardProps) {
  // Determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "hot lead":
        return "destructive"
      case "proposal sent":
        return "blue"
      case "follow-up":
        return "yellow"
      case "new lead":
        return "default"
      default:
        return "secondary"
    }
  }

  // Custom badge colors
  const badgeClasses = {
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  }

  const badgeVariant = getBadgeVariant(lead.status)

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={`/placeholder.svg?height=40&width=40&text=${lead.initials || lead.name.substring(0, 2)}`}
            alt={lead.name}
          />
          <AvatarFallback>{lead.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{lead.name}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Last contact: {lead.lastContact}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Score</span>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{lead.score}</span>
          </div>
          {badgeVariant === "blue" || badgeVariant === "yellow" ? (
            <Badge className={badgeClasses[badgeVariant as keyof typeof badgeClasses]}>{lead.status}</Badge>
          ) : (
            <Badge variant={badgeVariant as any}>{lead.status}</Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" title="Message" onClick={onEngage}>
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Call" onClick={onCall}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Schedule" onClick={onSchedule}>
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
