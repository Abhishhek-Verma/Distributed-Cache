import React from 'react';

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <div
      className={`
        rounded-full border-[var(--color-brand-cta)] border-t-transparent animate-spin
        ${sizeClass} ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
