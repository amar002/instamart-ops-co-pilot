import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-2">
      <button
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-t-lg focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        <span className="ml-2 text-gray-500 dark:text-gray-300">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

export default CollapsibleSection; 