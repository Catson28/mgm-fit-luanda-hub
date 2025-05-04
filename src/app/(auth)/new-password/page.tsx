"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Componente interno que usa useSearchParams
function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<{
    error?: string;
    success?: string;
    loading: boolean;
  }>({ loading: true });

  const verifyToken = useCallback(async () => {
    if (!token) {
      setStatus({ error: "Token ausente!", loading: false });
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
        setStatus({ error: data.error || "Erro na verificação", loading: false });
        return;
      }

      setStatus({ success: "Email verificado com sucesso!", loading: false });
    } catch {
      setStatus({ error: "Algo deu errado!", loading: false });
    }
  }, [token]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  if (status.loading) {
    return <div>Verificando...</div>;
  }

  return (
    <div className="verification-result">
      {status.error && (
        <div className="error-message">{status.error}</div>
      )}
      {status.success && (
        <div className="success-message">{status.success}</div>
      )}
    </div>
  );
}

// Componente principal com Suspense
export default function NewVerificationPage() {
  return (
    <div className="verification-container">
      <Suspense fallback={<div className="loading">Carregando...</div>}>
        <VerificationContent />
      </Suspense>
    </div>
  );
}