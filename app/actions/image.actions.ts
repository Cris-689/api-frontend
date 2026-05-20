'use server';

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    const nombre = formData.get('nombre') as string | null;

    if (!file || !nombre) {
      return { success: false, error: 'El archivo y el nombre son obligatorios.' };
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.uzbuzbiz.es'}/images/upload`;
    const apiKey = process.env.UPLOAD_API_KEY; // Variable secreta inyectada por K8s Secrets

    if (!apiKey) {
      throw new Error('API Key no configurada en el entorno.');
    }

    // Petición de servidor (Next.js) a servidor (NestJS)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        // OJO: No establezcas 'Content-Type': 'multipart/form-data'. 
        // fetch lo calcula automáticamente junto con los boundaries.
      },
      body: formData, // Pasamos el FormData original directamente
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al subir la imagen al backend');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[UPLOAD_ACTION_ERROR]', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error interno del servidor' 
    };
  }
}