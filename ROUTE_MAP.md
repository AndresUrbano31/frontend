# Medical Management System - Route Map

## URL Routes

### Authentication Routes (Public)
```
/login                    - Login page (document ID)
/register                 - Registration page
```

### Dashboard Routes (Protected)
```
/dashboard                - Main dashboard
/appointment              - Multi-step appointment scheduling
/medical-history          - Medical history (tabbed interface)
/lab-results              - Laboratory results and requests
```

### Root Route
```
/                        - Home (redirects to /dashboard or /login)
```

---

## Route Protection

### Public Routes (No Authentication Required)
- `/login`
- `/register`
- `/`

### Protected Routes (Authentication Required)
- `/dashboard` ← Main entry point after login
- `/appointment`
- `/medical-history`
- `/lab-results`

**Behavior:** If unauthenticated user tries to access a protected route, they are automatically redirected to `/login`.

---

## Page Flow

```
┌─────────────────────────────────────────────────────┐
│ START                                               │
└─────────────────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────┐
    │ / (Home Page)    │◄──────────────────┐
    │ - Checks Auth    │                   │
    └──────────────────┘                   │
        │          │                       │
        │         No                    Logout
        │      Auth                       │
        │          ▼                      │
        │    ┌────────────┐               │
        │    │ /login     │───────────────┤
        │    └────────────┘       Success │
        │          │                      │
        │      Auth OK                   │
        │          │                      │
        Yes        ▼                      │
        │    ┌──────────────────┐         │
        └───►│ /dashboard       │◄────────┘
             │ - Main Dashboard │
             └──────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    /appointment /medical-history /lab-results
    - Book Appt - History Tabs  - Request/View
                - Consults       - Exams
                - Scripts
                - Labs
```

---

## Component Tree

```
app/layout.tsx (Root)
│
├─ AuthProvider
│  │
│  └─ children (/page.tsx or nested layouts)
│     │
│     ├─ app/page.tsx
│     │  └─ redirects based on auth
│     │
│     ├─ app/(auth)/layout
│     │  ├─ login/page.tsx
│     │  └─ register/page.tsx
│     │
│     └─ app/(dashboard)/layout
│        │  └─ Navigation (top bar)
│        │
│        ├─ dashboard/page.tsx
│        ├─ appointment/page.tsx
│        ├─ medical-history/page.tsx
│        └─ lab-results/page.tsx
```

---

## Middleware Flow

```
request
  │
  ├─ Check route
  │
  ├─ If public route (/login, /register, /)
  │  └─ Allow access
  │
  ├─ If protected route (/dashboard, /appointment, etc.)
  │  │
  │  ├─ Check authentication
  │  │
  │  ├─ If authenticated
  │  │  └─ Allow access
  │  │
  │  └─ If NOT authenticated
  │     └─ Redirect to /login
  │
  └─ If authenticated + at /login or /register
     └─ Redirect to /dashboard
```

---

## Data Flow

### Registration Flow
```
Register Form
   │
   ├─ User fills form
   │  (name, document, email, phone)
   │
   ├─ Click "Registrarse"
   │
   ├─ POST /api/auth/register
   │
   ├─ Success? 
   │  └─ Show "¡Registro exitoso!"
   │  └─ Redirect /login
   │
   └─ Error?
      └─ Show error message
```

### Login Flow
```
Login Form
   │
   ├─ User enters document ID
   │
   ├─ Click "Iniciar Sesión"
   │
   ├─ POST /api/auth/login
   │
   ├─ Success?
   │  ├─ Get patient data
   │  ├─ Save to sessionStorage
   │  ├─ Update AuthContext
   │  └─ Redirect /dashboard
   │
   └─ Error?
      └─ Show error message
```

### Dashboard Flow
```
Dashboard Page
   │
   ├─ Check authentication
   │  (if not, redirect /login)
   │
   ├─ Fetch data parallel:
   │  ├─ GET /api/clinic/appointments/upcoming/{patientId}
   │  └─ GET /api/clinic/laboratory/results/{patientId}?limit=3
   │
   ├─ Display:
   │  ├─ Welcome message
   │  ├─ Upcoming appointments
   │  ├─ Latest lab results
   │  └─ Quick action buttons
   │
   └─ User can click action buttons
      ├─ Agendar Cita → /appointment
      ├─ Ver Historia → /medical-history
      └─ Exámenes → /lab-results
```

