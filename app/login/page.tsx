import LoginForm from '@/components/forms/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Brillos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-800/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-md w-full space-y-8 bg-[#13131a] p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_40px_rgba(147,51,234,0.1)] z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Acceso al Sistema
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Autorización requerida por el clúster
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-sm text-purple-400 animate-pulse">Cargando seguridad...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}