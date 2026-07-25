import React from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const VARIANTS = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    iconText: 'text-blue-500 dark:text-blue-400',
    Icon: Info,
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    iconText: 'text-green-500 dark:text-green-400',
    Icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    iconText: 'text-yellow-500 dark:text-yellow-400',
    Icon: AlertTriangle,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    iconText: 'text-red-500 dark:text-red-400',
    Icon: XCircle,
  },
};

const Alert = ({
  variant = 'info',
  title,
  description,
  action,
  className = '',
}) => {
  const config = VARIANTS[variant] || VARIANTS.info;
  const { Icon } = config;

  return (
    <div className={`px-3 py-2.5 rounded-[var(--radius-md)] border ${config.bg} ${config.border} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-4 w-4 ${config.iconText}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${config.text}`}>
            {title}
          </h3>
          {description && (
            <div className={`mt-0.5 text-xs ${config.text} opacity-90`}>
              <p>{description}</p>
            </div>
          )}
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
