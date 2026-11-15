import { CareArea } from "@/features/care/care-area";
import { RelationshipsPage } from "@/features/care/relationships";

export const metadata = { title: "Meus pacientes" };
export default function Page() {
  return (
    <CareArea
      role="PROFESSIONAL"
      title="Meus pacientes"
      description="Responda às solicitações e consulte os pacientes que autorizaram seu acompanhamento."
    >
      <RelationshipsPage />
    </CareArea>
  );
}
