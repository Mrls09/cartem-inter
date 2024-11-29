import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import Head from "next/head"; // Importar el componente Head de Next.js

import { Providers } from "../providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { ToastContainer } from 'react-toastify'; // Importar ToastContainer si usas react-toastify
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="description" content={siteConfig.description} />
        <link rel="icon" href="/favicon.ico" />
        {/* Puedes agregar más meta información aquí */}
      </Head>
      <body
        className={clsx(
          "min-h-screen font-sans antialiased bg-gradient-to-b from-purple-500 to-purple-700",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            {/* Añadir ToastContainer si deseas notificaciones globales */}
            <ToastContainer />
            <main className="container mx-auto px-6 py-8 flex-grow overflow-auto">
              <div className="bg-purple-400 backdrop-blur-sm rounded-lg shadow-lg p-6">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
