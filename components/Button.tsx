'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const variantClasses = {
    primary: 'bg-linear-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 disabled:from-gray-400 disabled:to-gray-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-300 disabled:text-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:bg-gray-400',
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}
