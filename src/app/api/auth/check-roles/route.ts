// src/app/api/auth/check-roles/route.ts
import { verifyUserRoles } from '@/lib/auth/server-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { requiredRoles } = await request.json();

  if (!requiredRoles || !Array.isArray(requiredRoles)) {
    return NextResponse.json({ authorized: false }, { status: 400 });
  }

  try {
    const hasAccess = await verifyUserRoles(requiredRoles);
    return NextResponse.json({ authorized: hasAccess });
  } catch (error) {
    console.error('Role verification error:', error);
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
}