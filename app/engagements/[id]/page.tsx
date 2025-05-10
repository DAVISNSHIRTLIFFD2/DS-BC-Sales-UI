import { useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { getLeadById } from "@/utils/data-utils";
import EngagementsPage from "../page";

export default function EngagementDetail({ params }: { params: { id: string } }) {
  const { setSelectedLead } = useAppContext();

  useEffect(() => {
    getLeadById(params.id).then(lead => {
      if (lead) setSelectedLead(lead);
    });
  }, [params.id, setSelectedLead]);

  return <EngagementsPage />;
}
