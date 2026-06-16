import type { ReactNode } from 'react';
import desenhoImg from '../../assets/desenho.svg';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Form side — dark background */}
      <div className="flex items-center justify-center bg-[#1a1a2e] px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Branding side — purple gradient, hidden on mobile */}
      <div className="relative hidden flex-col items-center overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa] md:flex">
        {/* Title text */}
        <div className="animate-surgir relative z-10 w-full px-12 pt-16 text-left text-white">
          <h2
            className="font-bold leading-tight text-white"
            style={{ fontSize: 'clamp(6rem, 3vw, 3rem)', margin: 0 }}
          >
            Bem vindo ao<br />finanças
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Faça login para acessar a sua conta
          </p>
        </div>

        {/* Illustration — fills the remaining space and sits at bottom */}
        <div className="animate-surgir-delay relative z-10 flex flex-1 items-end justify-center px-4 mt-4 min-h-0">
          <img
            src={desenhoImg}
            alt="Ilustração de finanças"
            className="w-full max-w-[600px] max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
