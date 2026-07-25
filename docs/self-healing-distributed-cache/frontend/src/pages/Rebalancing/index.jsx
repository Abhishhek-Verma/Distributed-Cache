import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import StatusCard from '../../components/cards/StatusCard';
import PageHeader from '../../components/common/PageHeader';
import { RefreshCcw, ArrowLeftRight, CheckCircle, Database } from 'lucide-react';

const Rebalancing = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Rebalancing & Self-Healing"
        description="Automated partition rebalancing, virtual node migration, and cluster self-healing logs."
      />

      {/* Top Metric Cards Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Rebalance Status" value="Idle" icon={<RefreshCcw size={18} />} />
        <MetricCard title="Keys Migrated" value="45,210" icon={<ArrowLeftRight size={18} />} />
        <MetricCard title="Last Rebalance" value="2h ago" icon={<CheckCircle size={18} />} />
        <MetricCard title="Virtual Nodes" value="256" icon={<Database size={18} />} />
      </div>

      {/* Lower Section - Border-Joined Double Column Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-3 gap-px">
        <div className="lg:col-span-2 bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <RefreshCcw size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Live Key Migration Stream</p>
          <p className="text-xs text-[var(--text-muted)]">Available in Phase 4</p>
        </div>

        <div className="lg:col-span-1 bg-[var(--border-color)] grid grid-cols-1 gap-px">
          <StatusCard
            title="Auto-Healing Policy"
            status="healthy"
            description="Automatic failover and partition redistribution active with 30s detection window."
          />
          <StatusCard
            title="Consistent Hash Ring"
            status="healthy"
            description="256 virtual nodes distributed across active physical cache nodes."
          />
        </div>
      </div>
    </div>
  );
};

export default Rebalancing;
