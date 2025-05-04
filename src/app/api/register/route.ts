// app/api/register/route.ts
import { db } from "@/services/lib/db";
import { sendVerificationEmail } from "@/services/lib/mail";
import { generateVerificationToken } from "@/services/lib/tokens";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(
  req: Request,
) {
  try {
    const body = await req.json();
    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Campos inválidos!" }, { status: 400 });
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await hash(password, 10);

    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está em uso!" },
        { status: 400 }
      );
    }

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return NextResponse.json(
      { success: "Email de confirmação enviado!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar conta!" },
      { status: 500 }
    );
  }
}