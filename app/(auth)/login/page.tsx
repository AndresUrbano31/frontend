'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { apiService } from '@/lib/apiService';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setAuthData } = useAuth();
  const [documentId, setDocumentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(documentId);
      if (response) {
        setAuthData({
          patientId: response.patientId,
          name: response.name,
          email: response.email,
          phone: response.phone,
          documentId: response.documentId,
        });
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 11.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 11.894-1.79l1.599.8L11 4.323V3a1 1 0 011-1h-2a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.140 1.637.92 1.887A3 3 0 008 15a3 3 0 001.944-.573c.78-.25 1.17-1.107.92-1.887L9 10.274V8a1 1 0 10-2 0v2.274z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema Médico
          </h1>
          <p className="text-purple-100 text-sm">Gestión de citas y resultados médicos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Inicio de Sesión
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 mb-6 rounded-lg" role="alert">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📋 Documento de Identidad
              </label>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Ingrese su documento"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              isLoading={loading}
              className="py-3 text-base font-semibold"
            >
              {loading ? 'Comprobando...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              ¿No tiene cuenta?{' '}
              <Link 
                href="/register" 
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              >
                Registrarse aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-white text-xs opacity-75">
            Sistema de gestión médica seguro
          </p>
        </div>
      </div>
    </div>
  );
}
