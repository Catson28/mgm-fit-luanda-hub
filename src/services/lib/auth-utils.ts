// src/services/lib/auth-utils.ts
import jwt from "jsonwebtoken";
import { PermissionType } from "@prisma/client";

// Tipos para o payload do token JWT
interface JwtPayload {
  id: string;
  email: string;
  name: string;
  roles: {
    id: string;
    name: string;
    permissions: {
      id: string;
      name: string;
      type: PermissionType;
      resource: string;
    }[];
  }[];
}

// Constante para o papel masterAdmin
const MASTER_ADMIN_ROLE = "masterAdmin";

/**
 * Decodifica o token JWT e retorna o payload.
 *
 * @param token - O token JWT.
 * @returns O payload do token ou `null` se o token for inválido.
 */
function decodeToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

/**
 * Verifica se o usuário tem o papel masterAdmin.
 * 
 * @param token - O token JWT.
 * @returns `true` se o usuário tiver o papel masterAdmin, caso contrário, `false`.
 */
function isMasterAdmin(token: string | undefined): boolean {
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload?.roles) return false;

  return payload.roles.some((role) => role.name === MASTER_ADMIN_ROLE);
}

/**
 * Verifica se o usuário tem uma determinada permissão para um recurso específico.
 * Se o usuário for masterAdmin, ele tem acesso a todas as permissões.
 *
 * @param token - O token JWT.
 * @param resource - O recurso para o qual a permissão é verificada.
 * @param permissionType - O tipo de permissão (ex: READ, WRITE, DELETE).
 * @returns `true` se o usuário tiver a permissão ou for masterAdmin, caso contrário, `false`.
 */
export function hasPermission(
  token: string | undefined,
  resource: string,
  permissionType: PermissionType
): boolean {
  if (!token) return false;

  // Se for masterAdmin, concede acesso total
  if (isMasterAdmin(token)) return true;

  const payload = decodeToken(token);
  if (!payload?.roles) return false;

  return payload.roles.some((role) =>
    role.permissions.some(
      (permission) =>
        permission.resource === resource && permission.type === permissionType
    )
  );
}

/**
 * Verifica se o usuário tem um papel específico.
 * Se o usuário for masterAdmin, ele é considerado como tendo todos os papéis.
 *
 * @param token - O token JWT.
 * @param roleName - O nome do papel a ser verificado.
 * @returns `true` se o usuário tiver o papel ou for masterAdmin, caso contrário, `false`.
 */
export function hasRole(token: string | undefined, roleName: string): boolean {
  if (!token) return false;

  // Se for masterAdmin, considera que tem todos os papéis
  if (isMasterAdmin(token)) return true;

  const payload = decodeToken(token);
  if (!payload?.roles) return false;

  return payload.roles.some((role) => role.name === roleName);
}

/**
 * Obtém todas as permissões únicas do usuário.
 * Se o usuário for masterAdmin, retorna um array com uma permissão especial 
 * indicando acesso total.
 *
 * @param token - O token JWT.
 * @returns Um array de permissões únicas.
 */
export function getUserPermissions(token: string | undefined) {
  if (!token) return [];

  // Se for masterAdmin, retorna uma permissão especial indicando acesso total
  if (isMasterAdmin(token)) {
    return [{
      id: "master-access",
      name: "Acesso Total",
      type: "FULL_ACCESS" as PermissionType,
      resource: "*"
    }];
  }

  const payload = decodeToken(token);
  if (!payload?.roles) return [];

  // Extrair todas as permissões dos papéis do usuário
  const allPermissions = payload.roles.flatMap((role) => role.permissions);

  // Remover duplicatas usando um Map
  const uniquePermissions = Array.from(
    new Map(allPermissions.map((permission) => [permission.id, permission])).values()
  );

  return uniquePermissions;
}

/**
 * Verifica se o usuário tem acesso total (masterAdmin).
 *
 * @param token - O token JWT.
 * @returns `true` se o usuário for masterAdmin, caso contrário, `false`.
 */
export function hasFullAccess(token: string | undefined): boolean {
  return isMasterAdmin(token);
}