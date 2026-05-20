import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Panel de Imágenes',
  description: 'Gestor inmutable de recursos visuales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Aplicamos el fondo oscuro y texto claro a nivel global */}
      <body className={`${inter.className} bg-[#0a0a0f] text-gray-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}