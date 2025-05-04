// Em um novo arquivo: app/components/ProgressBar.tsx
"use client"

import { AppProgressBar } from 'next-nprogress-bar';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <AppProgressBar
      height="4px"
      color="#0070f3"
      options={{ showSpinner: true }}
      key={pathname + searchParams}
    />
  );
}