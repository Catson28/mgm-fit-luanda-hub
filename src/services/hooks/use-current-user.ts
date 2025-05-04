// hooks/use-current-user.ts
import { useState, useEffect } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  name: string | null;
  roles: Array<{
    role: {
      name: string;
      permissions: Array<{
        name: string;
        resource: string;
      }>;
    };
  }>;
}

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  name: string | null;
  roles: User['roles'];
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setUser(null);
          return;
        }

        // Decode token without verification (we're just reading data)
        const decoded = jwt.decode(token) as DecodedToken;

        if (!decoded || !decoded.id) {
          setUser(null);
          return;
        }

        // Check token expiration
        const expiration = localStorage.getItem('tokenExpiration');
        if (expiration && Date.now() > parseInt(expiration)) {
          // Token expired, try to refresh
          refreshToken();
          return;
        }

        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          roles: decoded.roles
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const refreshToken = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('tokenExpiration', (Date.now() + data.expiresIn * 1000).toString());

        loadUser();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refresh token');
        setUser(null);
        // Clear all auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('user');
      }
    };

    loadUser();

    // Set up interval to check token expiration
    const interval = setInterval(() => {
      const expiration = localStorage.getItem('tokenExpiration');
      if (expiration && Date.now() > parseInt(expiration)) {
        refreshToken();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Utility functions
  const hasRole = (roleName: string) => {
    return user?.roles.some(userRole => userRole.role.name === roleName) ?? false;
  };

  const hasPermission = (permissionName: string, resource?: string) => {
    return user?.roles.some(userRole =>
      userRole.role.permissions.some(
        permission =>
          permission.name === permissionName &&
          (!resource || permission.resource === resource)
      )
    ) ?? false;
  };

  return {
    user,
    loading,
    error,
    hasRole,
    hasPermission,
  };
};