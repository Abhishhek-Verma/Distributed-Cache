import React from 'react';

const Divider = ({ orientation = 'horizontal', className = '' }) => {
  if (orientation === 'vertical') {
    return (
      <div 
        className={`h-full w-px bg-[var(--border-color)] ${className}`} 
        role="separator" 
        aria-orientation="vertical" 
      />
    );
  }
  
  return (
    <div 
      className={`w-full h-px bg-[var(--border-color)] ${className}`} 
      role="separator" 
      aria-orientation="horizontal" 
    />
  );
};

export default Divider;
