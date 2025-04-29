import { ProposalsPage } from "@/components/proposals-page"

export default function CreateProposalForLead({ params }: { params: { leadId: string } }) {
  return <ProposalsPage createForLeadId={Number.parseInt(params.leadId)} />
}
