import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { z } from "zod";

// Esquema de validação para criação/atualização de item da galeria
const gallerySchema = z.object({
  title: z.string().min(3),
  description: z.string().nullable(),
  date: z.string().nullable(),
  imageUrl: z.string(),
  imagePublicId: z.string().nullable(),
});

// GET: Listar itens da galeria com filtros e ordenação
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const galleryItems = await db.gallery.findMany({
      where: {
        title: { contains: search, mode: "insensitive" },
      },
      include: {
        image: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Erro ao listar galeria:", error);
    return NextResponse.json(
      { error: "Falha ao listar galeria" },
      { status: 500 }
    );
  }
}

// POST: Criar novo item da galeria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = gallerySchema.parse(body);

    const image = await db.image.create({
      data: {
        url: validated.imageUrl,
        publicId: validated.imagePublicId,
      },
    });

    const galleryItem = await db.gallery.create({
      data: {
        title: validated.title,
        description: validated.description,
        date: validated.date ? new Date(validated.date) : null,
        imageId: image.id,
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(galleryItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao criar item da galeria:", error);
    return NextResponse.json(
      { error: "Falha ao criar item da galeria" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar item da galeria existente
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID do item da galeria é obrigatório" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = gallerySchema.parse(body);

    const existingItem = await db.gallery.findUnique({
      where: { id },
      select: { imageId: true },
    });

    let imageId = existingItem?.imageId;
    if (validated.imageUrl) {
      if (imageId) {
        await db.image.update({
          where: { id: imageId },
          data: {
            url: validated.imageUrl,
            publicId: validated.imagePublicId,
          },
        });
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

    const galleryItem = await db.gallery.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        date: validated.date ? new Date(validated.date) : null,
        imageId,
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao atualizar item da galeria:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar item da galeria" },
      { status: 500 }
    );
  }
}

// DELETE: Excluir item da galeria
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID do item da galeria é obrigatório" },
        { status: 400 }
      );
    }

    await db.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Item da galeria excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir item da galeria:", error);
    return NextResponse.json(
      { error: "Falha ao excluir item da galeria" },
      { status: 500 }
    );
  }
}