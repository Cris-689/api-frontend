'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/actions/auth.actions';

const initialState = {
  success: false,
  error: '',
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/galeria';
  
  // React 19: useActionState maneja el estado, la mutación y la transición (isPending)
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    // Ya no usamos onSubmit, inyectamos la action directamente en el form
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Contraseña de acceso"
          />
        </div>
      </div>

      {/* Mostramos el error si el server action falló */}
      {state?.error && <p className="text-red-500 text-sm font-medium">{state.error}</p>}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
        >
          {isPending ? 'Verificando...' : 'Entrar'}
        </button>
      </div>
    </form>
  );
}