### Appointment Booking Flow
```
Step 1: Select Specialty
   │
   ├─ GET /api/clinic/specialties
   ├─ Display dropdown
   └─ Next step

Step 2: Select Doctor
   │
   ├─ GET /api/clinic/doctors?specialty=X
   ├─ Display doctor list
   └─ Next step

Step 3: Select Date & Time
   │
   ├─ User picks date
   ├─ GET /api/clinic/doctors/{doctorId}/available-slots?date=YYYY-MM-DD
   ├─ User picks time
   └─ Next step

Step 4: Confirm
   │
   ├─ Show summary
   ├─ User clicks confirm
   ├─ POST /api/clinic/appointment
   ├─ Success? → Show "¡Cita agendada exitosamente!"
   └─ Error? → Show error message
```

### Medical History Flow
```
Medical History Page
   │
   ├─ GET /api/clinic/history/{patientId}
   │
   ├─ Display 3 tabs:
   │  ├─ Consultas (Consultations)
   │  ├─ Prescripciones (Prescriptions)
   │  └─ Laboratorios (Laboratory)
   │
   └─ User clicks tab
      └─ Display tab content
```

### Lab Results Flow
```
Lab Results Page
   │
   ├─ GET /api/clinic/laboratory/results/{patientId}
   │
   ├─ Left section: Request exams
   │  ├─ Checkboxes:
   │  │  ├─ Hemograma
   │  │  ├─ Glicemia
   │  │  └─ Perfil Lipídico
   │  │
   │  ├─ User selects exams
   │  ├─ Click "Solicitar Exámenes"
   │  ├─ POST /api/clinic/laboratory
   │  └─ Show success/error message
   │
   ├─ Right section: Display results
   │  ├─ Load all lab results
   │  ├─ Display in table:
   │  │  ├─ Exam name
   │  │  ├─ Value
   │  │  ├─ Reference range
   │  │  └─ Status badge (Normal/Fuera de rango)
   │  │
   │  └─ Status indicators:
   │     ├─ Green = Normal (value in range)
   │     └─ Red = Fuera de rango (value outside range)
```

---

## Authentication State Management

```
AuthContext
│
├─ authData: {
│  ├─ patientId
│  ├─ name
│  ├─ email
│  ├─ phone
│  └─ documentId
│}
│
├─ isAuthenticated: boolean
│
├─ setAuthData(data)
│  ├─ Save to sessionStorage
│  └─ Update context state
│
└─ logout()
   ├─ Clear sessionStorage
   ├─ Clear context state
   └─ Redirect to /login
```

---

## Storage Schema

### sessionStorage
Key: `patientAuth`

Value:
```json
{
  "patientId": "pat-001",
  "name": "Juan García",
  "email": "juan@example.com",
  "phone": "5551234567",
  "documentId": "1234567890"
}
```

**Note:** Cleared on logout or browser close

---

## Navigation Structure

```
Top Navigation Bar (app/(dashboard))
│
├─ Logo: "Sistema Médico"
│
├─ Navigation Links (hidden on mobile):
│  ├─ Dashboard
│  ├─ Agendar Cita
│  ├─ Historia Clínica
│  └─ Laboratorios
│
├─ User Info
│  └─ Patient name
│
└─ Cerrar Sesión button
   └─ Logout
```

---

## Error Handling

```
Try API Call
│
├─ Success (200-299)
│  └─ Display data
│
└─ Error (400-599)
   │
   ├─ Catch error
   ├─ Extract error message
   ├─ Display error message in Spanish
   │
   └─ Allow user to retry
```

---

## Loading States

```
- Page loading: Spinner with "Cargando..."
- Button loading: Button text → "Procesando..."
- Form loading: Form inputs disabled
- API loading: Spinner displayed until response
```

---

## Time Formats Used

- **Date**: `YYYY-MM-DD` (ISO format)
- **DateTime**: `YYYY-MM-DDTHH:MM` (ISO format)
- **Display**: `toLocaleString('es-ES')` (Spanish locale)
- **Time slots**: `HH:MM` (24-hour format)

---

## Status Indicators

### Lab Results
- 🟢 **Normal**: Value in reference range
- 🔴 **Fuera de rango**: Value outside range

### Lab Requests
- 🟡 **Pending** (Pendiente)
- 🔵 **In Process** (En proceso)
- 🟢 **Completed** (Completado)

---

## Responsive Breakpoints

```
Mobile (< 640px)   - Full width, stacked layout
Tablet (640-1024px) - 2-column layout
Desktop (> 1024px)  - Multi-column layout
```

---

## Session Duration

- **Storage**: sessionStorage (browser tab specific)
- **Duration**: Until browser tab is closed
- **Persistence**: Does NOT persist across tab refresh
- **Note**: Use cookie if you need persistence across browser restart

---

**Total Routes: 6**
**Protected Routes: 4**
**Public Routes: 3**
