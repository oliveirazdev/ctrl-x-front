import { CareArea } from "@/features/care/care-area";
import { ProfilePage } from "@/features/care/profile";

export const metadata = { title: "Meu perfil" };
export default function Page() {
  return (
    <CareArea
      role="PATIENT"
      title="Meu perfil"
      description="Mantenha sua identificação atualizada para dar continuidade ao seu cuidado."
    >
      <ProfilePage />
    </CareArea>
  );
}
