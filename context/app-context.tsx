"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Lead, Proposal } from "@/utils/data-utils"

interface AppContextType {
  selectedLead: Lead | null
  setSelectedLead: (lead: Lead | null) => void
  selectedProposal: Proposal | null
  setSelectedProposal: (proposal: Proposal | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)

  return (
    <AppContext.Provider
      value={{
        selectedLead,
        setSelectedLead,
        selectedProposal,
        setSelectedProposal,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
