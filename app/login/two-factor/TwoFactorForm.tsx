'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react'
import { Card, CardBody, Button, Input } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { FaLock } from 'react-icons/fa'

export default function TwoFactorForm() {
  const { two_factor } = useAuth();  // Consumimos la función login desde el contexto
  const searchParams = useSearchParams();
  const username = searchParams.get('username'); 

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0))
    }, 1000)

    return () => clearInterval(countdown)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (isNaN(Number(value))) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Establecer loading en true antes de la llamada
    try {
      const fullCode = code.join(''); 
      const res = await two_factor(username || '', fullCode);
      setError(res);
    } catch (error: any) {
      setError(error.message || 'Error de autenticación'); 
    } finally {
      setLoading(false); 
      setCode(['', '', '', '', '', '']); // Resetear el código en el caso de éxito o error
    }
  };
  const handleResendCode = () => {
    // Implement resend code logic here
    setTimer(30)
    console.log('Resending code...')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md w-full mx-auto shadow-lg bg-gradient-to-br from-purple-50 to-white">
        <CardBody className="p-8">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <FaLock className="text-5xl text-purple-600" />
            </motion.div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Verificación de Código</h1>
          <p className="text-center text-gray-600 mb-6">
            Ingrese el código de 6 dígitos enviado a su correo
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between space-x-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-2xl"
                  variant="bordered"
                  size="lg"
                />
              ))}
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
              size="lg"
              disabled={loading || code.some((digit) => digit === '')}
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">
              ¿No recibió el código?
            </p>
            <Button
              variant="light"
              color="primary"
              disabled={timer > 0}
              onClick={handleResendCode}
            >
              {timer > 0 ? `Reenviar código en ${timer}s` : 'Reenviar código'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
