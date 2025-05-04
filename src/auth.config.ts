// src/auth.config.ts
import Credentials from "next-auth/providers/credentials";
import { db } from "@/services/lib/db";
import { LoginSchema } from "@/services/schemas";
import { getUserByEmail } from "@/services/data/user";
import { getTwoFactorConfirmationByUserId } from "@/services/data/two-factor-confirmation";
import bcrypt from "bcryptjs";
import type { NextAuthConfig, User } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          throw new Error("Invalid fields!");
        }

        const { email, password, code } = validatedFields.data;

        if (!email || !password) {
          return null;
        }

        const user = await getUserByEmail(email);

        if (!user || !user.email || !user.password) {
          throw new Error("Email does not exist!");
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified!");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials!");
        }

        if (user.isTwoFactorEnabled) {
          if (!code) {
            throw new Error("Two-factor authentication code required");
          }

          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id);

          if (!twoFactorConfirmation) {
            throw new Error("Two-factor authentication required");
          }
        }

        const userWithRoles = await db.user.findUnique({
          where: { id: user.id },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
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
          roles,
          userRoles,
          emailVerified: user.emailVerified ?? null,
        } as unknown as User; // Use unknown as intermediate type to avoid type errors
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.roles = user.roles;
        token.userRoles = user.userRoles;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id ?? "";
        session.user.email = token.email ?? "";
        session.user.name = token.name;
        session.user.roles = token.roles ?? [];
        session.user.userRoles = token.userRoles;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
};