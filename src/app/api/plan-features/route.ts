import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Esquema de validação para funcionalidade
const featureSchema = z.object({
  name: z.string().min(3),
  included: z.boolean(),
  planId: z.string(),
});

// POST: Criar nova funcionalidade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = featureSchema.parse(body);

    const feature = await prisma.planFeature.create({
      data: {
        name: validated.name,
        included: validated.included,
        planId: validated.planId,
      },
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar funcionalidade:", error);
    return NextResponse.json(
      { error: "Falha ao criar funcionalidade" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar funcionalidade existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID da funcionalidade é obrigatório" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = featureSchema.parse(body);

    const feature = await prisma.planFeature.update({
      where: { id },
      data: {
        name: validated.name,
        included: validated.included,
        planId: validated.planId,
      },
    });

    return NextResponse.json(feature);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao atualizar funcionalidade:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar funcionalidade" },
      { status: 500 }
    );
  }
}

// DELETE: Excluir funcionalidade
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID da funcionalidade é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.planFeature.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Funcionalidade excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir funcionalidade:", error);
    return NextResponse.json(
      { error: "Falha ao excluir funcionalidade" },
      { status: 500 }
    );
  }
}