// types.ts

// Tipo para o status do caixa
export type StatusCaixa = 'aberto' | 'fechado';

// Interface para o usuário/operador do caixa
export interface Usuario {
  id: string;
  nome: string;
  email?: string;
  // Outros campos que você precise
}

// Interface para a sessão do caixa
export interface SessaoCaixa {
  id: string;
  operadorId: string;
  dataAbertura: Date;
  dataFechamento?: Date;
  saldoInicial: number;
  saldoFinal?: number;
  diferencaCaixa?: number;
  observacoes?: string;
  status: StatusCaixa;
  // Outros campos que você precise
}

// Se precisar de outros tipos relacionados ao caixa, pode adicionar aqui
export interface TransacaoCaixa {
  id: string;
  sessaoId: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  descricao: string;
  data: Date;
}