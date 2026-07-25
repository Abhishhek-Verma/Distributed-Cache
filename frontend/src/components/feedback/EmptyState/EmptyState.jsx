import React from 'react';
import Button from '../../common/Button';

const EmptyState = ({ title, description, icon, actionLabel, onAction, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-secondary)] rounded-[var(--radius-md)] border border-[var(--border-color)] ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] text-sm max-w-md mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
