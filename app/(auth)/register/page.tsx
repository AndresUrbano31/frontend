'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TextInput } from '@/components/TextInput';
import { Button } from '@/components/Button';
import { apiService } from '@/lib/apiService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    documentId: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.register(
        formData.fullName,
        formData.documentId,
        formData.email,
        formData.phone
      );

      if (response.success) {
        setSuccess('¡Registro exitoso! Redirigiendo a inicio de sesión...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(response.message || 'Error en el registro');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse. Intente de nuevo.');
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
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema Médico
          </h1>
          <p className="text-purple-100 text-sm">Registro de nuevo paciente</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Crear Cuenta
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 mb-6 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 mb-6 rounded-lg">
              <p className="font-medium">¡Éxito!</p>
              <p className="text-sm mt-1">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Nombre Completo
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ej: Juan García López"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📋 Documento de Identidad
              </label>
              <input
                type="text"
                name="documentId"
                value={formData.documentId}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ✉️ Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: juan@correo.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: 5551234567"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              isLoading={loading}
              className="py-3 text-base font-semibold mt-6"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tiene cuenta?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-white text-xs opacity-75">
            Sus datos serán tratados de forma segura y confidencial
          </p>
        </div>
      </div>
    </div>
  );
}
