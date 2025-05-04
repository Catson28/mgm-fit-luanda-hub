// lib/tokens.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getVerificationTokenByEmail } from "@/services/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/services/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/services/data/two-factor-token";
import { db } from "@/services/lib/db";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      }
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4(); // Gera um token único
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Define a expiração para 1 hora

  // Verifica se já existe um token para o e-mail
  const existingToken = await db.verificationToken.findFirst({
    where: { email },
  });

  // Se existir, deleta o token antigo
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  // Cria um novo token de verificação
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};