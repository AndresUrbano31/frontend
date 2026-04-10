# Medical Management System - Developer Guide

## How to Extend and Modify the System

### Adding a New Page

**Example: Adding a "Medical Appointments History" Page**

1. **Create the directory:**
```bash
mkdir -p app/(dashboard)/appointment-history
```

2. **Create the page component:**
```tsx
// app/(dashboard)/appointment-history/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/lib/apiService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/Button';

export default function AppointmentHistoryPage() {
  const { authData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientId = authData?.patientId;
        if (!patientId) return;
        
        // Add new API endpoint to apiService.ts
        const data = await apiService.getAppointmentHistory(patientId);
        setAppointments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authData]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Historial de Citas
      </h1>
      {/* Your content here */}
    </div>
  );
}
```

3. **Add the API endpoint to `lib/apiService.ts`:**
```typescript
getAppointmentHistory: async (patientId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/clinic/appointments/history/${patientId}`
  );
  if (!response.ok) throw new Error('Error al obtener historial');
  return response.json();
},
```

4. **Update Navigation in `components/Navigation.tsx`:**
```tsx
<Link href="/appointment-history" className="hover:text-blue-200">
  Historial de Citas
</Link>
```

---

### Adding a New Component

**Example: Creating a Card Component**

1. **Create `components/Card.tsx`:**
```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>}
      {children}
    </div>
  );
}
```

2. **Use in pages:**
```tsx
import { Card } from '@/components/Card';

export default function MyPage() {
  return (
    <Card title="My Title">
      <p>Content goes here</p>
    </Card>
  );
}
```

---

### Adding New API Types

**In `lib/types.ts`:**

```typescript
export interface AppointmentHistory {
  id: string;
  date: string;
  doctorName: string;
  status: 'completed' | 'cancelled' | 'no_show';
  notes?: string;
}
```

---

### Creating a Custom Hook

**Example: `lib/usePatientData.ts`:**

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '@/lib/apiService';

export function usePatientData(patientId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getPatientData(patientId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  return { data, loading, error };
}
```

**Usage:**
```tsx
const { data, loading, error } = usePatientData(patientId);
```

---

### Styling Guidelines

#### Using Tailwind Classes
```tsx
// Do this
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Don't do this (inline styles)
<div style={{ display: 'flex', padding: '16px' }}>
```

#### Color Palette
```
Primary Blue: blue-600 (#0066CC)
Light Gray: gray-50 (#F9FAFB)
Dark Gray: gray-900 (#111827)
Success Green: green-100 (bg), green-800 (text)
Error Red: red-100 (bg), red-800 (text)
Warning Yellow: yellow-100 (bg), yellow-800 (text)
```

#### Responsive Classes
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Stacks on mobile, 2 cols on tablet, 3 cols on desktop */}
</div>
```

---

### Form Patterns

#### Using TextInput Component
```tsx
import { TextInput } from '@/components/TextInput';

const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

<TextInput
  label="Correo Electrónico"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  placeholder="ejemplo@correo.com"
/>
```

#### Form Validation
```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  if (!email) {
    setEmailError('El correo es requerido');
    return;
  }
  
  if (!email.includes('@')) {
    setEmailError('Correo inválido');
    return;
  }
  
  // Submit
  submitForm();
};
```

---

### Error Handling Patterns

#### API Error Handling
```tsx
try {
  const data = await apiService.someEndpoint(params);
  setData(data);
} catch (err) {
  const errorMsg = err instanceof Error 
    ? err.message 
    : 'Error desconocido';
  setError(errorMsg);
}
```

#### Displaying Errors
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
    {error}
  </div>
)}
```

---

### Loading States

#### Page Loading
```tsx
import { PageLoader } from '@/components/LoadingSpinner';

if (loading) return <PageLoader />;
```

#### Inline Loading
```tsx
import { LoadingSpinner } from '@/components/LoadingSpinner';

{loading ? <LoadingSpinner /> : <YourContent />}
```

#### Button Loading
```tsx
<Button isLoading={loading} disabled={loading}>
  Guardar
</Button>
```

---

### Working with Dates

