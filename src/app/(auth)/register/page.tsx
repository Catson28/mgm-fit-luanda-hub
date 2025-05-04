// app/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Link inicial da aplicacao
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              entre em sua conta existente
            </a>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}