// src/lib/auth/server-auth-utils.ts
import { cookies } from 'next/headers';
import { hasRole } from '@/services/lib/auth-utils';

export async function checkServerRoles(requiredRoles: string[]) {
  if (requiredRoles.length === 0) return true;

  const cookieStore = await cookies(); // Adicionado "await" aqui
  const token = cookieStore.get('accessToken')?.value;

  return requiredRoles.some(role => hasRole(token, role));
}