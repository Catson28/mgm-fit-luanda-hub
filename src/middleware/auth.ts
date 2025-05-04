import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/services/lib/db";

// Tipos para o usuário autenticado
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: Array<{
    id: string;
    name: string;
    permissions: Array<{
      id: string;
      name: string;
      type: string;
      resource: string;
    }>;
  }>;
}

export interface AuthResult {
  authenticated: boolean;
  error?: string;
  user?: AuthUser;
}

/**
 * Middleware para verificar a autenticação do usuário
 */
export async function authenticate(req: NextRequest): Promise<AuthResult> {
  try {
    // Verificar se existe um token de autenticação
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("accessToken")?.value;

    // Obter token do cabeçalho Authorization ou do cookie
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      return { authenticated: false, error: "Não autorizado: Token não fornecido" };
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      return { authenticated: false, error: "Erro de configuração do servidor" };
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      email: string;
      name: string;
      roles: Array<{
        id: string;
        name: string;
        permissions: Array<{
          id: string;
          name: string;
          type: string;
          resource: string;
        }>;
      }>;
    };

    // Verificar se o usuário ainda existe no banco de dados
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return { authenticated: false, error: "Não autorizado: Usuário não encontrado" };
    }

    // Retornar informações do usuário autenticado
    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map(ur => ({
          id: ur.role.id,
          name: ur.role.name,
          permissions: ur.role.permissions.map(rp => ({
            id: rp.permission.id,
            name: rp.permission.name,
            type: rp.permission.type,
            resource: rp.permission.resource
          }))
        }))
      }
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        return { authenticated: false, error: "Não autorizado: Token expirado" };
      }
      return { authenticated: false, error: "Não autorizado: Token inválido" };
    }

    console.error("Erro na autenticação:", error);
    return { authenticated: false, error: "Erro interno de autenticação" };
  }
}