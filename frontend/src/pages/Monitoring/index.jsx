import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import { Activity, Cpu, Server, BarChart2 } from 'lucide-react';

const Monitoring = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Monitoring"
        description="System resource usage and network throughput across all nodes."
      />

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Total Traffic" value="2.4 GB/s" icon={<Activity size={18} />} trend={4.2} trendDirection="up" />
        <MetricCard title="Avg CPU Usage" value="45%" icon={<Cpu size={18} />} trend={2.1} trendDirection="down" />
        <MetricCard title="Active Connections" value="1,402" icon={<Server size={18} />} trend={8.4} trendDirection="up" />
        <MetricCard title="System Load" value="1.24" icon={<BarChart2 size={18} />} />
      </div>

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-2 gap-px">
        <div className="bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Activity size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">CPU & Memory Usage</p>
          <p className="text-xs text-[var(--text-muted)]">Available in Phase 4</p>
        </div>

        <div className="bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Server size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Network Throughput</p>
          <p className="text-xs text-[var(--text-muted)]">Available in Phase 4</p>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
