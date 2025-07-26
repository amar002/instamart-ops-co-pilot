import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-dark-border rounded-xl mb-4 md:mb-6 shadow-soft hover:shadow-medium transition-all duration-300">
      <button
        className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-dark-hover rounded-t-xl focus:outline-none hover:bg-dark-border transition-all duration-200"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-accent-500/10 rounded-xl flex items-center justify-center">
            <span className="text-accent-500 text-base md:text-lg">{open ? '📊' : '📈'}</span>
          </div>
          <span className="font-bold text-white text-base md:text-lg">{title}</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <span className="text-xs md:text-sm text-gray-400 hidden sm:inline">{open ? 'Collapse' : 'Expand'}</span>
          <span className={`text-accent-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>
      {open && (
        <div className="p-3 md:p-6 bg-dark-card backdrop-blur-sm rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection; 