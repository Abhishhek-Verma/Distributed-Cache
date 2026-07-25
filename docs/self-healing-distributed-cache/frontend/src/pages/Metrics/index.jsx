import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import { Target, Zap, Clock, ShieldCheck } from 'lucide-react';

const Metrics = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Metrics"
        description="Cache performance statistics and throughput analysis."
      />

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Cache Hits" value="1.4M" icon={<Target size={18} />} trend={5.2} trendDirection="up" />
        <MetricCard title="Cache Misses" value="21K" icon={<Zap size={18} />} trend={1.2} trendDirection="down" />
        <MetricCard title="Avg Latency" value="1.2ms" icon={<Clock size={18} />} trend={0} trendDirection="up" />
        <MetricCard title="Hit Ratio" value="98.5%" icon={<ShieldCheck size={18} />} trend={0.5} trendDirection="up" />
      </div>

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-2 gap-px">
        <div className="bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Target size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Hit/Miss Ratio Over Time</p>
          <p className="text-xs text-[var(--text-muted)]">Available in Phase 4</p>
        </div>

        <div className="bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <ShieldCheck size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Request Distribution</p>
          <p className="text-xs text-[var(--text-muted)]">Available in Phase 4</p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
