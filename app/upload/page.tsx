import UploadImageForm from '@/components/forms/UploadImageForm';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Subir Nueva Imagen</h1>
          <Link href="/galeria" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Volver a la galería
          </Link>
        </div>
        
        {/* Aquí inyectamos el Client Component que maneja el FormData y la Server Action */}
        <UploadImageForm />
      </div>
    </div>
  );
}