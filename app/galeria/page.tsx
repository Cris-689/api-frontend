import Image from 'next/image';
import Link from 'next/link';

interface ImageMetadata {
  id: number;
  nombre: string;
  descripcion?: string;
  filename: string;
  mimetype: string;
}

// Fetch directamente de servidor a servidor
async function getImagesMetadata(): Promise<ImageMetadata[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.uzbuzbiz.es'}/images`;
  
  const response = await fetch(apiUrl, {
    // Evitamos caché agresiva en la galería para ver cambios inmediatos tras subir archivos
    cache: 'no-store', 
  });

  if (!response.ok) {
    throw new Error('No se pudo recuperar el listado de imágenes.');
  }

  return response.json();
}

export default async function GaleriaPage() {
  try {
    const images = await getImagesMetadata();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Galería del Sistema</h1>
            <p className="text-sm text-gray-500 mt-1">Imágenes almacenadas en el backend inmutable.</p>
          </div>
          <Link 
            href="/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Subir Imagen
          </Link>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 text-base">No hay imágenes disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div 
                key={img.id} 
                className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden flex flex-col transition duration-200"
              >
                {/* Contenedor optimizado para Next.js Image */}
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                  <Image
                    src={`https://api.uzbuzbiz.es/images/${img.id}`} // Consumiendo tu endpoint GET existente
                    alt={img.nombre}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-102 transition duration-300"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800 text-base truncate" title={img.nombre}>
                      {img.nombre}
                    </h2>
                    {img.descripcion && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={img.descripcion}>
                        {img.descripcion}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-4 pt-2 border-t border-gray-50">
                    <span className="truncate max-w-[120px]">{img.filename}</span>
                    <span className="uppercase px-1.5 py-0.5 bg-gray-100 rounded font-medium text-gray-600">
                      {img.mimetype.split('/')[1]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto p-6 bg-red-50 rounded-xl border border-red-100">
          <h2 className="text-red-800 font-semibold text-lg">Error de Comunicación</h2>
          <p className="text-red-600 text-sm mt-1">
            No se pudo sincronizar la galería con el clúster de producción. Asegúrate de que el servicio API esté arriba.
          </p>
        </div>
      </div>
    );
  }
}