'use client';

interface LabResultBadgeProps {
  isNormal: boolean;
}

export function LabResultBadge({ isNormal }: LabResultBadgeProps) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
        isNormal
          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300'
      }`}
    >
      {isNormal ? '✓ Normal' : '⚠ Fuera de rango'}
    </span>
  );
}
