import React from 'react';
import Skeleton from '../../common/Skeleton';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection, 
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return <Skeleton variant="card" className={className} />;
  }

  const isTrendUp = trendDirection === 'up';
  const isTrendDown = trendDirection === 'down';
  const hasTrend = trend !== undefined && trend !== null;

  return (
    <div className={`p-4 bg-[var(--bg-primary)] ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {title}
        </h3>
        {icon && (
          <div className="text-[var(--color-brand-accent)]">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-[var(--text-primary)]">
          {value}
        </p>
        
        {hasTrend && (
          <div className={`flex items-center text-xs font-semibold ${
            isTrendUp ? 'text-[var(--color-success)]' : 
            isTrendDown ? 'text-[var(--color-error)]' : 
            'text-[var(--text-muted)]'
          }`}>
            {isTrendUp && <ArrowUpRight size={14} className="mr-0.5" />}
            {isTrendDown && <ArrowDownRight size={14} className="mr-0.5" />}
            {trend}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
