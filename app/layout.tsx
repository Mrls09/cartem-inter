import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { Providers } from './providers' // Asegúrate de importar desde la ubicación correcta

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}
