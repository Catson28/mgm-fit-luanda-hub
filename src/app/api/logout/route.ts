// app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Remove o cookie de acesso
  cookieStore.delete('accessToken');

  return new NextResponse('Logged out successfully', {
    status: 200,
    headers: {
      'Set-Cookie': 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  });
}