// app/new-verification/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { SearchParamsProvider } from "@/components/SearchParamsProvider";

function NewVerificationForm({ token }: { token: string | null }) {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Token ausente!");
      return;
    }

    try {
      const response = await fetch("/api/new-verification", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }

      setSuccess("Email verificado com sucesso!");
    } catch {
      setError("Algo deu errado!");
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div>
      {!error && !success && <div>Verificando...</div>}
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </div>
  );
}

export default function NewVerificationPage() {
  return (
    <SearchParamsProvider>
      {(token) => <NewVerificationForm token={token} />}
    </SearchParamsProvider>
  );
}