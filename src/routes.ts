// routes.ts
/**
 * Rotas que são acessíveis publicamente
 * Essas rotas não requerem autenticação
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
];

/**
 * Rotas usadas para autenticação
 * Essas rotas redirecionarão usuários logados para /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/reset",
  "/new-password",
  "/new-verification"
];

/**
 * Prefixo para rotas de autenticação da API
 * Rotas que começam com esse prefixo são usadas para API de autenticação
 * @type {string}
 */
export const apiAuthPrefix = "/api";

/**
 * Rota padrão após login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
