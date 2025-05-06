// src/app/api/athletes/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

// PATCH /api/athletes/[id]/status - Atualizar o status de um atleta
export async function PATCH(
  request: NextRequest,
  //// @ts-expect-error - Ignorando erro de tipagem do Next.js
  { params }: any
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Validar o status recebido
    const { status } = statusSchema.parse(body);

    // Verificar se o atleta existe
    const existingAthlete = await db.athlete.findUnique({
      where: { id },
    });

    if (!existingAthlete) {
      return NextResponse.json({ error: "Atleta não encontrado" }, { status: 404 });
    }

    // Atualizar o status do atleta
    const updatedAthlete = await db.athlete.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedAthlete);
  } catch (error) {
    console.error(`Error updating athlete status ${params.id}:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Status inválido", details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Falha ao atualizar status do atleta" }, { status: 500 });
  }
}