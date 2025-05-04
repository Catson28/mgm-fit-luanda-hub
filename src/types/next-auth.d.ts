// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { Role, Permission, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | null | undefined;
      roles: (Omit<Role, "description"> & {
        description?: string | null;
        permissions: Permission[];
      })[];
      userRoles?: UserRole[];
      name?: string | null | undefined;
    } & Omit<DefaultSession["user"], "name">;
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
    id?: string;
    email?: string | null | undefined;
    name?: string | null;
    roles?: ExtendedRole[];
    userRoles?: UserRole[];
  }
}