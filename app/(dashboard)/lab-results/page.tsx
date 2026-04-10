'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/apiService';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LabResultBadge } from '@/components/LabResultBadge';
import { LabResult } from '@/lib/types';

const EXAM_OPTIONS = [
  { id: 'hemograma', label: 'Hemograma' },
  { id: 'glicemia', label: 'Glicemia' },
  { id: 'perfil-lipidico', label: 'Perfil Lipídico' },
];

export default function LabResultsPage() {
  const { authData } = useAuth();
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing lab results on mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const patientId = authData?.patientId;
        if (!patientId) return;

        const data = await apiService.getLaboratoryResults(patientId);
        setLabResults(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar resultados');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [authData]);

  const handleExamToggle = (examId: string) => {
    setSelectedExams((prev) =>
      prev.includes(examId)
        ? prev.filter((id) => id !== examId)
        : [...prev, examId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExams.length === 0) {
      setError('Por favor seleccione al menos un examen');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const patientId = authData?.patientId;
      if (!patientId) return;

      await apiService.requestLaboratoryExams(patientId, selectedExams);
      setSuccess('¡Solicitud de exámenes registrada exitosamente!');
      setSelectedExams([]);

      // Reload results
      const data = await apiService.getLaboratoryResults(patientId);
      setLabResults(data || []);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar exámenes');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
            🧬 Resultados de Laboratorio
          </h1>
          <p className="text-gray-600">Solicite exámenes y vea sus resultados</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
            <span className="text-2xl">✓</span>
            <div>{success}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Lab Tests */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔬 Solicitar Exámenes</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-8">
                {EXAM_OPTIONS.map((exam) => (
                  <label
                    key={exam.id}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExams.includes(exam.id)}
                      onChange={() => handleExamToggle(exam.id)}
                      className="mr-4 w-5 h-5 cursor-pointer accent-purple-600"
                    />
                    <span className="font-semibold text-gray-900 flex-1">
                      🧪 {exam.label}
                    </span>
                    {selectedExams.includes(exam.id) && (
                      <span className="text-purple-600 font-bold">✓</span>
                    )}
                  </label>
                ))}
              </div>
              <Button type="submit" variant="primary" fullWidth>
                {submitting ? 'Procesando...' : 'Solicitar Exámenes'}
              </Button>
            </form>
          </div>

          {/* Lab Results Table */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Últimos Resultados</h2>
            {labResults.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-purple-200">
                      <th className="text-left py-3 font-bold text-gray-900">Examen</th>
                      <th className="text-left py-3 font-bold text-gray-900">Valor</th>
                      <th className="text-left py-3 font-bold text-gray-900">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labResults.map((result) => {
                      const isNormal =
                        result.value >= result.referenceMin &&
                        result.value <= result.referenceMax;
                      return (
                        <tr
                          key={result.id}
                          className="border-b border-gray-200 hover:bg-purple-50 transition-colors"
                        >
                          <td className="py-4 font-medium text-gray-900">
                            🧬 {result.examName}
                          </td>
                          <td className="py-4">
                            <span className="font-semibold text-gray-900">
                              {result.value}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              ({result.referenceMin}-{result.referenceMax})
                            </span>
                          </td>
                          <td className="py-4">
                            <LabResultBadge isNormal={isNormal} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block">📊</span>
                <p className="text-gray-500 font-medium">No tiene resultados de laboratorio disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
