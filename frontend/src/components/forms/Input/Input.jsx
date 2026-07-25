import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  fullWidth = true,
  ...rest
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`flex flex-col ${widthClass} ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 text-sm font-medium text-[var(--text-primary)]"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`
          px-3 py-2 bg-[var(--bg-primary)] border 
          text-[var(--text-primary)] text-sm rounded-[var(--radius-sm)]
          transition-colors duration-[var(--duration-btn)]
          placeholder-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-cta)] focus:border-transparent
          disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' : 'border-[var(--border-color)]'}
        `}
        {...rest}
      />
      {error && (
        <span className="mt-1.5 text-xs text-[var(--color-error)]">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
