// app/reset/page.tsx
"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";

export default function ResetPage() {
  // const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);
    setIsPending(true);

    const email = formData.get("email") as string;

    try {
      const response = await fetch("/api/reset", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }

      setSuccess("Email de recuperação enviado!");
    } catch {
      setError("Algo deu errado!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Recuperar Senha</h1>
      <form action={onSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isPending ? "Enviando..." : "Enviar email de recuperação"}
        </button>
      </form>
    </div>
  );
}