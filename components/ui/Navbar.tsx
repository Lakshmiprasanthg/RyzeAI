import React from 'react';

export interface NavbarProps {
  brand?: React.ReactNode;
  items?: Array<{
    label: string;
    onClick?: () => void;
    active?: boolean;
  }>;
  actions?: React.ReactNode;
  variant?: 'light' | 'dark';
}

const Navbar: React.FC<NavbarProps> = ({
  brand,
  items = [],
  actions,
  variant = 'light',
}) => {
  const variantClasses = {
    light: 'bg-white border-b border-gray-200 text-gray-900',
    dark: 'bg-gray-900 border-b border-gray-700 text-white',
  };
  
  const itemClasses = {
    light: {
      default: 'text-gray-600 hover:text-gray-900',
      active: 'text-blue-600 font-semibold',
    },
    dark: {
      default: 'text-gray-300 hover:text-white',
      active: 'text-blue-400 font-semibold',
    },
  };
  
  return (
    <nav className={`${variantClasses[variant]} px-6 py-4`}>
      <div className="flex items-center justify-between">
        {/* Brand */}
        {brand && (
          <div className="flex-shrink-0">
            {brand}
          </div>
        )}
        
        {/* Navigation Items */}
        {items.length > 0 && (
          <div className="flex space-x-6 flex-1 justify-center">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  px-3 py-2 rounded-md text-sm transition-colors duration-200
                  ${item.active
                    ? itemClasses[variant].active
                    : itemClasses[variant].default
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Actions */}
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
