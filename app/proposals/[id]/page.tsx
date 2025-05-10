import { ProposalsPage } from "@/components/proposals-page"
import proposalsData from "@/data/proposals.json"

export default function ProposalDetail({ params }: { params: { id: string } }) {
  const proposal = proposalsData.find((p) => p.id === Number(params.id));
  return <ProposalsPage proposal={proposal} />
}