import React from 'react';

export interface StackProps {
  children: React.ReactNode;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const Stack: React.FC<StackProps> = ({
  children,
  gap = 'md',
  direction = 'vertical',
  align = 'stretch',
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div className={`flex ${directionClasses[direction]} ${gapClasses[gap]} ${alignClasses[align]}`}>
      {children}
    </div>
  );
};

export default Stack;
