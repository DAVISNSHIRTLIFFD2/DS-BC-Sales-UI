import { ProposalsPage } from "@/components/proposals-page"

export default function ProposalDetail({ params }: { params: { id: string } }) {
  return <ProposalsPage proposalId={Number.parseInt(params.id)} />
}
