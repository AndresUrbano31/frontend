# Medical Management System - Frontend Quick Start

## 🚀 Quick Start Guide

### 1. Initial Setup
```bash
cd facade

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### 2. Start Development Server
```bash
npm run dev
```

The application will run at:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8080` (must be running)

### 3. Test the Application

#### Login
- Visit: `http://localhost:3000/login`
- Use any valid document ID from your backend

#### Register
- Visit: `http://localhost:3000/register`
- Fill in the form with:
  - Nombre Completo (Full Name)
  - Documento de Identidad (ID Document)
  - Correo Electrónico (Email)
  - Teléfono (Phone Number)

#### After Login
You can access:
- 📊 **Dashboard**: Overview of appointments and lab results
- 📅 **Agendar Cita**: Schedule medical appointments
- 📑 **Historia Clínica**: View medical history, prescriptions, and lab requests
- 🧪 **Laboratorios**: Request and view lab results

## 📁 Project Structure

```
facade/
├── app/
│   ├── (auth)/                  # Auth routes (public)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/             # Dashboard routes (protected)
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── dashboard/page.tsx   # Main dashboard
│   │   ├── appointment/page.tsx # Appointment booking
│   │   ├── medical-history/page.tsx
│   │   └── lab-results/page.tsx
│   ├── page.tsx                 # Home redirect
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Tailwind CSS
│
├── components/                  # Reusable React components
│   ├── Button.tsx
│   ├── TextInput.tsx
│   ├── LoadingSpinner.tsx
│   ├── LabResultBadge.tsx
│   ├── Navigation.tsx
│   └── ProtectedRoute.tsx
│
├── context/                     # React Context
│   └── AuthContext.tsx          # Auth state & provider
│
├── lib/                         # Utilities
│   ├── apiService.ts            # API client
│   ├── auth.ts                  # Auth helpers
│   └── types.ts                 # Type definitions
│
├── middleware.ts                # Route protection
├── .env.local.example           # Environment template
├── next.config.ts               # Next.js config
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
└── package.json                 # Dependencies
```

## 🔌 API Integration

All API calls are made through `lib/apiService.ts`. The backend must provide:

### Authentication Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`

### Appointment Endpoints
- `GET /api/clinic/specialties`
- `GET /api/clinic/doctors?specialty=X`
- `GET /api/clinic/doctors/{doctorId}/available-slots?date=YYYY-MM-DD`
- `POST /api/clinic/appointment`
- `GET /api/clinic/appointments/upcoming/{patientId}`

### Medical History
- `GET /api/clinic/history/{patientId}`

### Laboratory
- `POST /api/clinic/laboratory`
- `GET /api/clinic/laboratory/results/{patientId}`

## 🎨 Styling

- **Framework**: Tailwind CSS 4
- **No UI library needed**: Pure Tailwind + custom components
- **Responsive**: Mobile-first design
- **Spanish UI**: All user-facing text in Spanish

## 🔐 Authentication Flow

1. User registers or logs in at `/login`
2. Credentials sent to backend
3. Patient data stored in sessionStorage
4. Redirected to `/dashboard`
5. All protected routes check authentication
6. Logout clears session

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📁 File Descriptions

| File | Purpose |
|------|---------|
| `lib/apiService.ts` | Centralized API communication |
| `context/AuthContext.tsx` | Authentication state management |
| `components/ProtectedRoute.tsx` | Route protection wrapper |
| `middleware.ts` | Next.js route middleware |
| `app/(auth)/` | Public authentication pages |
| `app/(dashboard)/` | Protected dashboard pages |

## 🐛 Troubleshooting

### Backend Connection Error
```
Error: Failed to fetch from http://localhost:8080
```
- Ensure Spring Boot backend is running
- Check `.env.local` API URL is correct

### Login Not Working
- Verify document ID exists in backend
- Clear sessionStorage in browser DevTools
- Check backend logs for errors

### Styling Issues
```bash
# Rebuild Tailwind CSS
npm run build

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📝 Environment Configuration

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## ✅ Features Implemented

✅ User Registration & Login  
✅ Dashboard with Appointments & Lab Results  
✅ Multi-step Appointment Scheduling  
✅ Medical History (Consultations, Prescriptions, Labs)  
✅ Lab Results Management  
✅ Route Protection & Authentication Guard  
✅ Loading States & Error Handling  
✅ Responsive Mobile Design  
✅ Spanish UI Text  
✅ English Code & Variables  

## 🚀 Next Steps

1. Ensure backend is running on `:8080`
2. Run `npm install`
3. Create `.env.local` with API URL
4. Run `npm run dev`
5. Open `http://localhost:3000`
6. Register or login to test

## 📚 Documentation

- Full documentation: [README_FRONTEND.md](./README_FRONTEND.md)
- Backend API: Check your Spring Boot documentation
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

**Ready to start? Run `npm run dev` and visit `http://localhost:3000`!**
