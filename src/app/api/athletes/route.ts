// src/app/api/athletes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/services/lib/db";
import { Prisma } from "@prisma/client";
import { AthleteStatus } from "@prisma/client";
import { z } from "zod";

const athleteSchema = z.object({
  name: z.string().min(3),
  initials: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  membershipStart: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).default("ACTIVE"),
  planId: z.string().optional().nullable(),
  personId: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

// GET /api/athletes - Lista todos os atletas com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extrair parâmetros de busca
    const search = searchParams.get("search");
    const status = searchParams.get("status") as AthleteStatus | null;
    const planId = searchParams.get("planId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    
    // Construir filtros para a query
    const where: Prisma.AthleteWhereInput = {};
    
    // Filtro por nome ou telefone
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { initials: { contains: search, mode: "insensitive" } },
        { 
          person: { 
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { 
                phones: {
                  some: {
                    phone: { contains: search, mode: "insensitive" }
                  }
                }
              }
            ]
          }
        }
      ];
    }
    
    // Filtro por status
    if (status) {
      where.status = status;
    }
    
    // Filtro por plano
    if (planId) {
      if (planId === "no-plan") {
        where.planId = null;
      } else {
        where.planId = planId;
      }
    }
    
    // Filtro por data de início da assinatura
    if (startDate || endDate) {
      where.membershipStart = {};
      
      if (startDate) {
        where.membershipStart.gte = new Date(startDate);
      }
      
      if (endDate) {
        where.membershipStart.lte = new Date(endDate);
      }
    }
    
    // Buscar atletas com os filtros aplicados
    const athletes = await db.athlete.findMany({
      where,
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            period: true,
          },
        },
        image: {
          select: {
            url: true,
          },
        },
        person: {
          include: {
            phones: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    
    // Formatar resposta
    const formattedAthletes = athletes.map(athlete => {
      // Se não houver telefone diretamente no atleta, buscar do relacionamento com Person
      const phone = athlete.phone || (athlete.person?.phones?.[0]?.phone || null);
      
      return {
        id: athlete.id,
        name: athlete.name,
        initials: athlete.initials,
        phone: phone,
        membershipStart: athlete.membershipStart,
        status: athlete.status,
        planId: athlete.planId,
        plan: athlete.plan,
        imageUrl: athlete.image?.url || null,
        createdAt: athlete.createdAt,
      };
    });
    
    return NextResponse.json(formattedAthletes);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    return NextResponse.json({ error: "Falha ao buscar atletas" }, { status: 500 });
  }
}

// POST /api/athletes - Criar novo atleta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados recebidos
    const validatedData = athleteSchema.parse(body);
    
    // Extrair a URL da imagem se fornecida
    const { imageUrl, ...athleteData } = validatedData;
    
    // Se uma URL de imagem foi fornecida, criar ou buscar o registro da imagem
    let imageId = null;
    if (imageUrl) {
      const image = await db.image.create({
        data: {
          url: imageUrl,
          publicId: null, // Você pode adicionar logic para gerar um publicId se necessário
        },
      });
      imageId = image.id;
    }
    
    // Criar o atleta
    const athlete = await db.athlete.create({
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
    
    return NextResponse.json(athlete, { status: 201 });
  } catch (error) {
    console.error("Error creating athlete:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Falha ao criar atleta" }, { status: 500 });
  }
}