import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  centered = false,
}) => {
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };

  const centerClass = centered ? 'mx-auto' : '';

  return (
    <div className={`${widthClasses[maxWidth]} ${paddingClasses[padding]} ${centerClass}`}>
      {children}
    </div>
  );
};

export default Container;
