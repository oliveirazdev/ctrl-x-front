import { CareArea } from "@/features/care/care-area";
import { ProfilePage } from "@/features/care/profile";

export const metadata = { title: "Perfil do fisioterapeuta" };
export default function Page() {
  return (
    <CareArea
      role="PROFESSIONAL"
      title="Meu perfil profissional"
      description="Confira sua identificação e seu registro para acompanhar pacientes no Ctrl X."
    >
      <ProfilePage />
    </CareArea>
  );
}
