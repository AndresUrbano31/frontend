'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all placeholder-gray-400 font-medium ${
          error
            ? 'border-red-500 focus:ring-red-300'
            : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}
    </div>
  );
}
