import { Suspense, ReactNode } from 'react';

interface FirstLoadingProps {
  children: ReactNode;
}

export default function FirstLoading({ children }: FirstLoadingProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      {children}
    </Suspense>
  );
}