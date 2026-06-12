import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline';
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const baseStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const variants = {
    primary: { backgroundColor: '#007bff', color: '#fff' },
    danger: { backgroundColor: '#dc3545', color: '#fff' },
    outline: { backgroundColor: 'transparent', border: '1px solid #007bff', color: '#007bff' },
  };

  return (
    <button style={{ ...baseStyle, ...variants[variant] }} {...props}>
      {children}
    </button>
  );
}