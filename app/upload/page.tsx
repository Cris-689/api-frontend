import UploadImageForm from '@/components/forms/UploadImageForm';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Subir Recurso</h1>
          <Link href="/galeria" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
            &larr; Volver
          </Link>
        </div>
        <UploadImageForm />
      </div>
    </div>
  );
}