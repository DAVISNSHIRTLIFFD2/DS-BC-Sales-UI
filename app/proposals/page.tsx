"use client"

import { useEffect, useState } from "react"
import { ProposalsPage } from "@/components/proposals-page"
import { getLeadById, getProposals, getProposalById, type Proposal } from "@/utils/data-utils"
import { useAppContext } from "@/context/app-context"
import { useRouter, useSearchParams } from "next/navigation"

export default function Proposals() {
  const { selectedLead, setSelectedLead, selectedProposal, setSelectedProposal } = useAppContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get("leadId")
  const proposalId = searchParams.get("proposalId")

  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    async function fetchData() {
      if (leadId && !selectedLead) {
        const lead = await getLeadById(leadId)
        if (lead) setSelectedLead(lead)
      }
      if (proposalId && !selectedProposal) {
        const proposal = await getProposalById(proposalId)
        if (proposal) setSelectedProposal(proposal)
      }
      const allProposals = await getProposals()
      setProposals(allProposals)
    }
    fetchData()
  }, [leadId, proposalId, selectedLead, selectedProposal, setSelectedLead, setSelectedProposal])

  // Get the activeTab from URL if provided
  const activeTab = searchParams.get("activeTab")
  const templateId = searchParams.get("templateId")

  useEffect(() => {
    if (activeTab) {
      console.log("Setting active tab to:", activeTab)
    }
  }, [activeTab])

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
