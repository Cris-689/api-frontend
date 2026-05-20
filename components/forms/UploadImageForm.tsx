'use client';

import { useActionState } from 'react';
import { uploadImageAction } from '@/actions/image.actions';

const initialState = {
  success: false,
  error: '',
  message: '',
};

export default function UploadImageForm() {
  const [state, formAction, isPending] = useActionState(uploadImageAction, initialState);

  return (
    <form action={formAction} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre *</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          required 
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
        <textarea 
          id="descripcion" 
          name="descripcion" 
          rows={3} 
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
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

      {state.error && (
        <div className="p-3 rounded-md text-sm bg-red-50 text-red-700">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="p-3 rounded-md text-sm bg-green-50 text-green-700">
          {state.message}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isPending ? 'Subiendo...' : 'Subir Imagen'}
      </button>
    </form>
  );
}