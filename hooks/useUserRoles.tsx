// src/hooks/useUserRole.ts
import { useEffect, useState } from 'react';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const rolesCookie = document.cookie.split('; ').find(row => row.startsWith('roles='));
    if (rolesCookie) {
      const role = rolesCookie.split('=')[1];  // Esto es solo un string "ROLE_ADMIN"
      setRole(role);
    }
  }, []);

  return role;
};
