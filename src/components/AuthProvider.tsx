// components/AuthProvider.tsx
"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth as useAuthHook } from '@/services/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

// Create context
const AuthContext = createContext<ReturnType<typeof useAuthHook> | undefined>(undefined);

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();
  const pathname = usePathname();
  const router = useRouter();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Efeito para verificação inicial de autenticação
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // Tentativa de verificar a autenticação sem redirecionar
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        
        // Se a verificação inicial foi feita, marcamos como concluída
        setInitialCheckDone(true);
        
        // Não redirecionamos aqui, apenas marcamos que a verificação foi concluída
      } catch (error) {
        console.error('Erro na verificação inicial:', error);
        setInitialCheckDone(true);
      }
    };
    
    checkInitialAuth();
  }, []);

  // Efeito separado para redirecionamento, que só é executado após a verificação inicial
  useEffect(() => {
    // Só redireciona se:
    // 1. A verificação inicial foi concluída
    // 2. O usuário não está autenticado
    // 3. A página atual requer autenticação (não é uma rota pública)
    const requiresAuth = !publicRoutes.includes(pathname) && 
                         !pathname.startsWith('/auth/');
                         
    if (initialCheckDone && !auth.isAuthenticated && requiresAuth) {
      // Adicione console.log para depuração
      console.log('Redirecionando para login:', {
        initialCheckDone,
        isAuthenticated: auth.isAuthenticated,
        pathname,
        requiresAuth
      });
      
      router.push('/login');
    }
  }, [initialCheckDone, auth.isAuthenticated, pathname, router]);

  // Se ainda estiver carregando a autenticação inicial, pode mostrar um loader
  if (!initialCheckDone) {
    return <div>Carregando...</div>; // Ou qualquer componente de loading
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};