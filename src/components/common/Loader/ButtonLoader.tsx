import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonLoaderProps {
  text?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  text = 'Loading...',
  fullWidth = false,
  size = 'md',
  variant = 'primary'
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      type="button"
      disabled
      className={`
        inline-flex items-center justify-center
        ${fullWidth ? 'w-full' : ''}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg font-medium
        opacity-75 cursor-not-allowed
        transition-all duration-200
      `}
    >
      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
      {text}
    </button>
  );
};

export default ButtonLoader;
