import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { z } from "zod";


// Esquema de validação para registro de evento
const registrationSchema = z.object({
  eventId: z.string(),
  athleteId: z.string(),
});

// POST: Criar novo registro de evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registrationSchema.parse(body);

    const registration = await db.eventRegistration.create({
      data: {
        eventId: validated.eventId,
        athleteId: validated.athleteId,
      },
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            initials: true,
          },
        },
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar registro:", error);
    return NextResponse.json({ error: "Falha ao criar registro" }, { status: 500 });
  }
}

// DELETE: Excluir registro de evento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID do registro é obrigatório" },
        { status: 400 }
      );
    }

    await db.eventRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Registro excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir registro:", error);
    return NextResponse.json({ error: "Falha ao excluir registro" }, { status: 500 });
  }
}