// src/app/api/login/route.ts
import { db } from "@/services/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/services/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/services/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/services/data/two-factor-token";
import { getUserByEmail } from "@/services/data/user";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getTwoFactorConfirmationByUserId } from "@/services/data/two-factor-confirmation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { logger, withLogging } from '@/lib/logger/logger';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  code: z.optional(z.string())
});



export const POST = withLogging(async (req: Request) => {
  try {

    const secretKey = process.env.JWT_SECRET_KEY;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;

    console.log("Verificando chaves secretas...");
    console.log("JWT_SECRET_KEY:", secretKey);
    console.log("JWT_REFRESH_SECRET_KEY:", refreshSecretKey);
    if (!secretKey || !refreshSecretKey) {
      console.log("Chaves secretas ausentes. Retornando erro 500.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await req.json();
    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
    }

    const { email, code, password } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (!user || !user.email || !user.password) {
      return NextResponse.json({ error: "Email does not exist!" }, { status: 400 });
    }

    if (!user.emailVerified) {
      const verificationToken = await generateVerificationToken(
        user.email
      );

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return NextResponse.json({ success: "Confirmation email sent!" }, { status: 200 });
    }

    if (user.isTwoFactorEnabled && user.email) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid credentials!" }, { status: 400 });
      }

      if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(user.email);

        if (!twoFactorToken) {
          return NextResponse.json({ error: "Invalid code!" }, { status: 400 });
        }

        if (twoFactorToken.token !== code) {
          return NextResponse.json({ error: "Invalid code!" }, { status: 400 });
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
          return NextResponse.json({ error: "Code expired!" }, { status: 400 });
        }

        await db.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          user.id
        );

        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          });
        }

        await db.twoFactorConfirmation.create({
          data: { userId: user.id },
        });
      } else {
        const twoFactorToken = await generateTwoFactorToken(user.email);
        await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

        return NextResponse.json({ twoFactor: true, email: email, password: password }, { status: 200 });
      }
    } else {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid password!" }, { status: 400 });
      }

      if (!user.emailVerified) {
        return NextResponse.json({ error: "Email not verified!" }, { status: 400 });
      }
    }

    if (user.isTwoFactorEnabled && !code) {
      const twoFactorToken = await generateTwoFactorToken(user.email);
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );

      return NextResponse.json({ twoFactor: true });
    }

    // Buscar roles e permissões do usuário
    const userWithRoles = await db.user.findUnique({
      where: { id: user.id },
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

    // Preparar array de roles e permissões para o token
    const userRoles = userWithRoles?.roles.map(ur => ({
      id: ur.role.id,
      name: ur.role.name,
      permissions: ur.role.permissions.map(rp => ({
        id: rp.permission.id,
        name: rp.permission.name,
        type: rp.permission.type,
        resource: rp.permission.resource
      }))
    })) || [];


    const token = jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: userRoles
    }, secretKey, { expiresIn: '1h' });

    const refreshToken = jwt.sign({
      id: user.id,
      email: user.email
    }, refreshSecretKey, { expiresIn: '7d' });

    const response = NextResponse.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: userRoles
      },
      expiresIn: 3600
    });

    response.cookies.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600
    });

    return response;
  } catch (error) {
    console.error("Erro durante o processo de login:", error);
    return NextResponse.json({ error: "Erro interno!" }, { status: 500 });
  }
});