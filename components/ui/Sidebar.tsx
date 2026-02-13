import React from 'react';

export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  header,
  footer,
  width = 'md',
  position = 'left',
}) => {
  // Ensure width is valid
  const safeWidth: 'sm' | 'md' | 'lg' = 
    ['sm', 'md', 'lg'].includes(width as string) ? width : 'md';
  
  const widthClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };
  
  return (
    <div className={`${widthClasses[safeWidth]} bg-gray-900 text-white flex flex-col h-full`}>
      {/* Header */}
      {header && (
        <div className="p-4 border-b border-gray-700">
          {header}
        </div>
      )}
      
      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${item.active
                ? 'bg-blue-600 text-white'
                : 'text-gray-300'
              }
            `}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
