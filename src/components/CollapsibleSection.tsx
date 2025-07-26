import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <button
        className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-t-xl focus:outline-none hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-swiggy-orange/10 rounded-lg flex items-center justify-center">
            <span className="text-swiggy-orange text-lg">{open ? '📊' : '📈'}</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">{open ? 'Collapse' : 'Expand'}</span>
          <span className={`text-swiggy-orange transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>
      {open && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection; 