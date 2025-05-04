// src/lib/auth/server-auth.ts
"use server"
import { cookies } from 'next/headers';
import { hasRole } from '@/services/lib/auth-utils';

export async function verifyUserRoles(requiredRoles: string[]): Promise<boolean> {
  if (requiredRoles.length === 0) return true;

  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  return requiredRoles.some(role => hasRole(token, role));
}