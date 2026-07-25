import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import StatusCard from '../../components/cards/StatusCard';
import Alert from '../../components/feedback/Alert';
import PageHeader from '../../components/common/PageHeader';
import { Database, HardDrive, Activity, Zap } from 'lucide-react';

const MOCK_METRICS = {
  activeNodes: 8,
  totalNodes: 8,
  cacheSize: '4.2 GB',
  hitRate: '98.5%',
  requestRate: '12,450/s'
};

const MOCK_ALERTS = [
  { id: 1, variant: 'warning', title: 'High Memory Usage', description: 'Node cache-03 is approaching 90% memory utilization.' },
  { id: 2, variant: 'info', title: 'Rebalancing Complete', description: 'Keys successfully migrated after node join.' }
];

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your distributed cache cluster."
      />

      {MOCK_ALERTS.length > 0 && (
        <div className="space-y-2">
          {MOCK_ALERTS.map(alert => (
            <Alert
              key={alert.id}
              variant={alert.variant}
              title={alert.title}
              description={alert.description}
            />
          ))}
        </div>
      )}

      {/* Top Metric Cards - Border-Joined Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Active Nodes" value={`${MOCK_METRICS.activeNodes} / ${MOCK_METRICS.totalNodes}`} icon={<Database size={18} />} trend={0} trendDirection="up" />
        <MetricCard title="Total Cache Size" value={MOCK_METRICS.cacheSize} icon={<HardDrive size={18} />} trend={12.5} trendDirection="up" />
        <MetricCard title="Global Hit Rate" value={MOCK_METRICS.hitRate} icon={<Activity size={18} />} trend={2.1} trendDirection="up" />
        <MetricCard title="Request Rate" value={MOCK_METRICS.requestRate} icon={<Zap size={18} />} trend={1.5} trendDirection="down" />
      </div>

      {/* Lower Section - Border-Joined Double Column Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-3 gap-px">
        <div className="lg:col-span-2 bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Activity size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Cluster Traffic Chart</p>
          <p className="text-xs text-[var(--text-muted)]">Available in Phase 4</p>
        </div>

        <div className="lg:col-span-1 bg-[var(--border-color)] grid grid-cols-1 gap-px">
          <StatusCard title="Cluster Health" status="healthy" description="All nodes are responding to heartbeats. Replication is synchronized." />
          <StatusCard title="Gateway API" status="healthy" description="Gateway is routing requests with avg 1.2ms latency." />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
