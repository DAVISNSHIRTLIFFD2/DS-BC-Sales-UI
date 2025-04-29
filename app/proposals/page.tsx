"use client"

import { useEffect } from "react"
import { ProposalsPage } from "@/components/proposals-page"
import { getLeadById, getProposals, getProposalById } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"
import { useRouter, useSearchParams } from "next/navigation"

export default function Proposals() {
  const { selectedLead, setSelectedLead, selectedProposal, setSelectedProposal } = useAppContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get("leadId")
  const proposalId = searchParams.get("proposalId")

  useEffect(() => {
    // If leadId is provided in URL but no lead is selected, fetch the lead
    if (leadId && !selectedLead) {
      const lead = getLeadById(Number(leadId))
      if (lead) {
        setSelectedLead(lead)
      }
    }

    // If proposalId is provided in URL but no proposal is selected, fetch the proposal
    if (proposalId && !selectedProposal) {
      const proposal = getProposalById(Number(proposalId))
      if (proposal) {
        setSelectedProposal(proposal)
      }
    }
  }, [leadId, proposalId, selectedLead, selectedProposal, setSelectedLead, setSelectedProposal])

  // Get the activeTab from URL if provided
  const activeTab = searchParams.get("activeTab")
  const templateId = searchParams.get("templateId")

  useEffect(() => {
    // If activeTab is provided in URL, set it in the component
    if (activeTab) {
      // This will be used in the ProposalsPage component
      console.log("Setting active tab to:", activeTab)
      // You can pass this to the ProposalsPage component
    }
  }, [activeTab])

  // Fetch all proposals
  const proposals = getProposals()

  return (
    <ProposalsPage
      lead={selectedLead}
      proposal={selectedProposal}
      proposals={proposals}
      activeTab={activeTab as "create" | "manage" | undefined}
      templateId={templateId ? Number(templateId) : undefined}
    />
  )
}
