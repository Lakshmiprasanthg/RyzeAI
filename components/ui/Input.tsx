import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  label,
  error,
  disabled = false,
  fullWidth = false,
  size = 'md',
}) => {
  // Ensure size is valid
  const safeSize: 'sm' | 'md' | 'lg' = 
    ['sm', 'md', 'lg'].includes(size as string) ? size : 'md';
  
  const baseClasses = 'border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={widthClass}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly
        className={`${baseClasses} ${sizeClasses[safeSize]} ${stateClasses} ${widthClass} ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
