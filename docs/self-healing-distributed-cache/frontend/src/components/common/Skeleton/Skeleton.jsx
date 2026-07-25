import React from 'react';

const Skeleton = ({ variant = 'text', className = '' }) => {
  const baseClasses = 'bg-[var(--border-color)] animate-pulse rounded-[var(--radius-sm)]';
  
  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-32 w-full rounded-[var(--radius-md)]',
    table: 'h-10 w-full',
    chart: 'h-64 w-full rounded-[var(--radius-md)]',
    avatar: 'h-10 w-10 rounded-full',
  };

  const selectedClass = variantClasses[variant] || variantClasses.text;

  return <div className={`${baseClasses} ${selectedClass} ${className}`} aria-hidden="true" />;
};

export default Skeleton;
