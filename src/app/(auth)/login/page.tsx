// app/(ERP)/(dashboard)/(hr)/Login/page.tsx
import { Suspense } from 'react';
import ERPLoginPage from '@/components/auth/pages/ERPLoginPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ERPLoginPage />
    </Suspense>
  );
}
