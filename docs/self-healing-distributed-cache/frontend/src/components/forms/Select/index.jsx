import React from 'react';

const Select = ({ value, onChange, options, className = '' }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-cta)] ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
