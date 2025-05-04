// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { hasPermission, hasRole } from "@/services/lib/auth-utils";
import { PermissionType } from "@prisma/client";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const token = req.cookies.get('accessToken')?.value;
  const isLoggedIn = !!token;

  // Rotas excluídas do middleware (ex: API de envio de e-mail)
  const isExcludedRoute = nextUrl.pathname === '/api/send-test-email';

  if (isExcludedRoute) {
    return; // Ignora a rota excluída
  }

  // Verifica se a rota é uma rota de API de autenticação
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  if (isApiAuthRoute) {
    return; // Permite acesso direto a rotas de API de autenticação
  }

  // Verifica se a rota é uma rota de autenticação (login, registro, etc.)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      // Se o usuário já está logado, redireciona para a página padrão após o login
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return; // Permite acesso a rotas de autenticação para usuários não logados
  }

  // Verifica se a rota é pública
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (!isLoggedIn && !isPublicRoute) {
    // Se o usuário não está logado e tenta acessar uma rota privada, redireciona para o login
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search; // Preserva os parâmetros da URL
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl); // Codifica a URL de callback
    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // Verificação de permissões e papéis (exemplo)
  if (isLoggedIn) {
    // Exemplo: Verifica se o usuário tem permissão para acessar a rota "/admin"
    const canAccessAdmin = hasPermission(token, "admin", PermissionType.READ);

    if (nextUrl.pathname.startsWith("/pagina") && !canAccessAdmin) {
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }

    // Exemplo: Verifica se o usuário tem o papel "admin"
    const isAdmin = hasRole(token, "admin");

    if (nextUrl.pathname === "/user" && isAdmin) {
      return Response.redirect(new URL("/admin", nextUrl));
    }
  }

  return; // Permite acesso a rotas públicas ou usuários logados com permissões válidas
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};