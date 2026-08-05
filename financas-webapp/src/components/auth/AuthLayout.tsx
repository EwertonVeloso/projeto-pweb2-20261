import type { ReactNode } from 'react';
import personImg from '../../assets/person.jpg';


interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-[40%_60%] overflow-hidden">
      {/* Form side — dark background */}
      <div className="flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#22223b] to-[#2a1f45] px-6 py-12 overflow-y-auto">
        <div className="w-sm max-w-sm animate-surgir">
          {children}
        </div>
      </div>

      {/* Branding side — purple gradient, hidden on mobile */}
      <div className="relative flex overflow-hidden bg-cover bg-center"

        style={{
          backgroundImage: personImg ? `url(${personImg})` : 'none',
        }}
      >

        <div className="absolute inset-0 bg-black/45" />

        {/* Title text */}
        <div className="animate-surgir absolute left-12 top-[24vh] z-10 w-[calc(100%-4rem)] max-w-md text-left text-white">
          <h2
            className="font-light leading-tight text-white"
            style={{ fontSize: 'clamp(2.5rem, 3vw, 2.8rem)', margin: 0 }}
          >
            Tenha controle do seu dinheiro com o Pockly
          </h2>
          <p className="mt-4 text-sm text-white/80">
            Faça login para acessar a sua conta
          </p>
        </div>

      </div>
    </div>
  );
}
