'use client';

import { useState, useTransition } from 'react';
import { uploadImageAction } from '@/actions/image.actions';

export default function UploadImageForm() {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await uploadImageAction(formData);

      if (!result.success) {
        setStatusMessage({ type: 'error', text: result.error as string });
        return;
      }

      setStatusMessage({ type: 'success', text: result.data.message });
      // Resetear el formulario tras éxito
      (event.target as HTMLFormElement).reset();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-6 bg-white rounded-xl shadow-md space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la imagen *</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          required 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
        <textarea 
          id="descripcion" 
          name="descripcion" 
          rows={3} 
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">Archivo *</label>
        <input 
          type="file" 
          id="file" 
          name="file" 
          accept=".png,.jpeg,.jpg,.webp" 
          required 
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {statusMessage && (
        <div className={`p-3 rounded-md text-sm ${statusMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {statusMessage.text}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Subiendo...' : 'Subir Imagen'}
      </button>
    </form>
  );
}