'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/apiService';
import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Doctor } from '@/lib/types';

export default function AppointmentPage() {
  const { authData } = useAuth();
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load specialties on mount
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSpecialties();
        setSpecialties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar especialidades');
      } finally {
        setLoading(false);
      }
    };
    loadSpecialties();
  }, []);

  // Load doctors when specialty is selected
  useEffect(() => {
    if (!selectedSpecialty) return;

    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDoctorsBySpecialty(selectedSpecialty);
        setDoctors(data || []);
        setSelectedDoctor('');
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar médicos');
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, [selectedSpecialty]);

  // Load available slots when doctor and date are selected
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;

    const loadSlots = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAvailableSlots(selectedDoctor, selectedDate);
        setAvailableSlots(data || []);
        setSelectedTime('');
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar horarios disponibles');
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async () => {
    if (!authData || !selectedDoctor || !selectedDate || !selectedTime) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      const appointmentDateTime = `${selectedDate}T${selectedTime}`;
      await apiService.scheduleAppointment(authData.patientId, selectedDoctor, appointmentDateTime);
      setSuccess('¡Cita agendada exitosamente!');
      setError('');
      setTimeout(() => {
        // Reset form
        setStep(1);
        setSelectedSpecialty('');
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedTime('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  if (loading && specialties.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📅 Agendar Cita Médica</h1>
        <p className="text-gray-600 mb-8">Proceso guiado en 4 pasos simples</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-lg mb-6">
            <p className="font-medium">¡Éxito!</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Steps Indicator */}
        <div className="flex justify-between mb-8 gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`py-3 px-2 rounded-lg font-bold text-center transition-all ${
                  step === s
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                    : step > s
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-300 text-gray-700'
                }`}
              >
                {step === s ? '●' : step > s ? '✓' : '○'} Paso {s}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Step 1: Select Specialty */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🏥 Paso 1: Seleccione la Especialidad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specialties.map((specialty) => (
                <label 
                  key={specialty} 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedSpecialty === specialty
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="specialty"
                    value={specialty}
                    checked={selectedSpecialty === specialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="mr-3 w-4 h-4"
                  />
                  <span className="font-medium text-gray-900">{specialty}</span>
                </label>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button
                variant="secondary"
                onClick={() => window.history.back()}
              >
                ← Volver
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedSpecialty}
              >
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              👨‍⚕️ Paso 2: Seleccione el Médico
            </h2>
            {loading ? (
              <LoadingSpinner />
            ) : doctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {doctors.map((doctor) => (
                  <label
                    key={doctor.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDoctor === doctor.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="doctor"
                      value={doctor.id}
                      checked={selectedDoctor === doctor.id}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="mr-3 w-4 h-4 mt-1"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-purple-600">{doctor.specialty}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No hay médicos disponibles en esta especialidad</p>
            )}
            <div className="mt-8 flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)}>
                ← Anterior
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDoctor}
              >
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Date and Time */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🗓️ Paso 3: Seleccione Fecha y Hora
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Fecha de la Cita
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hora de la Cita
                  </label>
                  {loading ? (
                    <LoadingSpinner />
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-3 border-2 rounded-lg font-semibold transition-all ${
                            selectedTime === slot
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-600 shadow-lg'
                              : 'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-8">No hay horarios disponibles para esta fecha</p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)}>
                ← Anterior
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!selectedDate || !selectedTime}
              >
                Siguiente →
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ✓ Paso 4: Confirmar Cita
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 space-y-4 mb-8 border-2 border-purple-200">
              <div className="flex items-start gap-3 pb-4 border-b border-purple-200">
                <span className="text-2xl">🏥</span>
                <div>
                  <p className="text-sm text-gray-600">Especialidad</p>
                  <p className="font-bold text-gray-900">{selectedSpecialty}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-purple-200">
                <span className="text-2xl">👨‍⚕️</span>
                <div>
                  <p className="text-sm text-gray-600">Médico</p>
                  <p className="font-bold text-gray-900">{doctors.find((d) => d.id === selectedDoctor)?.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-purple-200">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="text-sm text-gray-600">Hora</p>
                  <p className="font-bold text-gray-900">{selectedTime}</p>
                </div>
              </div>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  ← Anterior
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                >
                  Agendar Cita ✓
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
