'use server';

export type UploadState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function uploadImageAction(prevState: UploadState, formData: FormData): Promise<UploadState> {
  try {
    const file = formData.get('file') as File | null;
    const nombre = formData.get('nombre') as string | null;

    if (!file || file.size === 0 || !nombre) {
      return { success: false, error: 'El archivo y el nombre son obligatorios.' };
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.uzbuzbiz.es'}/images/upload`;
    const apiKey = process.env.UPLOAD_API_KEY; 

    if (!apiKey) {
      throw new Error('API Key no configurada en el servidor.');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData, 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al subir la imagen al backend');
    }

    const data = await response.json();
    return { success: true, message: data.message || 'Imagen subida con éxito' };
  } catch (error) {
    console.error('[UPLOAD_ACTION_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    };
  }
}