import { NextResponse } from 'next/server';
import { db } from "@/services/lib/db";

export async function GET() {
  try {
    const plans = await db.plan.findMany({
      where: { status: 'ACTIVE' },
      include: { features: true },
    });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const plan = await db.plan.create({
      data: {
        name: data.name,
        price: data.price,
        period: data.period,
        description: data.description,
        isPopular: data.isPopular || false,
        status: data.status || 'ACTIVE',
        features: {
          create: data.features?.map((feature: string) => ({
            name: feature,
            included: true,
          })) || [],
        },
      },
    });
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
