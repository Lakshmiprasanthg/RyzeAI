import React from 'react';

export interface CenterProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Center: React.FC<CenterProps> = ({
  children,
  maxWidth = 'md',
  padding = 'md',
}) => {
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`flex items-center justify-center ${paddingClasses[padding]}`}>
      <div className={`w-full ${widthClasses[maxWidth]}`}>
        {children}
      </div>
    </div>
  );
};

export default Center;
