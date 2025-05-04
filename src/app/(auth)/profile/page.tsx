// app/profile/page.tsx
import { auth } from "@/services/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <p className="text-gray-600">Nome:</p>
          <p className="font-medium">{session.user?.name || "Não definido"}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600">Email:</p>
          <p className="font-medium">{session.user?.email}</p>
        </div>
        <div>
          <p className="text-gray-600">Tipo de Conta:</p>
          <p className="font-medium">{session.user.role.roleId}</p>
        </div>
      </div>
    </div>
  );
}