'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/actions/auth.actions';

const initialState = { success: false, error: '' };

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/galeria';
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      
      <div>
        <label htmlFor="password" className="sr-only">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-[#0a0a0f] border border-purple-500/30 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Contraseña de acceso..."
        />
      </div>

      {state?.error && (
        <p className="text-red-400 text-sm font-medium text-center bg-red-900/20 py-2 rounded-lg border border-red-500/20">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Verificando credenciales...' : 'Entrar'}
        </button>
      </div>
    </form>
  );
}