// src/types/next.d.ts
// Sobrescrever as definições de tipos do Next.js para APIs de rotas dinâmicas
// import type { NextRequest } from 'next/server';

declare module 'next' {
  export interface RouteHandlerContext {
    params: Record<string, string | string[]>;
  }
}

declare global {
  interface RequestContext {
    params: Record<string, string | string[]>;
  }
}

export {};