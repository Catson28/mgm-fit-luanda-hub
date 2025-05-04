// services/hooks/useAuth.ts
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<null | { name: string, email?: string }>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para verificar o token e buscar dados do usuário
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include' // Importante para enviar cookies
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error('Authentication check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Função de logout
  const logout = useCallback(async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  // Verificação inicial - sem redirecionamento automático
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, logout, isAuthenticated, checkAuth };
};