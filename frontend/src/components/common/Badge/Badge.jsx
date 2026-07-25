import React from 'react';

const VARIANTS = {
  healthy: 'bg-[var(--color-success)] text-white',
  warning: 'bg-[var(--color-warning)] text-white',
  error: 'bg-[var(--color-error)] text-white',
  offline: 'bg-gray-500 text-white',
  primary: 'bg-[var(--color-brand-cta)] text-white',
  secondary: 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)]',
  info: 'bg-[var(--color-info)] text-white',
};

const Badge = ({
  variant = 'secondary',
  text,
  icon,
  className = '',
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.secondary;
  
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] text-xs font-semibold
        ${variantClass} ${className}
      `}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {text}
    </span>
  );
};

export default Badge;
