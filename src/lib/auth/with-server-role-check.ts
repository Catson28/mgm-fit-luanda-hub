import { redirect } from 'next/navigation';
import React from 'react';
import { verifyUserRoles } from './server-auth';

// Definição de tipos para as props
type ComponentProps = Record<string, unknown>;

// This is for server components only - don't use with "use client" components
export function withServerRoleCheck<P extends ComponentProps>(
  Component: React.ComponentType<P>,
  requiredRoles: string[] = []
) {
  return async function ProtectedServerPage(props: P) {
    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return React.createElement(Component, props);
    }

    // Server-side role check
    const hasAccess = await verifyUserRoles(requiredRoles);

    if (!hasAccess) {
      redirect('/not-found');
    }

    // If authorized, render component
    return React.createElement(Component, props);
  };
}