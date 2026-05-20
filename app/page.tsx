import Link from 'next/link';
import Image from 'next/image';

// Forzamos a que la landing consulte al clúster en cada visita para ver si hay fotos nuevas
export const dynamic = 'force-dynamic';

interface ImageMetadata {
  id: number;
  nombre: string;
  descripcion?: string;
  filename: string;
  mimetype: string;
}

// Función para recuperar las imágenes directamente usando la red interna del clúster
async function getLatestImage(): Promise<ImageMetadata | null> {
  try {
    const apiUrl = "http://api-release-service.api-prod.svc.cluster.local:3000/images";
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    
    const images: ImageMetadata[] = await res.json();
    if (images.length === 0) return null;
    
    // El ID más alto (última subida) se coloca en la posición 0.
    const sortedImages = [...images].sort((a, b) => b.id - a.id);
    return sortedImages[0];
  } catch (error) {
    console.error('[LATEST_IMAGE_FETCH_ERROR]', error);
    return null;
  }
}

export default async function RootPage() {
  const latestImage = await getLatestImage();

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-gray-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Elementos decorativos de fondo (Brillos morados) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Lado Izquierdo: Textos e Introducción */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Panel de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              Imágenes
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 font-light">
            Plataforma inmutable y segura para la administración centralizada de recursos visuales del clúster Edge.
          </p>

          {/* Botones de Navegación */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
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
        </div>

        {/* Lado Derecho: Contenedor Dinámico de la Última Foto */}
        <div className="flex flex-col items-center justify-center">
          {latestImage ? (
            <div className="w-full max-w-sm bg-[#13131a] rounded-2xl border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(147,51,234,0.15)] group transition-all duration-300 hover:border-purple-500/60">
              <div className="relative aspect-square w-full bg-[#0a0a0f] overflow-hidden">
                <Image
                  // IMPORTANTE: El cliente descarga de la URL pública
                  src={`https://api.uzbuzbiz.es/images/${latestImage.id}`}
                  alt={latestImage.nombre}
                  fill
                  priority // Fuerza la precarga al ser el elemento visual principal de la landing
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-purple-600/90 text-white font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm">
                  Último aporte
                </div>
              </div>
              <div className="p-5 border-t border-purple-500/10">
                <p className="font-bold text-lg text-gray-100 truncate">{latestImage.nombre}</p>
                {latestImage.descripcion && (
                  <p className="text-sm text-gray-400 truncate mt-1">{latestImage.descripcion}</p>
                )}
              </div>
            </div>
          ) : (
            /* Estado de respaldo por si la base de datos está vacía */
            <div className="w-full max-w-sm aspect-square border-2 border-dashed border-purple-500/20 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-[#13131a]/50 backdrop-blur-sm">
              <p className="text-sm text-gray-500 font-mono mb-2">NO_RESOURCES_FOUND</p>
              <p className="text-xs text-gray-400">La galería del sistema clúster está vacía en este momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Técnico */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-purple-900/60 font-mono uppercase tracking-widest text-center hidden md:block">
        MicroK8s Environment • Standalone Node Runtime
      </div>
    </main>
  );
}