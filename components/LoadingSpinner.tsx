'use client';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="animate-spin">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
      </div>
      <span className="text-gray-600 font-medium">Cargando...</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="text-center">
        <div className="animate-spin mb-4 inline-block">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-semibold">Cargando...</p>
      </div>
    </div>
  );
}
