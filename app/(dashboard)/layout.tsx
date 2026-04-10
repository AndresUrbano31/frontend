'use client';

import { Navigation } from '@/components/Navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </ProtectedRoute>
  );
}
