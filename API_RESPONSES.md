# Backend API Response Examples

This document provides examples of the expected API responses for proper frontend functionality.

## Authentication

### POST /api/auth/register
**Request:**
```json
{
  "fullName": "Juan García",
  "documentId": "1234567890",
  "email": "juan@example.com",
  "phone": "5551234567"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "patientId": "pat-001"
}
```

### POST /api/auth/login
**Request:**
```json
{
  "documentId": "1234567890"
}
```

**Response (Success):**
```json
{
  "patientId": "pat-001",
  "name": "Juan García",
  "email": "juan@example.com",
  "phone": "5551234567",
  "documentId": "1234567890"
}
```

## Appointments

### GET /api/clinic/specialties
**Response:**
```json
[
  "Cardiología",
  "Dermatología",
  "Gastroenterología",
  "Medicina General",
  "Oftalmología",
  "Pediatría"
]
```

### GET /api/clinic/doctors?specialty=Cardiología
**Response:**
```json
[
  {
    "id": "doc-001",
    "name": "Dr. Carlos López",
    "specialty": "Cardiología",
    "availableSlots": ["09:00", "10:00", "14:00", "15:00"]
  },
  {
    "id": "doc-002",
    "name": "Dra. María Rodríguez",
    "specialty": "Cardiología",
    "availableSlots": ["10:00", "11:00", "15:00", "16:00"]
  }
]
```

### GET /api/clinic/doctors/doc-001/available-slots?date=2024-04-15
**Response:**
```json
[
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30"
]
```

### POST /api/clinic/appointment
**Request:**
```json
{
  "patientId": "pat-001",
  "doctorId": "doc-001",
  "appointmentDateTime": "2024-04-15T09:00"
}
```

**Response (Success):**
```json
{
  "success": true,
  "appointmentId": "apt-001",
  "message": "Appointment scheduled successfully"
}
```

### GET /api/clinic/appointments/upcoming/pat-001
**Response:**
```json
[
  {
    "id": "apt-001",
    "doctorName": "Dr. Carlos López",
    "specialty": "Cardiología",
    "dateTime": "2024-04-15T09:00"
  },
  {
    "id": "apt-002",
    "doctorName": "Dra. María Rodríguez",
    "specialty": "Dermatología",
    "dateTime": "2024-04-20T14:00"
  }
]
```

## Medical History

### GET /api/clinic/history/pat-001
**Response:**
```json
{
  "consultations": [
    {
      "id": "cons-001",
      "date": "2024-03-10",
      "doctorName": "Dr. Carlos López",
      "diagnosis": "Hipertensión arterial",
      "notes": "Se recomienda dieta baja en sodio y ejercicio regular"
    },
    {
      "id": "cons-002",
      "date": "2024-02-15",
      "doctorName": "Dra. María Rodríguez",
      "diagnosis": "Dermatitis atópica leve",
      "notes": "Usar crema hidratante recomendada"
    }
  ],
  "prescriptions": [
    {
      "id": "presc-001",
      "medicationName": "Losartán",
      "dosage": "50mg",
      "duration": "30 días",
      "prescriptionDate": "2024-03-10"
    },
    {
      "id": "presc-002",
      "medicationName": "Antihistamínico",
      "dosage": "10mg",
      "duration": "7 días",
      "prescriptionDate": "2024-02-15"
    }
  ],
  "labRequests": [
    {
      "id": "lab-001",
      "examName": "Hemograma",
      "requestDate": "2024-03-10",
      "status": "completed"
    },
    {
      "id": "lab-002",
      "examName": "Perfil de Lípidos",
      "requestDate": "2024-03-10",
      "status": "completed"
    },
    {
      "id": "lab-003",
      "examName": "Prueba de Glucosa",
      "requestDate": "2024-04-01",
      "status": "pending"
    }
  ]
}
```

## Laboratory

### POST /api/clinic/laboratory
**Request:**
```json
{
  "patientId": "pat-001",
  "examTypes": ["hemograma", "glicemia", "perfil-lipidico"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Laboratory exams requested successfully",
  "requestId": "lab-req-001"
}
```

### GET /api/clinic/laboratory/results/pat-001
**Response:**
```json
[
  {
    "id": "result-001",
    "examName": "Hemograma",
    "value": 12.5,
    "referenceMin": 12,
    "referenceMax": 17,
    "date": "2024-03-15"
  },
  {
    "id": "result-002",
    "examName": "Glicemia",
    "value": 105,
    "referenceMin": 70,
    "referenceMax": 100,
    "date": "2024-03-15"
  },
  {
    "id": "result-003",
    "examName": "Colesterol Total",
    "value": 185,
    "referenceMin": 0,
    "referenceMax": 200,
    "date": "2024-03-15"
  },
  {
    "id": "result-004",
    "examName": "Triglicéridos",
    "value": 95,
    "referenceMin": 0,
    "referenceMax": 150,
    "date": "2024-03-15"
  }
]
```

### GET /api/clinic/laboratory/results/pat-001?limit=3
**Response (Same format as above, limited to 3 results):**
```json
[
  {
    "id": "result-001",
    "examName": "Hemograma",
    "value": 12.5,
    "referenceMin": 12,
    "referenceMax": 17,
    "date": "2024-03-15"
  },
  {
    "id": "result-002",
    "examName": "Glicemia",
    "value": 105,
    "referenceMin": 70,
    "referenceMax": 100,
    "date": "2024-03-15"
  },
  {
    "id": "result-003",
    "examName": "Colesterol Total",
    "value": 185,
    "referenceMin": 0,
    "referenceMax": 200,
    "date": "2024-03-15"
  }
]
```

## Error Responses

### Standard Error Format
**Response (400/401/403/404/500):**
```json
{
  "success": false,
  "message": "Error description in Spanish"
}
```

**Example - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Documento de identidad no encontrado"
}
```

**Example - Unauthorized:**
```json
{
  "success": false,
  "message": "No autorizado"
}
```

**Example - Server Error:**
```json
{
  "success": false,
  "message": "Error interno del servidor"
}
```

## Implementation Notes

1. **Date Format**: Use ISO 8601 format (YYYY-MM-DD and YYYY-MM-DDTHH:MM)
2. **Status Values**: 
   - Lab Requests: `"pending"`, `"in-process"`, `"completed"`
3. **Spanish Specialties**: Use proper names like "Cardiología", "Dermatología", etc.
4. **Error Messages**: Return error messages in Spanish for user display
5. **Status Codes**: 
   - 200: Success
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Server Error

## Testing the Integration

1. Start the Next.js frontend: `npm run dev`
2. Ensure backend is running: `http://localhost:8080`
3. Navigate to `http://localhost:3000/register` and create a test account
4. Test each module: Dashboard, Appointments, Medical History, Laboratory
5. Check browser console for any API errors
6. Use browser DevTools Network tab to verify API calls

## CORS Configuration

The backend should have CORS enabled for:
- Origin: `http://localhost:3000`
- Methods: `GET`, `POST`, `PUT`, `DELETE`
- Headers: `Content-Type`, `Authorization`
