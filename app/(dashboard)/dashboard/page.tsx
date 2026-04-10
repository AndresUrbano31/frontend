'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/apiService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/Button';
import { LabResultBadge } from '@/components/LabResultBadge';
import { UpcomingAppointment, LabResult } from '@/lib/types';

export default function DashboardPage() {
  const { authData } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientId = authData?.patientId;
        if (!patientId) return;

        const [appointmentsRes, labRes] = await Promise.all([
          apiService.getUpcomingAppointments(patientId),
          apiService.getLatestLabResults(patientId),
        ]);

        setUpcomingAppointments(appointmentsRes || []);
        setLabResults(labRes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👋 Bienvenido, {authData?.name.split(' ')[0]}
          </h1>
          <p className="text-gray-600 text-lg">Panel de control de su historia médica</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/appointment" className="group">
            <Button fullWidth className="h-full py-6 text-base font-bold group-hover:scale-105 transform transition-transform">
              📅 Agendar Cita
            </Button>
          </Link>
          <Link href="/medical-history" className="group">
            <Button fullWidth variant="secondary" className="h-full py-6 text-base font-bold group-hover:scale-105 transform transition-transform">
              📑 Ver Historia Clínica
            </Button>
          </Link>
          <Link href="/lab-results" className="group">
            <Button fullWidth variant="secondary" className="h-full py-6 text-base font-bold group-hover:scale-105 transform transition-transform">
              🧪 Solicitar Exámenes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">📋</span>
              <h2 className="text-2xl font-bold text-gray-900">Próximas Citas</h2>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="border-l-4 border-purple-500 bg-linear-to-r from-purple-50 to-transparent p-4 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900 text-lg">{apt.doctorName}</h3>
                    <p className="text-sm text-purple-600 font-semibold">{apt.specialty}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      📅 {new Date(apt.dateTime).toLocaleString('es-ES', { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No tiene citas agendadas</p>
                <Link href="/appointment">
                  <Button variant="primary" className="mt-4">
                    Agendar una cita
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Latest Lab Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">🧬</span>
              <h2 className="text-2xl font-bold text-gray-900">Últimos Resultados</h2>
            </div>
            
            {labResults.length > 0 ? (
              <div className="space-y-4">
                {labResults.slice(0, 3).map((result) => {
                  const isNormal =
                    result.value >= result.referenceMin && result.value <= result.referenceMax;
                  return (
                    <div
                      key={result.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900">
                          {result.examName}
                        </h3>
                        <LabResultBadge isNormal={isNormal} />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Valor:</span> {result.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rango: {result.referenceMin}-{result.referenceMax} • 
                        {new Date(result.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No tiene resultados disponibles</p>
                <Link href="/lab-results">
                  <Button variant="primary" className="mt-4">
                    Solicitar exámenes
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
