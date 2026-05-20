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

    const cleanFormData = new FormData();
    
    // Rompemos el File de Next.js a bytes puros y lo convertimos en un Blob nativo.
    // Esto evita que el fetch interno de Node.js se congele al intentar streamearlo.
    const fileBytes = await file.arrayBuffer();
    const fileBlob = new Blob([fileBytes], { type: file.type });
    
    // CRÍTICO: Hay que pasar explícitamente 'file.name' como tercer parámetro
    // para que Multer en NestJS sepa cómo se llama el archivo.
    cleanFormData.append('file', fileBlob, file.name);
    
    cleanFormData.append('nombre', nombre);
    if (descripcion) {
      cleanFormData.append('descripcion', descripcion);
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey, 
      },
      body: cleanFormData, 
    });

    if (!response.ok) {
      // Capturamos la respuesta cruda del backend para ver qué falló realmente
      const errorText = await response.text();
      console.error('[NESTJS_REJECTED]', errorText);
      throw new Error('Error en el backend al subir la imagen. (Ver consola del servidor)');
    }

    const data = JSON.parse(await response.text());
    
    // Purgamos la caché de la galería
    revalidatePath('/galeria');
    
    return { success: true, message: data.message || 'Imagen subida con éxito' };
  } catch (error) {
    console.error('[UPLOAD_ACTION_CRITICAL_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    };
  }
}