'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { deleteImageAction } from '@/actions/image.actions';

interface ImageMetadata {
  id: number;
  nombre: string;
  descripcion?: string;
  filename: string;
  mimetype: string;
}

export default function GalleryGrid({ images }: { images: ImageMetadata[] }) {
  // Estado para controlar qué imagen se está visualizando en grande
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  
  // Hook para controlar el estado de carga al borrar asíncronamente
  const [isPending, startTransition] = useTransition();

  // Función para manejar el borrado
  const handleDelete = () => {
    if (!selectedImage) return;

    // Confirmación de seguridad
    const confirmDelete = window.confirm(`⚠️ ¿Seguro que quieres borrar permanentemente "${selectedImage.nombre}"?`);
    if (!confirmDelete) return;

    // Ejecutamos la Server Action
    startTransition(async () => {
      const result = await deleteImageAction(selectedImage.id);
      
      if (result.success) {
        setSelectedImage(null); // Cerramos el modal
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    });
  };

  return (
    <>
      {/* Grid principal de la galería */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedImage(img)}
            className="bg-[#13131a] rounded-xl border border-purple-500/20 hover:border-purple-500/60 overflow-hidden group hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-300 cursor-pointer"
          >
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

      {/* MODAL / LIGHTBOX interactivo */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm transition-all"
          onClick={() => setSelectedImage(null)} // Cierra al hacer clic en el fondo oscuro
        >
          {/* Botón de cerrar superior */}
          <button 
            className="absolute top-6 right-6 text-gray-400 hover:text-white text-4xl font-light transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>

          {/* Contenedor central de la imagen y el botón de borrar */}
          <div 
            className="relative max-w-5xl max-h-[75vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal si haces clic en la foto
          >
            {/* Usamos etiqueta img nativa para permitir escalado proporcional libre en modales */}
            <img
              src={`https://api.uzbuzbiz.es/images/${selectedImage.id}`}
              alt={selectedImage.nombre}
              className="max-w-full max-h-[70vh] object-contain rounded-xl border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.4)]"
            />
            
            {/* Botón de borrado anclado a la esquina inferior derecha de la imagen */}
            <div className="absolute -bottom-16 right-0">
               <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-4 py-2 bg-red-900/50 hover:bg-red-600 border border-red-500/50 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
               >
                  {isPending ? (
                     <>
                        <span className="animate-spin text-lg">x</span> Procesando...
                     </>
                  ) : (
                     <>
                        Eliminar Recurso
                     </>
                  )}
               </button>
            </div>
          </div>

          {/* Información ampliada debajo de la foto */}
          <div 
            className="mt-20 text-center max-w-2xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white tracking-tight">{selectedImage.nombre}</h3>
            {selectedImage.descripcion && (
              <p className="text-gray-400 mt-2 text-sm font-light leading-relaxed">{selectedImage.descripcion}</p>
            )}
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-mono text-purple-400/50 uppercase tracking-wider">
              <span>{selectedImage.filename}</span>
              <span>•</span>
              <span>{selectedImage.mimetype}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}