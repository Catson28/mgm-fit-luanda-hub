import { NextResponse } from 'next/server';
import { db } from "@/services/lib/db";

export async function GET() {
  try {
    const corporatePlans = await db.corporatePlan.findMany();
    return NextResponse.json(corporatePlans);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch corporate plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const corporatePlan = await db.corporatePlan.create({
      data: {
        name: data.name,
        description: data.description,
        discount: parseFloat(data.discount),
        minEmployees: parseInt(data.minEmployees),
        maxEmployees: data.maxEmployees ? parseInt(data.maxEmployees) : null,
      },
    });
    return NextResponse.json(corporatePlan);
  } catch {
    return NextResponse.json({ error: 'Failed to create corporate plan' }, { status: 500 });
  }
}