// app/galeria/page.tsx
import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid'; // Importamos el componente interactivo

export const dynamic = 'force-dynamic';

interface ImageMetadata {
  id: number;
  nombre: string;
  descripcion?: string;
  filename: string;
  mimetype: string;
}

async function getImages(): Promise<ImageMetadata[]> {
  const apiUrl = "http://api-release-service.api-prod.svc.cluster.local:3000/images";
  const res = await fetch(apiUrl, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function GaleriaPage() {
  const images = await getImages();
  
  // MEJORA DE UX: Ordenamos de más nueva a más vieja para la galería principal
  const sortedImages = [...images].sort((a, b) => b.id - a.id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl relative">
      
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors group font-medium"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200">
            ←
          </span>
          Volver al Inicio
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Galería
          </h1>
          <p className="text-gray-400 mt-2">Recursos visuales almacenados de forma segura.</p>
        </div>
        <Link 
          href="/upload" 
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:-translate-y-1"
        >
          + Nueva Imagen
        </Link>
      </div>

      {sortedImages.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-purple-500/30 bg-[#13131a] rounded-2xl">
          <p className="text-gray-400">No hay imágenes en el sistema.</p>
        </div>
      ) : (
        /* Pasamos los datos ordenados al componente interactivo */
        <GalleryGrid images={sortedImages} />
      )}
    </div>
  );
}