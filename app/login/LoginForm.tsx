'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Card, CardBody, Checkbox, Link } from '@nextui-org/react';
import { EyeFilledIcon } from './EyeFilledIcon';
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const { login } = useAuth();  // Consumimos la función login desde el contexto
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(username, password);  // Usamos el login del contexto
      setError(res);
    } catch (error: any) {
      setError(error.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md w-full p-6 shadow-lg bg-gradient-to-br from-purple-50 to-white">
        <CardBody>
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Bienvenido</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Usuario"
              variant="bordered"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isRequired
              className="w-full"
              size="lg"
              placeholder="Ingrese su nombre de usuario"
            />
            <Input
              label="Contraseña"
              variant="bordered"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              className="w-full"
              size="lg"
              placeholder="Ingrese su contraseña"
            />
            <div className="flex justify-between items-center">
              <Link href="/forgot-password" size="sm" className="text-purple-600 hover:underline">
                ¿Olvidó su contraseña?
              </Link>
            </div>
            <Button 
              type="submit" 
              color="primary" 
              fullWidth 
              size="lg"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-600"
              >
                {error}
              </motion.p>
            )}
          </form>          
        </CardBody>
      </Card>
    </motion.div>
  );
}
