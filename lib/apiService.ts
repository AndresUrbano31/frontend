// Centralized API Service

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

export const apiService = {
  // Authentication endpoints
  login: async (documentId: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    });
    if (!response.ok) throw new Error('Error en inicio de sesión');
    return response.json();
  },

  register: async (fullName: string, documentId: string, email: string, phone: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, documentId, email, phone }),
    });
    if (!response.ok) throw new Error('Error en el registro');
    return response.json();
  },

  // Dashboard endpoints
  getUpcomingAppointments: async (patientId: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/appointments/upcoming/${patientId}`);
    if (!response.ok) throw new Error('Error al obtener citas próximas');
    return response.json();
  },

  getLatestLabResults: async (patientId: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/laboratory/results/${patientId}?limit=3`);
    if (!response.ok) throw new Error('Error al obtener resultados de laboratorio');
    return response.json();
  },

  // Appointment scheduling endpoints
  getDoctorsBySpecialty: async (specialty: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/doctors?specialty=${encodeURIComponent(specialty)}`);
    if (!response.ok) throw new Error('Error al obtener médicos');
    return response.json();
  },

  getSpecialties: async () => {
    const response = await fetch(`${API_BASE_URL}/clinic/specialties`);
    if (!response.ok) throw new Error('Error al obtener especialidades');
    return response.json();
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/doctors/${doctorId}/available-slots?date=${date}`);
    if (!response.ok) throw new Error('Error al obtener horarios disponibles');
    return response.json();
  },

  scheduleAppointment: async (patientId: string, doctorId: string, appointmentDateTime: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId, appointmentDateTime }),
    });
    if (!response.ok) throw new Error('Error al agendar cita');
    return response.json();
  },

  // Medical history endpoints
  getMedicalHistory: async (patientId: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/history/${patientId}`);
    if (!response.ok) throw new Error('Error al obtener historia clínica');
    return response.json();
  },

  // Laboratory endpoints
  requestLaboratoryExams: async (patientId: string, examTypes: string[]) => {
    const response = await fetch(`${API_BASE_URL}/clinic/laboratory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, examTypes }),
    });
    if (!response.ok) throw new Error('Error al solicitar exámenes de laboratorio');
    return response.json();
  },

  getLaboratoryResults: async (patientId: string) => {
    const response = await fetch(`${API_BASE_URL}/clinic/laboratory/results/${patientId}`);
    if (!response.ok) throw new Error('Error al obtener resultados de laboratorio');
    return response.json();
  },
};
