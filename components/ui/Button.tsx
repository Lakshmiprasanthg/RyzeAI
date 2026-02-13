import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
}) => {
  // Ensure variant and size are valid
  const safeVariant: 'primary' | 'secondary' | 'outline' | 'danger' = 
    ['primary', 'secondary', 'outline', 'danger'].includes(variant as string) ? variant : 'primary';
  const safeSize: 'sm' | 'md' | 'lg' = 
    ['sm', 'md', 'lg'].includes(size as string) ? size : 'md';
  
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[safeVariant]} ${sizeClasses[safeSize]} ${widthClass} ${disabled ? 'cursor-not-allowed' : 'cursor-default'}`}
    >
      {children}
    </button>
  );
};

export default Button;
