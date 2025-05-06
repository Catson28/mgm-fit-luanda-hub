import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/services/lib/db";

// Esquema de validação para criação/atualização de plano
const planSchema = z.object({
  name: z.string().min(3),
  price: z.number().min(0),
  period: z.string().min(1),
  description: z.string().nullable(),
  isPopular: z.boolean(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  features: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(3),
      included: z.boolean(),
    })
  ),
});

// GET: Listar planos com filtros e ordenação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const plans = await db.plan.findMany({
      where: {
        name: { contains: search, mode: "insensitive" },
      },
      include: {
        features: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Erro ao listar planos:", error);
    return NextResponse.json(
      { error: "Falha ao listar planos" },
      { status: 500 }
    );
  }
}

// POST: Criar novo plano
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = planSchema.parse(body);

    const plan = await db.plan.create({
      data: {
        name: validated.name,
        price: validated.price,
        period: validated.period,
        description: validated.description,
        isPopular: validated.isPopular,
        status: validated.status,
        features: {
          create: validated.features.map((feature) => ({
            name: feature.name,
            included: feature.included,
          })),
        },
      },
      include: {
        features: true,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar plano:", error);
    return NextResponse.json({ error: "Falha ao criar plano" }, { status: 500 });
  }
}

// PUT: Atualizar plano existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID do plano é obrigatório" }, { status: 400 });
    }

    const body = await request.json();
    const validated = planSchema.parse(body);

    // Atualizar plano
    const plan = await db.plan.update({
      where: { id },
      data: {
        name: validated.name,
        price: validated.price,
        period: validated.period,
        description: validated.description,
        isPopular: validated.isPopular,
        status: validated.status,
      },
      include: {
        features: true,
      },
    });

    // Sincronizar funcionalidades
    // Deletar funcionalidades existentes
    await db.planFeature.deleteMany({
      where: { planId: id },
    });

    // Criar novas funcionalidades
    await db.planFeature.createMany({
      data: validated.features.map((feature) => ({
        planId: id,
        name: feature.name,
        included: feature.included,
      })),
    });

    // Buscar plano atualizado com funcionalidades
    const updatedPlan = await db.plan.findUnique({
      where: { id },
      include: { features: true },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao atualizar plano:", error);
    return NextResponse.json({ error: "Falha ao atualizar plano" }, { status: 500 });
  }
}

// DELETE: Excluir plano
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID do plano é obrigatório" }, { status: 400 });
    }

    await db.plan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Plano excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir plano:", error);
    return NextResponse.json({ error: "Falha ao excluir plano" }, { status: 500 });
  }
}