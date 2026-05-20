'use client';

import { useActionState } from 'react';
import { uploadImageAction } from '@/actions/image.actions';

const initialState = { success: false, error: '', message: '' };

export default function UploadImageForm() {
  const [state, formAction, isPending] = useActionState(uploadImageAction, initialState);

  return (
    <form action={formAction} className="p-8 bg-[#13131a] rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.05)] space-y-6 relative overflow-hidden">
      
      {/* Reflejo decorativo en el formulario */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-[50px] -z-10 pointer-events-none"></div>

      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">Clave de API (Secret Key) *</label>
        <input 
          type="password" 
          id="apiKey" 
          name="apiKey" 
          required 
          placeholder="Introduce la llave para autorizar la subida..."
          className="block w-full rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-gray-100 placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 sm:text-sm p-3 transition-all"
        />
      </div>

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">Nombre de la imagen *</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          required 
          className="block w-full rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-gray-100 placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 sm:text-sm p-3 transition-all"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">Descripción (Opcional)</label>
        <textarea 
          id="descripcion" 
          name="descripcion" 
          rows={3} 
          className="block w-full rounded-xl bg-[#0a0a0f] border border-purple-500/30 text-gray-100 placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 sm:text-sm p-3 transition-all"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">Archivo *</label>
        <input 
          type="file" 
          id="file" 
          name="file" 
          accept=".png,.jpeg,.jpg,.webp" 
          required 
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/30 file:transition-colors file:cursor-pointer cursor-pointer border border-purple-500/20 rounded-xl bg-[#0a0a0f] p-2"
        />
      </div>

      {state.error && (
        <div className="p-4 rounded-xl text-sm bg-red-900/20 border border-red-500/30 text-red-400">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="p-4 rounded-xl text-sm bg-green-900/20 border border-green-500/30 text-green-400">
          {state.message}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-purple-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isPending ? 'Procesando en el clúster...' : 'Subir Imagen'}
      </button>
    </form>
  );
}