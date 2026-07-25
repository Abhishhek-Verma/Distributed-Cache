import React from 'react';
import Badge from '../../common/Badge';

const StatusCard = ({
  title,
  status,
  description,
  className = ''
}) => {
  const statusMap = {
    healthy: 'healthy',
    warning: 'warning',
    critical: 'error',
    offline: 'offline'
  };

  const badgeVariant = statusMap[status?.toLowerCase()] || 'secondary';

  return (
    <div className={`p-3.5 bg-[var(--bg-primary)] ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        <Badge variant={badgeVariant} text={status || 'Unknown'} className="uppercase tracking-wider shrink-0" />
      </div>
      
      {description && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatusCard;
