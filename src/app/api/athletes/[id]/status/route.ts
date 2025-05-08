// src/app/api/athletes/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

// Interface para tipagem dos parâmetros
interface RouteParams {
  params: Promise<{ id: string }>; // params é um Promise
}

// PATCH /api/athletes/[id]/status - Atualizar o status de um atleta
export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params; // Resolver a Promise
    const id = params.id; // Atribuir o valor de id

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
    // Usar params.id diretamente após garantir que params seja resolvido
    const params = await context.params.catch(() => ({ id: "unknown" })); // Fallback para id desconhecido
    const id = params.id;

    console.error(`Error updating athlete status ${id}:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Status inválido", details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Falha ao atualizar status do atleta" }, { status: 500 });
  }
}