#### Formatting Dates in Spanish
```tsx
// Format for display
const formatted = new Date(dateString).toLocaleDateString('es-ES');
// Output: "15 de abril de 2024"

// Format with time
const withTime = new Date(dateString).toLocaleString('es-ES');
// Output: "15/4/2024 09:30:00"
```

#### Date Input Handling
```tsx
// From input (ISO format)
const selectedDate = "2024-04-15";

// Convert for API
const apiDate = selectedDate; // Already ISO format

// Combine with time for datetime
const dateTime = `${selectedDate}T${time}`;
// Result: "2024-04-15T09:00"
```

---

### State Management Patterns

#### Using useState for Forms
```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

#### Using useContext for Global State
```tsx
import { useAuth } from '@/context/AuthContext';

const { authData, isAuthenticated, setAuthData, logout } = useAuth();
```

#### Using useCallback for Optimized Functions
```tsx
import { useCallback } from 'react';

const handleSubmit = useCallback(async () => {
  // Function logic
}, [dependency1, dependency2]);
```

---

### Testing Tips

#### Mock API Responses
```tsx
// In development, test with console output
console.log('API Request:', { patientId, params });
console.log('API Response:', data);
```

#### Test Protected Routes
1. Clear sessionStorage: `sessionStorage.clear()`
2. Try accessing `/dashboard` - should redirect to `/login`
3. Login and verify sessionStorage has auth data

#### Test Error States
1. Provide invalid document ID
2. Disconnect backend
3. Provide invalid form data

---

### Performance Optimization

#### Lazy Loading Components
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <LoadingSpinner />,
});
```

#### Memoizing Components
```tsx
import { memo } from 'react';

const MyComponent = memo(function MyComponent({ data }) {
  return <div>{data}</div>;
});
```

#### Preventing Unnecessary Re-renders
```tsx
import { useMemo } from 'react';

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

---

### Code Organization

#### Keep Components Small
- One responsibility per component
- Reuse existing components
- Extract custom hooks for logic

#### Keep Pages Simple
- Fetch data at page level
- Pass data to child components
- Keep business logic in custom hooks

#### Keep Services Centralized
- All API calls in `apiService.ts`
- All auth logic in `AuthContext.tsx`
- All types in `types.ts`

---

### Naming Conventions

#### Components
- PascalCase: `Button`, `TextInput`, `LoadingSpinner`
- Descriptive names: `LabResultBadge`, `ProtectedRoute`

#### Functions & Variables
- camelCase: `handleSubmit`, `fetchData`, `isNormal`
- Prefix handlers with `handle`: `handleClick`, `handleChange`

#### Interfaces & Types
- PascalCase with suffix: `TextInputProps`, `LoginResponse`
- Descriptive: `UpcomingAppointment`, `MedicalHistory`

---

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature: description in English"

# Push and create PR
git push origin feature/new-feature

# After review, merge to main
git checkout main
git merge feature/new-feature
```

---

### Debugging Tips

#### Browser DevTools
1. **Console**: Check for errors
2. **Network**: Verify API calls
3. **Application**: Check sessionStorage
4. **React DevTools**: Inspect component state

#### Debug Logs
```tsx
console.log('Component mounted');
console.log('Auth data:', authData);
console.log('API Response:', response);
```

#### Next.js Debug Mode
```bash
# Run with debug output
NODE_DEBUG=next npm run dev
```

---

### Common Patterns

#### Fetching Data on Mount
```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getData();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [dependency]);
```

#### Conditional Rendering
```tsx
{loading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{data && !loading && <Content data={data} />}
```

#### Form Submission
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    await apiService.submitForm(formData);
    setSuccess('¡Éxito!');
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## Quick Reference

| Task | File | Method |
|------|------|--------|
| Add API endpoint | `lib/apiService.ts` | Add function |
| Add type | `lib/types.ts` | Add interface |
| Add component | `components/` | Create .tsx file |
| Add page | `app/(dashboard)/` | Create folder with page.tsx |
| Handle auth | `context/AuthContext.tsx` | Use useAuth hook |
| Style element | `.tsx` file | Use Tailwind classes |
| Fetch data | Page component | Use useEffect + useState |
| Protect route | `middleware.ts` | Already configured |

---

**Happy coding! 🚀**
