import React from 'react';

const TextArea = ({ value, onChange, disabled, placeholder, className = '' }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full h-48 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-cta)] disabled:opacity-50 ${className}`}
      placeholder={placeholder}
    />
  );
};

export default TextArea;
