// components/GalleryGrid.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

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

  return (
    <>
      {/* Grid de la galería */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedImage(img)} // Al hacer clic, se activa el modal
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

      {/* MODAL / LIGHTBOX (Solo se renderiza si hay una imagen seleccionada) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm transition-all"
          onClick={() => setSelectedImage(null)} // Cierra al hacer clic en el fondo oscuro
        >
          {/* Botón de cerrar */}
          <button 
            className="absolute top-6 right-6 text-gray-400 hover:text-white text-4xl font-light transition-colors z-50"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>

          {/* Contenedor de la imagen */}
          <div 
            className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic sobre la propia imagen
          >
            {/* Usamos etiqueta img nativa aquí para permitir un escalado proporcional libre en modales */}
            <img
              src={`https://api.uzbuzbiz.es/images/${selectedImage.id}`}
              alt={selectedImage.nombre}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.4)]"
            />
          </div>

          {/* Información ampliada debajo de la foto */}
          <div 
            className="mt-6 text-center max-w-2xl px-4"
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