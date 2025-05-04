//types/next-auth.d.ts
import { UserRole } from "@prisma/client";
// import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      email: string;
      name?: string | null | undefined;
    }
  }

  interface User extends DefaultUser {
    id: string | null | undefined;
    roles: (Omit<Role, "description"> & {
      description?: string | null;
      permissions: Permission[];
    })[];
    userRoles?: UserRole[];
    name?: string | null; // Alinhado com o Prisma
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
    role: UserRole;
  }
}