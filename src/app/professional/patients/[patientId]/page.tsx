import { CareArea } from "@/features/care/care-area";
import { PatientIdentification } from "@/features/care/patient-identification";

export const metadata = { title: "Identificação do paciente" };
export default async function Page({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  return (
    <CareArea
      role="PROFESSIONAL"
      title="Identificação do paciente"
      description="Consulte a identificação autorizada para este acompanhamento."
    >
      <PatientIdentification patientId={patientId} />
    </CareArea>
  );
}
