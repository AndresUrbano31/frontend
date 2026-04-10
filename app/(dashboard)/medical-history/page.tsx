'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/apiService';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MedicalHistory, Consultation, Prescription, LabRequest } from '@/lib/types';

export default function MedicalHistoryPage() {
  const { authData } = useAuth();
  const [activeTab, setActiveTab] = useState<'consultations' | 'prescriptions' | 'labs'>('consultations');
  const [data, setData] = useState<MedicalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientId = authData?.patientId;
        if (!patientId) return;

        const response = await apiService.getMedicalHistory(patientId);
        setData(response || { consultations: [], prescriptions: [], labRequests: [] });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar historia clínica');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
            📋 Historia Clínica Completa
          </h1>
          <p className="text-gray-600">Acceda a sus consultas, prescripciones y laboratorios</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'consultations'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Consultas
            {activeTab === 'consultations' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-purple-700"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'prescriptions'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💊 Prescripciones
            {activeTab === 'prescriptions' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-purple-700"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === 'labs'
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🧪 Laboratorios
            {activeTab === 'labs' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-600 to-purple-700"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Consultations Tab */}
          {activeTab === 'consultations' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Consultas Médicas</h2>
              {data?.consultations && data.consultations.length > 0 ? (
                <div className="space-y-4">
                  {data.consultations.map((consultation: Consultation) => (
                    <div
                      key={consultation.id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-900">
                          👨‍⚕️ {consultation.doctorName}
                        </h3>
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          📅 {new Date(consultation.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        <span className="font-semibold text-gray-900">Diagnóstico:</span> {consultation.diagnosis}
                      </p>
                      {consultation.notes && (
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg italic">{consultation.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="text-4xl mb-3 block">📋</span>
                  <p className="text-gray-500 font-medium">No tiene consultas registradas</p>
                </div>
              )}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">💊 Prescripciones</h2>
              {data?.prescriptions && data.prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {data.prescriptions.map((prescription: Prescription) => (
                    <div
                      key={prescription.id}
                      className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 hover:shadow-md transition-all bg-linear-to-r from-green-50 to-transparent"
                    >
                      <h3 className="font-bold text-lg text-gray-900 mb-4">
                        💊 {prescription.medicationName}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-600 font-medium">Dosis</p>
                          <p className="font-bold text-gray-900 text-lg">{prescription.dosage}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-600 font-medium">Duración</p>
                          <p className="font-bold text-gray-900 text-lg">{prescription.duration}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-600 font-medium">Fecha</p>
                          <p className="font-bold text-gray-900 text-lg">
                            {new Date(prescription.prescriptionDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block">💊</span>
                <p className="text-gray-500 font-medium">No tiene prescripciones registradas</p>
              </div>
            )}
          </div>
        )}

        {/* Lab Requests Tab */}
        {activeTab === 'labs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Solicitudes de Laboratorio</h2>
            {data?.labRequests && data.labRequests.length > 0 ? (
              <div className="space-y-4">
                {data.labRequests.map((lab: LabRequest) => (
                  <div
                    key={lab.id}
                    className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all bg-linear-to-r from-blue-50 to-transparent"
                  >
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-blue-100">
                      <h3 className="font-bold text-lg text-gray-900">
                        🧪 {lab.examName}
                      </h3>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          lab.status === 'completed'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : lab.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                              : 'bg-blue-100 text-blue-700 border border-blue-300'
                        }`}
                      >
                        {lab.status === 'completed'
                          ? '✓ Completado'
                          : lab.status === 'pending'
                            ? '⏳ Pendiente'
                            : '⚙️ En proceso'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Solicitado:</span> {new Date(lab.requestDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block">🧪</span>
                <p className="text-gray-500 font-medium">No tiene solicitudes de laboratorio</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
