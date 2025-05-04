import { NextResponse } from 'next/server';
import { db } from "@/services/lib/db";

export async function GET() {
  try {
    const gallery = await db.gallery.findMany({
      include: { image: true },
    });
    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const galleryItem = await db.gallery.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : null,
        imageId: data.imageId,
      },
    });
    return NextResponse.json(galleryItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}