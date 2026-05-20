// app/page.tsx
import Link from 'next/link';

export default function RootPage() {
  return (
    // Contenedor principal: Altura mínima de pantalla, fondo oscuro puro
    <main className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo (Brillos morados desenfocados) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-3xl w-full space-y-12 text-center z-10">
        
        {/* Sección de Texto / Hero */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Panel de{' '}
            {/* Texto con gradiente morado */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              Imágenes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Plataforma inmutable y segura para la administración centralizada de recursos visuales del clúster.
          </p>
        </div>

        {/* Botones de Navegación (Responsive: en columna en móvil, en fila en PC) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link 
            href="/galeria"
            className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            Explorar Galería
          </Link>
          
          <Link 
            href="/upload"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-purple-200 hover:bg-purple-900/20 font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
          >
            Subir Nuevo Recurso
          </Link>
        </div>
        
        {/* Footer técnico decorativo */}
        <div className="pt-16 text-xs text-purple-900/60 font-mono flex flex-col items-center gap-1 uppercase tracking-widest">
          <p>MicroK8s Edge Cluster</p>
          <p>Next.js Node Runtime</p>
        </div>
      </div>
    </main>
  );
}