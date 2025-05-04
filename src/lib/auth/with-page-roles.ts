// src/lib/auth/with-page-roles.ts
import React from 'react';
import { checkServerRoles } from './server-auth-utils';
import { redirect } from 'next/navigation';

export function withPageRoles<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[] = []
) {
  return async function ProtectedPage(props: P) {
    const hasAccess = await checkServerRoles(requiredRoles);

    if (!hasAccess) {
      redirect('/not-found');
    }

    return React.createElement(Component, props);
  };
}