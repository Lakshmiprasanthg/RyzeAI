import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  padding = 'md',
}) => {
  // Ensure variant and padding are valid
  const safeVariant: 'default' | 'bordered' | 'elevated' = 
    ['default', 'bordered', 'elevated'].includes(variant as string) ? variant : 'default';
  const safePadding: 'none' | 'sm' | 'md' | 'lg' = 
    ['none', 'sm', 'md', 'lg'].includes(padding as string) ? padding : 'md';
  
  const baseClasses = 'rounded-lg bg-white';
  
  const variantClasses = {
    default: 'border border-gray-200',
    bordered: 'border-2 border-gray-300',
    elevated: 'shadow-lg',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[safeVariant]} ${paddingClasses[safePadding]}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
