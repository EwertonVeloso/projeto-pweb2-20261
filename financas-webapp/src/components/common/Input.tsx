import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full rounded-lg border px-4 py-2.5
          text-sm text-gray-900 placeholder-gray-400
          transition-all duration-200
          bg-white
          border-gray-300
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          focus:outline-none
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <span className="text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
