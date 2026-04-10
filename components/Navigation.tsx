'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';

export function Navigation() {
  const { authData, logout } = useAuth();

  if (!authData) return null;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-bold text-xl flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            Sistema Médico
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/dashboard" className="hover:text-purple-100 transition-colors font-medium">
              📊 Dashboard
            </Link>
            <Link href="/appointment" className="hover:text-purple-100 transition-colors font-medium">
              📅 Agendar Cita
            </Link>
            <Link href="/medical-history" className="hover:text-purple-100 transition-colors font-medium">
              📑 Historia Clínica
            </Link>
            <Link href="/lab-results" className="hover:text-purple-100 transition-colors font-medium">
              🧪 Laboratorios
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{authData.name}</p>
            <p className="text-xs text-purple-100">{authData.email}</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="py-2 px-4 text-sm"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}
