# Medical Management System - Frontend

A complete frontend for a Medical Management System built with Next.js, React, TypeScript, and Tailwind CSS. Provides comprehensive features for patient registration, appointment scheduling, medical history tracking, and laboratory results management.

## Features

### 🔐 Authentication
- **User Registration**: Full name, document ID, email, and phone number
- **Login**: Document ID-based authentication
- **Session Management**: Secure session storage and route protection

### 📋 Dashboard
- Upcoming appointments overview
- Latest laboratory results with status indicators
- Quick action buttons for common tasks

### 📅 Appointment Scheduling
- 4-step appointment booking process
- Specialty selection
- Doctor filtering by specialty
- Date and time slot selection
- Real-time availability checking

### 📑 Medical History
- **Consultations**: Past visit records with diagnosis and notes
- **Prescriptions**: Medication details with dosage and duration
- **Laboratory Requests**: Request history and current status

### 🧪 Laboratory Management
- Request laboratory exams (Hemograma, Glicemia, Perfil Lipídico)
- Results tracking with reference ranges
- Status indicators (Normal / Fuera de rango)
- Historical results display

## Tech Stack

- **Framework**: Next.js 16.2 with App Router
- **UI Library**: React 19.2 with functional components and hooks
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Backend Communication**: RESTful API (Spring Boot)

## Project Structure

```
facade/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages group
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── (dashboard)/       # Protected routes group
│   │   ├── layout.tsx     # Dashboard layout with navigation
│   │   ├── dashboard/     # Main dashboard
│   │   ├── appointment/   # Appointment scheduling
│   │   ├── medical-history/ # Medical history tabs
│   │   └── lab-results/   # Laboratory management
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── globals.css        # Global styles and Tailwind imports
│   └── page.tsx           # Home redirect page
├── components/            # Reusable React components
│   ├── Button.tsx         # Button with variants
│   ├── TextInput.tsx      # Form input with validation
│   ├── LoadingSpinner.tsx # Loading indicators
│   ├── LabResultBadge.tsx # Status badge for lab results
│   ├── Navigation.tsx     # Top navigation bar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── context/               # React Context API
│   └── AuthContext.tsx    # Authentication state management
├── lib/                   # Utility functions and services
│   ├── apiService.ts      # Centralized API client
│   ├── auth.ts            # Authentication utilities
│   └── types.ts           # TypeScript type definitions
├── middleware.ts          # Next.js middleware for route protection
├── .env.local.example     # Environment variables template
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Spring Boot backend running at `http://localhost:8080`

### Installation

1. **Clone the repository** (if applicable):
```bash
cd facade
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local if your backend is on a different URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

4. **Run the development server**:
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## API Integration

The frontend communicates with a Spring Boot backend at `http://localhost:8080/api`. All API calls are centralized in `lib/apiService.ts`.

### Required Backend Endpoints

#### Authentication
- `POST /auth/login` - Sign in with document ID
- `POST /auth/register` - Create new patient account

#### Appointments
- `GET /clinic/specialties` - List available specialties
- `GET /clinic/doctors?specialty=X` - Get doctors by specialty
- `GET /clinic/doctors/{doctorId}/available-slots?date=YYYY-MM-DD` - Get available time slots
- `POST /clinic/appointment` - Schedule new appointment
- `GET /clinic/appointments/upcoming/{patientId}` - Get upcoming appointments

#### Medical History
- `GET /clinic/history/{patientId}` - Get complete medical history (consultations, prescriptions, lab requests)

#### Laboratory
- `POST /clinic/laboratory` - Request lab exams
- `GET /clinic/laboratory/results/{patientId}` - Get lab results
- `GET /clinic/laboratory/results/{patientId}?limit=3` - Get latest lab results

## Authentication Flow

1. User submits registration or login form
2. Credentials are sent to backend API
3. On success, patient data is stored in sessionStorage
4. User is redirected to dashboard
5. Protected routes check authentication status before rendering
6. Logout clears session and redirects to login page

## Component Usage Examples

### Protected Pages
All dashboard pages are wrapped with the `ProtectedRoute` component, which automatically redirects unauthenticated users to the login page.

### Form Inputs
Use the `TextInput` component for consistent form styling:
```tsx
<TextInput
  label="Name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={error}
/>
```

### Buttons
Use the `Button` component with variants:
```tsx
<Button variant="primary" fullWidth isLoading={loading}>
  Submit
</Button>
```

### Lab Results
Display lab result status with the badge:
```tsx
<LabResultBadge isNormal={value >= min && value <= max} />
```

## Styling

The project uses **Tailwind CSS** for all styling. Custom colors and utilities can be added in `app/globals.css`.

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- All pages are mobile-friendly

## Error Handling

- User-friendly error messages in Spanish
- API errors are caught and displayed to the user
- Loading states prevent duplicate submissions
- Form validation on the client side

## Storage

- **Session Storage**: Patient authentication data
- **Auth Key**: `patientAuth` - Contains patientId, name, email, phone, documentId

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with Next.js App Router
- Image optimization
- CSS optimization with Tailwind
- API response caching where appropriate
- Lazy loading of route groups

## Security

- Route protection middleware
- Session-based authentication
- No sensitive data in localStorage (using sessionStorage)
- HTTPS recommended for production
- CORS configured on backend

## Troubleshooting

### Authentication Issues
- Ensure backend is running on `http://localhost:8080`
- Check that API endpoint in `.env.local` is correct
- Clear browser cache and sessionStorage
- Verify document ID format matches backend expectations

### Styling Issues
- Run `npm run build` to regenerate CSS
- Check Tailwind CSS is installed: `npm list tailwindcss`
- Verify `@import "tailwindcss"` is in `app/globals.css`

### API Connection Issues
- Verify backend server is running
- Check network tab in browser DevTools
- Ensure CORS is enabled on backend
- Verify API base URL in `.env.local`

## Development Tips

### Adding New Pages
1. Create a new folder in `app/(dashboard)/`
2. Add `page.tsx` component
3. Wrap with `ProtectedRoute` if needed
4. Add navigation link in `components/Navigation.tsx`

### Adding New API Endpoints
1. Add method to `lib/apiService.ts`
2. Update `lib/types.ts` with response types
3. Use in components with try-catch error handling
4. Show loading state during fetch

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never store sensitive data in these variables.

## Contributing

1. Follow TypeScript strict mode
2. Use functional components and hooks
3. Keep components focused and reusable
4. Write descriptive commit messages
5. Test responsive design on mobile devices

## License

This project is part of the Software Design Pattern course.

## Support

For issues or questions regarding the frontend, please check:
- Backend API documentation
- TypeScript type definitions in `lib/types.ts`
- Component source code for usage patterns

---

**Built with ❤️ for better healthcare management**
