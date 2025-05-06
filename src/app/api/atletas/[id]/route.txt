import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth"; // Hypothetical auth utility
import { z } from "zod";

const prisma = new PrismaClient();

// Schema de validação para o parâmetro id
const idSchema = z.string().cuid({ message: "ID inválido" });

// Interface para a resposta do atleta
interface AthleteResponse {
  id: string;
  name: string;
  initials: string | null;
  phone: string | null;
  membershipStart: string | null;
  status: string;
  planId: string | null;
  personId: string | null;
  imageId: string | null;
  plan: {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string | null;
    isPopular: boolean;
    status: string;
    features: { id: string; name: string; included: boolean }[] | null;
  } | null;
  person: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    address: string | null;
    birthDate: string | null;
    phones: { id: string; phone: string }[];
  } | null;
  image: {
    id: string;
    url: string;
    publicId: string | null;
  } | null;
  eventRegistrations: {
    id: string;
    eventId: string;
    athleteId: string;
    registeredAt: string;
    event: {
      id: string;
      title: string;
      description: string | null;
      date: string;
      location: string | null;
      status: string;
      image: {
        id: string;
        url: string;
        publicId: string | null;
      } | null;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Extrair e validar o ID
  const parseResult = idSchema.safeParse(params.id);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0].message },
      { status: 400 }
    );
  }

  // // Verificar autenticação
  // const authHeader = request.headers.get("authorization");
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return NextResponse.json(
  //     { error: "Token de autenticação ausente" },
  //     { status: 401 }
  //   );
  // }

  // const token = authHeader.split(" ")[1];


    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  try {
    const user = await verifyToken(token); // Verifica o token
    if (!user) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Buscar atleta com todas as relações
    const athlete = await prisma.athlete.findUnique({
      where: { id: parseResult.data },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            period: true,
            description: true,
            isPopular: true,
            status: true,
            features: true,
          },
        },
        person: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            address: true,
            birthDate: true,
            phones: {
              select: {
                id: true,
                phone: true,
              },
            },
          },
        },
        image: {
          select: {
            id: true,
            url: true,
            publicId: true,
          },
        },
        eventRegistrations: {
          select: {
            id: true,
            eventId: true,
            athleteId: true,
            registeredAt: true,
            event: {
              select: {
                id: true,
                title: true,
                description: true,
                date: true,
                location: true,
                status: true,
                image: {
                  select: {
                    id: true,
                    url: true,
                    publicId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!athlete) {
      return NextResponse.json(
        { error: "Atleta não encontrado" },
        { status: 404 }
      );
    }

    // Formatar resposta
    const response: AthleteResponse = {
      id: athlete.id,
      name: athlete.name,
      initials: athlete.initials,
      phone: athlete.phone,
      membershipStart: athlete.membershipStart
        ? athlete.membershipStart.toISOString()
        : null,
      status: athlete.status,
      planId: athlete.planId,
      personId: athlete.personId,
      imageId: athlete.imageId,
      plan: athlete.plan
        ? {
            id: athlete.plan.id,
            name: athlete.plan.name,
            price: Number(athlete.plan.price), // Convert Decimal to number
            period: athlete.plan.period,
            description: athlete.plan.description,
            isPopular: athlete.plan.isPopular,
            status: athlete.plan.status,
            features: athlete.plan.features || [],
          }
        : null,
      person: athlete.person
        ? {
            id: athlete.person.id,
            name: athlete.person.name,
            firstName: athlete.person.firstName,
            lastName: athlete.person.lastName,
            email: athlete.person.email,
            address: athlete.person.address,
            birthDate: athlete.person.birthDate
              ? athlete.person.birthDate.toISOString()
              : null,
            phones: athlete.person.phones.map((phone) => ({
              id: phone.id,
              phone: phone.phone,
            })),
          }
        : null,
      image: athlete.image
        ? {
            id: athlete.image.id,
            url: athlete.image.url,
            publicId: athlete.image.publicId,
          }
        : null,
      eventRegistrations: athlete.eventRegistrations.map((registration) => ({
        id: registration.id,
        eventId: registration.eventId,
        athleteId: registration.athleteId,
        registeredAt: registration.registeredAt.toISOString(),
        event: {
          id: registration.event.id,
          title: registration.event.title,
          description: registration.event.description,
          date: registration.event.date.toISOString(),
          location: registration.event.location,
          status: registration.event.status,
          image: registration.event.image
            ? {
                id: registration.event.image.id,
                url: registration.event.image.url,
                publicId: registration.event.image.publicId,
              }
            : null,
        },
      })),
      createdAt: athlete.createdAt.toISOString(),
      updatedAt: athlete.updatedAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro ao buscar atleta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}