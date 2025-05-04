// src/lib/auth/with-client-role-check.ts
"use client"
import React, { useEffect, useState } from 'react';
import Preload from '@/components/ui/preload'; // Ajuste o caminho conforme necessário

// Definição de tipos para as props
type ComponentProps = Record<string, unknown>;

// Client-side role check that uses an API endpoint
export function withClientRoleCheck<P extends ComponentProps>(
  Component: React.ComponentType<P>,
  requiredRoles: string[] = []
) {
  return function ProtectedClientPage(props: P) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      // Skip check if no roles required
      if (!requiredRoles || requiredRoles.length === 0) {
        setIsAuthorized(true);
        return;
      }

      // Fetch authorization status from an API endpoint
      fetch('/api/auth/check-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requiredRoles }),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.authorized) {
            // Redirect using client-side navigation for client components
            window.location.href = '/not-found';
            return;
          }
          setIsAuthorized(true);
        })
        .catch(err => {
          console.error('Auth check failed:', err);
          // Redirect on error
          window.location.href = '/not-found';
        });
    }, []);

    // Show loading state while checking authorization
    if (isAuthorized === null) {
      return <Preload isLoading={true} loadingText="Acessando..." />;
    }

    // Only render component if authorized
    return React.createElement(Component, props);
  };
}