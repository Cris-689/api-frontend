import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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
    <div className="container mx-auto px-4 py-12 max-w-7xl relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Galería</h1>
          <p className="text-gray-400 mt-2">Recursos visuales almacenados en el backend.</p>
        </div>
        <Link 
          href="/upload" 
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:-translate-y-1"
        >
          + Nueva Imagen
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-purple-500/30 bg-[#13131a] rounded-2xl">
          <p className="text-gray-400">No hay imágenes. Sube la primera para iluminar este espacio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-[#13131a] rounded-xl border border-purple-500/20 hover:border-purple-500/60 overflow-hidden group hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-300">
              <div className="relative aspect-square w-full bg-[#0a0a0f] overflow-hidden">
                <Image
                  src={`https://api.uzbuzbiz.es/images/${img.id}`}
                  alt={img.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5">
                <p className="font-bold text-gray-100 truncate">{img.nombre}</p>
                <p className="text-xs text-purple-400/70 truncate mt-1">{img.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}