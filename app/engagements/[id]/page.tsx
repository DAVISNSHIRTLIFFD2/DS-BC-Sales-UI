import { EngagementsPage } from "@/components/engagements-page"

export default function EngagementDetail({ params }: { params: { id: string } }) {
  return <EngagementsPage leadId={Number.parseInt(params.id)} />
}
