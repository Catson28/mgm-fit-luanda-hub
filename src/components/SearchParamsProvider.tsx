// components/SearchParamsProvider.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamsProviderProps {
  children: (token: string | null) => React.ReactNode;
}

function SearchParamsComponent({ children }: SearchParamsProviderProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  return <>{children(token)}</>;
}

export function SearchParamsProvider({ children }: SearchParamsProviderProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchParamsComponent>
        {children}
      </SearchParamsComponent>
    </Suspense>
  );
}