import { CareArea } from "@/features/care/care-area";
import { RelationshipsPage } from "@/features/care/relationships";

export const metadata = { title: "Meu fisioterapeuta" };
export default function Page() {
  return <CareArea role="PATIENT" title="Meu fisioterapeuta" description="Gerencie suas solicitações e escolha quem acompanha seu cuidado."><RelationshipsPage /></CareArea>;
}
