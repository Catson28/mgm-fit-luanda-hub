import { NextResponse } from 'next/server';
import { db } from "@/services/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || null;
    const status = searchParams.get('status') || null;
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (plan && plan !== 'Todos') {
      where.plan = { name: { contains: plan, mode: 'insensitive' } };
    }
    if (status) {
      where.status = status;
    }

    const athletes = await db.athlete.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        plan: true,
        image: true,
      },
    });

    const total = await db.athlete.count({ where });

    return NextResponse.json({
      data: athletes,
      meta: { total, page, limit },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const athlete = await db.athlete.create({
      data: {
        name: data.name,
        initials: data.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase(),
        phone: data.phone,
        membershipStart: data.membershipStart ? new Date(data.membershipStart) : null,
        status: data.status || 'ACTIVE',
        planId: data.planId,
        imageId: data.imageId,
      },
    });
    return NextResponse.json(athlete);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 });
  }
}