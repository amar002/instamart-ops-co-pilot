import React from 'react';

interface InstamartLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const InstamartLogo: React.FC<InstamartLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Orange square with white location pin */}
      <div className={`${sizeClasses[size]} bg-instamart-orange rounded-xl flex items-center justify-center shadow-medium`}>
        <svg 
          className="w-3/5 h-3/5 text-instamart-white" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          {/* Location pin with subtle shopping cart elements */}
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-instamart-white ${textSizes[size]} leading-none`}>
            instamart
          </span>
          <span className="text-xs text-instamart-white/80 leading-none">
            ops co-pilot
          </span>
        </div>
      )}
    </div>
  );
};

export default InstamartLogo; 