import Image from 'next/image';
import Link from 'next/link';

// Asegúrate de que el backend exponga esta misma estructura
interface ImageMetadata {
  id: number;
  nombre: string;
  descripcion?: string;
  filename: string;
  mimetype: string;
}

async function getImages(): Promise<ImageMetadata[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.uzbuzbiz.es'}/images`;
  const res = await fetch(apiUrl, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function GaleriaPage() {
  const images = await getImages();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Galería</h1>
        <Link 
          href="/upload" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
        >
          + Nueva Imagen
        </Link>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hay imágenes. Sube la primera.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative aspect-square w-full bg-gray-100">
                <Image
                  src={`https://api.uzbuzbiz.es/images/${img.id}`}
                  alt={img.nombre}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 truncate">{img.nombre}</p>
                <p className="text-xs text-gray-500 truncate mt-1">{img.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}