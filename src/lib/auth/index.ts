import { cookies } from "next/headers";
import { jwtVerify, createRemoteJWKSet } from "jose";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Function to verify token from API route handler (server-side)
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    // Replace with your actual JWT verification logic
    // This is a simple implementation - you should adapt it to your actual auth flow
    
    // For example, if using Auth0 or a similar provider:
    // const JWKS = createRemoteJWKSet(new URL("https://YOUR_DOMAIN/.well-known/jwks.json"));
    // const { payload } = await jwtVerify(token, JWKS);
    
    // For demo purposes, we'll just decode and validate expiry
    // In production, you should properly verify the signature
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    return payload as UserPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Function to get auth token from cookies (for server components)
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

// Check if user has required role
export function checkUserRole(user: UserPayload | null, requiredRole: string | string[]): boolean {
  if (!user) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }
  
  return user.role === requiredRole;
}

// Higher-order function for role-based access control in API routes
export function withServerRoleCheck(handler: Function, allowedRoles: string[]) {
  return async (req: Request, context: any) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    
    if (!user || !checkUserRole(user, allowedRoles)) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { 
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return handler(req, context, user);
  };
}

export { withClientRoleCheck } from './with-client-role-check';
// export { withServerRoleCheck } from './with-server-role-check';