import { NextResponse } from 'next/server';
import { db } from "@/services/lib/db";

export async function GET() {
  try {
    const events = await db.event.findMany({
      include: {
        image: true,
        registrations: { include: { athlete: true } },
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        location: data.location,
        imageId: data.imageId,
        status: data.status || 'SCHEDULED',
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}