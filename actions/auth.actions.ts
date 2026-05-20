'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Definimos la interfaz del estado para TypeScript
export type AuthState = {
  success: boolean;
  error?: string;
};

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string || '/galeria';

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password !== adminPassword) {
    // Retornamos el nuevo estado con el error
    return { success: false, error: 'Credenciales inválidas' };
  }

  const cookieStore = await cookies();
  cookieStore.set('session-token', 'authenticated-admin-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 horas
  });

  // El redirect lanza un error especial de Next.js, por lo que corta la ejecución aquí.
  redirect(callbackUrl);
}