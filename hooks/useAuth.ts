// hooks/useAuth.ts
import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar el token en las cookies
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated;
}
