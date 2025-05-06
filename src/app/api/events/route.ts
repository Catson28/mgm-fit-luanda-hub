import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { z } from "zod";

// const prisma = new PrismaClient();

// Esquema de validação para criação/atualização de evento
const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().nullable(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
  location: z.string().nullable(),
  status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"]),
  imageUrl: z.string().nullable(),
  imagePublicId: z.string().nullable(),
  athleteIds: z.array(z.string()).optional(),
});

// GET: Listar eventos com filtros e ordenação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const events = await db.event.findMany({
      where: {
        title: { contains: search, mode: "insensitive" },
      },
      include: {
        image: true,
        registrations: {
          include: {
            athlete: {
              select: {
                id: true,
                name: true,
                initials: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    return NextResponse.json(
      { error: "Falha ao listar eventos" },
      { status: 500 }
    );
  }
}

// POST: Criar novo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = eventSchema.parse(body);

    let imageId: string | null = null;
    if (validated.imageUrl) {
      const image = await db.image.create({
        data: {
          url: validated.imageUrl,
          publicId: validated.imagePublicId,
        },
      });
      imageId = image.id;
    }

    const event = await db.event.create({
      data: {
        title: validated.title,
        description: validated.description,
        date: new Date(validated.date),
        location: validated.location,
        status: validated.status,
        imageId,
        registrations: {
          create: validated.athleteIds?.map((athleteId) => ({
            athleteId,
          })),
        },
      },
      include: {
        image: true,
        registrations: {
          include: {
            athlete: {
              select: {
                id: true,
                name: true,
                initials: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: "Falha ao criar evento" }, { status: 500 });
  }
}

// PUT: Atualizar evento existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID do evento é obrigatório" }, { status: 400 });
    }

    const body = await request.json();
    const validated = eventSchema.parse(body);

    let imageId: string | null = null;
    if (validated.imageUrl) {
      const existingImage = await db.event.findUnique({
        where: { id },
        select: { imageId: true },
      });

      if (existingImage?.imageId) {
        await db.image.update({
          where: { id: existingImage.imageId },
          data: {
            url: validated.imageUrl,
            publicId: validated.imagePublicId,
          },
        });
        imageId = existingImage.imageId;
      } else {
        const image = await db.image.create({
          data: {
            url: validated.imageUrl,
            publicId: validated.imagePublicId,
          },
        });
        imageId = image.id;
      }
    }

    // Atualizar evento
    const event = await db.event.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        date: new Date(validated.date),
        location: validated.location,
        status: validated.status,
        imageId,
      },
      include: {
        image: true,
      },
    });

    // Sincronizar registros
    await db.eventRegistration.deleteMany({
      where: { eventId: id },
    });

    if (validated.athleteIds && validated.athleteIds.length > 0) {
      await db.eventRegistration.createMany({
        data: validated.athleteIds.map((athleteId) => ({
          eventId: id,
          athleteId,
        })),
      });
    }

    // Buscar evento atualizado com registros
    const updatedEvent = await db.event.findUnique({
      where: { id },
      include: {
        image: true,
        registrations: {
          include: {
            athlete: {
              select: {
                id: true,
                name: true,
                initials: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: "Falha ao atualizar evento" }, { status: 500 });
  }
}

// DELETE: Excluir evento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID do evento é obrigatório" }, { status: 400 });
    }

    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return NextResponse.json({ error: "Falha ao excluir evento" }, { status: 500 });
  }
}