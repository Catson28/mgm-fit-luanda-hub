// src/lib/auth/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/services/lib/db";
import { NextAuthConfig, User } from "next-auth";
import { getUserByEmail } from "@/services/data/user";
import { getTwoFactorConfirmationByUserId } from "@/services/data/two-factor-confirmation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Adapter } from "next-auth/adapters";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { cookies } from "next/headers";

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  code: z.string().optional(),
});

function CustomPrismaAdapter(prisma: typeof db): Adapter {
  const adapter = PrismaAdapter(prisma);

  adapter.createUser = async (user) => {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name ?? "user",
        emailVerified: user.emailVerified,
      },
    });

    return {
      ...createdUser,
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name ?? null,
      emailVerified: createdUser.emailVerified ?? null,
      roles: [],
      userRoles: [],
    };
  };

  return adapter as Adapter;
}

export const authOptions: NextAuthConfig = {
  adapter: CustomPrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) throw new Error("Invalid fields!");

        const { email, password, code } = validatedFields.data;
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user || !user.email || !user.password) throw new Error("Email does not exist!");
        if (!user.emailVerified) throw new Error("Email not verified!");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials!");

        if (user.isTwoFactorEnabled) {
          if (!code) throw new Error("Two-factor authentication code required");
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id);
          if (!twoFactorConfirmation) throw new Error("Two-factor authentication required");
        }

        const userWithRoles = await db.user.findUnique({
          where: { id: user.id },
          include: {
            roles: {
              include: {
                role: { include: { permissions: { include: { permission: true } } } },
              },
            },
          },
        });

        const roles = userWithRoles?.roles.map((ur) => ({
          id: ur.role.id,
          name: ur.role.name,
          createdAt: ur.role.createdAt,
          updatedAt: ur.role.updatedAt,
          description: ur.role.description ?? null,
          permissions: ur.role.permissions.map((rp) => rp.permission),
        })) || [];

        const userRoles = userWithRoles?.roles.map((ur) => ({
          id: ur.id,
          userId: ur.userId,
          roleId: ur.roleId,
          createdAt: ur.createdAt,
          updatedAt: ur.updatedAt,
        }));

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          // role:user.roles,
          roles,
          userRoles,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? undefined;
        token.email = user.email ?? undefined;
        token.name = user.name ?? null;
        token.roles = user.roles ?? [];
        token.userRoles = user.userRoles ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id ?? "";
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? undefined;
        session.user.roles = token.roles ?? [];
        session.user.userRoles = token.userRoles ?? undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET_KEY,
  debug: process.env.NODE_ENV === "development",
};

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
export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("authToken")?.value;
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









