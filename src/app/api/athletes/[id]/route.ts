// src/app/api/athletes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { z } from "zod";

// Schema de validação
const athleteSchema = z.object({
  name: z.string().min(3),
  initials: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  membershipStart: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
  planId: z.string().optional().nullable(),
  personId: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

// Interface para tipagem dos parâmetros
interface RouteParams {
  params: Promise<{ id: string }>; // params agora é um Promise
}

// Método GET
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params; // Resolver a Promise
    const { id } = params;

    const athlete = await db.athlete.findUnique({
      where: { id },
      include: {
        plan: true,
        image: true,
        person: {
          include: {
            phones: true,
          },
        },
      },
    });

    if (!athlete) {
      return NextResponse.json({ error: "Atleta não encontrado" }, { status: 404 });
    }

    // Formatar resposta
    const formattedAthlete = {
      id: athlete.id,
      name: athlete.name,
      initials: athlete.initials,
      phone: athlete.phone || (athlete.person?.phones?.[0]?.phone || null),
      membershipStart: athlete.membershipStart,
      status: athlete.status,
      planId: athlete.planId,
      plan: athlete.plan,
      imageUrl: athlete.image?.url || null,
      createdAt: athlete.createdAt,
    };

    return NextResponse.json(formattedAthlete);
  } catch (error) {
    console.error(`Error fetching athlete:`, error);
    return NextResponse.json({ error: "Falha ao buscar atleta" }, { status: 500 });
  }
}

// Método PUT
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params; // Resolver a Promise
    const { id } = params;
    const body = await request.json();

    // Verificar se o atleta existe
    const existingAthlete = await db.athlete.findUnique({
      where: { id },
    });

    if (!existingAthlete) {
      return NextResponse.json({ error: "Atleta não encontrado" }, { status: 404 });
    }

    // Validar dados recebidos
    const validatedData = athleteSchema.parse(body);

    // Extrair a URL da imagem se fornecida
    const { imageUrl, ...athleteData } = validatedData;

    // Se uma URL de imagem foi fornecida, criar ou atualizar o registro da imagem
    let imageId = existingAthlete.imageId;
    if (imageUrl) {
      if (imageId) {
        // Atualizar imagem existente
        await db.image.update({
          where: { id: imageId },
          data: { url: imageUrl },
        });
      } else {
        // Criar nova imagem
        const image = await db.image.create({
          data: {
            url: imageUrl,
            publicId: null,
          },
        });
        imageId = image.id;
      }
    }

    // Atualizar o atleta
    const updatedAthlete = await db.athlete.update({
      where: { id },
      data: {
        ...athleteData,
        imageId,
      },
      include: {
        plan: true,
        image: true,
        person: {
          include: {
            phones: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAthlete);
  } catch (error) {
    console.error(`Error updating athlete:`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Falha ao atualizar atleta" }, { status: 500 });
  }
}

// Método DELETE
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const params = await context.params; // Resolver a Promise
    const { id } = params;

    // Verificar se o atleta existe
    const existingAthlete = await db.athlete.findUnique({
      where: { id },
    });

    if (!existingAthlete) {
      return NextResponse.json({ error: "Atleta não encontrado" }, { status: 404 });
    }

    // Excluir o atleta
    await db.athlete.delete({
      where: { id },
    });

    // Se o atleta tinha uma imagem associada e não está sendo usada por outros registros, excluí-la
    if (existingAthlete.imageId) {
      const imageUsageCount = await db.athlete.count({
        where: { imageId: existingAthlete.imageId },
      });

      if (imageUsageCount === 0) {
        await db.image.delete({
          where: { id: existingAthlete.imageId },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting athlete:`, error);
    return NextResponse.json({ error: "Falha ao excluir atleta" }, { status: 500 });
  }
}