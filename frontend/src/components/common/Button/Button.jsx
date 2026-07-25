import React from 'react';

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-13 px-6 text-lg',
};

const VARIANTS = {
  primary: 'bg-[var(--color-brand-cta)] text-white hover:brightness-110 shadow-sm border border-transparent',
  secondary: 'bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-gray-200 dark:hover:bg-gray-600 border border-[var(--border-color)]',
  outline: 'bg-transparent text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)]',
  ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent',
  danger: 'bg-[var(--color-error)] text-white hover:brightness-110 shadow-sm border border-transparent',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  trailingIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  const sizeClass = SIZES[size] || SIZES.md;
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  
  const baseClasses = `
    inline-flex items-center justify-center font-medium
    rounded-[var(--radius-sm)] transition-all duration-[var(--duration-btn)]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-cta)] focus-visible:ring-offset-2
  `;

  const stateClasses = disabled || loading
    ? 'opacity-60 cursor-not-allowed'
    : 'cursor-pointer active:scale-[0.98]';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${stateClasses} ${widthClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {!loading && trailingIcon && <span className="ml-2">{trailingIcon}</span>}
    </button>
  );
};

export default Button;
