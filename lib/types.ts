// API Response Types
export interface LoginRequest {
  documentId: string;
}

export interface LoginResponse {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  documentId: string;
}

export interface RegisterRequest {
  fullName: string;
  documentId: string;
  email: string;
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  patientId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  status: string;
}

export interface UpcomingAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
}

export interface LabResult {
  id: string;
  examName: string;
  value: number;
  referenceMin: number;
  referenceMax: number;
  date: string;
}

export interface Consultation {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  duration: string;
  prescriptionDate: string;
}

export interface LabRequest {
  id: string;
  examName: string;
  requestDate: string;
  status: string;
}

export interface MedicalHistory {
  consultations: Consultation[];
  prescriptions: Prescription[];
  labRequests: LabRequest[];
}

export interface AppointmentRequest {
  patientId: string;
  doctorId: string;
  appointmentDateTime: string;
}

export interface LaboratoryRequest {
  patientId: string;
  examTypes: string[];
}
