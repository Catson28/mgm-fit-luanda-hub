import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/services/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Obter refresh token do corpo da requisição ou do cookie
    const body = await req.json();
    const refreshToken = body.refreshToken || req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token não fornecido" }, { status: 400 });
    }

    const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!refreshSecretKey || !secretKey) {
      return NextResponse.json({ error: "Erro de configuração do servidor" }, { status: 500 });
    }

    // Verificar e decodificar o refresh token
    const decoded = jwt.verify(refreshToken, refreshSecretKey) as {
      id: string;
      email: string;
    };

    // Buscar o usuário e suas permissões
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
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Preparar array de roles e permissões para o token
    const userRoles = user.roles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name,
      permissions: ur.role.permissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        type: rp.permission.type,
        resource: rp.permission.resource
      }))
    }));

    // Gerar novo token de acesso
    const newToken = jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: userRoles
    }, secretKey, { expiresIn: '1h' });

    // Opcionalmente, você pode gerar um novo refresh token também
    const newRefreshToken = jwt.sign({
      id: user.id,
      email: user.email
    }, refreshSecretKey, { expiresIn: '7d' });

    const response = NextResponse.json({
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: userRoles
      },
      expiresIn: 3600
    });

    // Atualizar cookies
    response.cookies.set('accessToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600
    });

    return response;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        error: "Token inválido ou expirado, faça login novamente"
      }, { status: 401 });
    }

    console.error("Erro ao atualizar token:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}