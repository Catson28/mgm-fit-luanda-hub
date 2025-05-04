// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth";

// Inicializa o NextAuth com as opções
const { handlers } = NextAuth(authOptions);

// Exporta os manipuladores HTTP necessários
export const GET = handlers.GET;
export const POST = handlers.POST;