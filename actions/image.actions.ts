'use server';

import { revalidatePath } from 'next/cache';  

export type UploadState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function uploadImageAction(prevState: UploadState, formData: FormData): Promise<UploadState> {
  try {
    const file = formData.get('file') as File | null;
    const nombre = formData.get('nombre') as string | null;
    const descripcion = formData.get('descripcion') as string | null;
    const apiKeyForm = formData.get('apiKey') as string | null;

    if (!file || file.size === 0 || !nombre) {
      return { success: false, error: 'El archivo y el nombre son obligatorios.' };
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.uzbuzbiz.es'}/images/upload`;
    const apiKey = apiKeyForm || process.env.UPLOAD_API_KEY; 

    if (!apiKey) {
      return { success: false, error: 'Debes proporcionar una Clave de API para subir archivos.' };
    }

    // 🔥 EL FIX: Creamos un FormData limpio y estricto para NestJS
    const cleanFormData = new FormData();
    cleanFormData.append('file', file);
    cleanFormData.append('nombre', nombre);
    if (descripcion) {
      cleanFormData.append('descripcion', descripcion);
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey, // La API Key va en los headers, como espera NestJS
      },
      body: cleanFormData, // Mandamos el FormData limpio, sin rastros de Next.js
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al subir la imagen (¿Clave incorrecta?)');
    }

    const data = await response.json();

    revalidatePath('/galeria');

    return { success: true, message: data.message || 'Imagen subida con éxito' };
  } catch (error) {
    console.error('[UPLOAD_ACTION_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    };
  }
}