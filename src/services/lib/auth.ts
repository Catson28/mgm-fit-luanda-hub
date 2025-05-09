// lib/auth.ts
import NextAuth from "next-auth";
// import { UserRole } from "@prisma/client";
import { db } from "@/services/lib/db";
import { authConfig } from "@/auth.config";
// import { getUserById } from "@/services/data/user";
// import { getTwoFactorConfirmationByUserId } from "@/services/data/two-factor-confirmation";
// import { getAccountByUserId } from "@/services/data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({

  /*
    pages: {
      signIn: "/login",
      error: "/error",
    },
  */
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  /*
    callbacks: {
      async signIn({ user, account }) {
        // Permitir OAuth sem email verification
        if (account?.provider !== "credentials") return true;
  
        if (!user.id) return false;
  
        const existingUser = await getUserById(user.id);
  
        // Impedir login se email não foi verificado
        if (!existingUser?.emailVerified) return false;
  
        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
  
          if (!twoFactorConfirmation) return false;
  
          // Deletar two factor confirmation para próximo login
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }
  
        return true;
      },
      async session({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
  
        if (token.role && session.user) {
          session.user.role = token.role as UserRole;
        }
  
        if (session.user) {
          session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        }
  
        return session;
      },
      async jwt({ token }) {
        if (!token.sub) return token;
  
        const existingUser = await getUserById(token.sub);
  
        if (!existingUser) return token;
  
        const existingAccount = await getAccountByUserId(existingUser.id);
  
        token.isOAuth = !!existingAccount;
        token.role = existingUser.role;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
  
        return token;
      },
    },  
    */
  session: { strategy: "jwt" },
  // cookies: {
  //   sessionToken: {
  //     name: "next-auth.session-token", // Nome do cookie de sessão
  //     options: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production", // Usar HTTPS em produção
  //       sameSite: "lax",
  //       path: "/",
  //     },
  //   },
  // },
  ...authConfig,
});