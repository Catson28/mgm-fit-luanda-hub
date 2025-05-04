// caixaContext.tsx
"use client"
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SessaoCaixa, Usuario } from './types';

interface CaixaContextType {
  sessaoAtual: SessaoCaixa | null;
  usuario: Usuario | null;
  abrirCaixa: (usuario: Usuario, saldoInicial: number) => Promise<boolean>;
  fecharCaixa: (saldoFinal: number, observacoes?: string) => Promise<boolean>;
  isLoading: boolean;
}

const CaixaContext = createContext<CaixaContextType | undefined>(undefined);

export const CaixaProvider = ({ children }: { children: ReactNode }) => {
  const [sessaoAtual, setSessaoAtual] = useState<SessaoCaixa | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const abrirCaixa = async (usuario: Usuario, saldoInicial: number) => {
    setIsLoading(true);
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const novaSessao: SessaoCaixa = {
        id: `sessao-${Date.now()}`,
        operadorId: usuario.id,
        dataAbertura: new Date(),
        saldoInicial,
        status: 'aberto'
      };
      
      setSessaoAtual(novaSessao);
      setUsuario(usuario);
      return true;
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fecharCaixa = async (saldoFinal: number, observacoes?: string) => {
    if (!sessaoAtual) return false;
    
    setIsLoading(true);
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calcular diferença entre saldo esperado e saldo informado
      // Em um sistema real, você buscaria todas as transações para calcular o saldo esperado
      const saldoEsperado = sessaoAtual.saldoInicial + 1500; // valor exemplo
      const diferenca = saldoFinal - saldoEsperado;
      
      const sessaoFechada: SessaoCaixa = {
        ...sessaoAtual,
        dataFechamento: new Date(),
        saldoFinal,
        diferencaCaixa: diferenca,
        observacoes,
        status: 'fechado'
      };
      
      setSessaoAtual(sessaoFechada);
      setTimeout(() => {
        setSessaoAtual(null);
        setUsuario(null);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CaixaContext.Provider value={{ 
      sessaoAtual, 
      usuario, 
      abrirCaixa, 
      fecharCaixa,
      isLoading
    }}>
      {children}
    </CaixaContext.Provider>
  );
};

export const useCaixa = () => {
  const context = useContext(CaixaContext);
  if (!context) {
    throw new Error('useCaixa deve ser usado dentro de um CaixaProvider');
  }
  return context;
};