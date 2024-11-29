'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input, Card, CardBody, Checkbox, Link } from '@nextui-org/react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { EyeSlashFilledIcon } from '../login/EyeSlashFilledIcon';
import { EyeFilledIcon } from '../login/EyeFilledIcon';

export default function ForgotPasswordForm() {
  const { forgot_password } = useAuth();  // Consumimos la función login desde el contexto
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgot_password(username);  // Usamos el login del contexto
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
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Recuperar contraseña</h2>
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
            <Button 
              type="submit" 
              color="primary" 
              fullWidth 
              size="lg"
              isLoading={loading}
              className="bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              {loading ? "" : "Recuperar"}
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
