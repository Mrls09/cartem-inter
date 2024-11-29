// src/context/AuthContext.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
  two_factor: (username: string, fullCode: string) => Promise<string>;
  forgot_password: (username: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);  // State for token
  const router = useRouter();

  useEffect(() => {
    const tokenFromCookies = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] as string;;;
    if (tokenFromCookies) {
      setToken(tokenFromCookies);  
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.status === 200) {
        router.push(`/login/two-factor?username=${encodeURIComponent(username)}`);
      } else {
        return res.data.message;
      }
    } catch (error) {
      return 'Error de autenticación';
    }
  };
  const forgot_password = async (username: string ) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { "email": username },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 200) {
        router.push(`/login`);
      } else {
        return res.data.message;
      }
    } catch (error) {
      return 'Error de autenticación';
    }
  }
  const two_factor = async(username: string, fullCode: string) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`,
        { username: username, code_two_factor: fullCode },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data.status === 200) {
        const { token , email, roles} = res.data.data; 
        document.cookie = `token=${token}; path=/;`;
        document.cookie = `email=${email}; path=/;`;
        document.cookie = `role=${roles}; path=/;`;
        setToken(token);
        router.push('/dashboard'); 
      } else {
        return res.data.message;
      }
    } catch (error) {
      return 'Error en la autenticación';
    }
  }
  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/; ';
    document.cookie = 'email=; Max-Age=0; path=/;';
    document.cookie = 'role=; Max-Age=0; path=/;';
    setToken(null);
    window.location.reload();  // Esto recargará la página
  };

  return (
    <AuthContext.Provider value={{ token, login, logout , two_factor,forgot_password}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
