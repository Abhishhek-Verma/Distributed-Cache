import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import StatusCard from '../../components/cards/StatusCard';
import PageHeader from '../../components/common/PageHeader';
import { Network, Server, HardDrive, Share2 } from 'lucide-react';

const ClusterOverview = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Cluster Overview"
        description="Topology and health summary of all cluster components."
      />

      {/* Top Metric Cards - Border-Joined Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Gateway Nodes" value="1" icon={<Server size={18} />} />
        <MetricCard title="Cache Nodes" value="4" icon={<Network size={18} />} />
        <MetricCard title="Total Capacity" value="4.0 GB" icon={<HardDrive size={18} />} />
        <MetricCard title="Replication Factor" value="2" icon={<Share2 size={18} />} />
      </div>

      {/* Lower Section - Border-Joined Double Column Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-3 gap-px">
        <div className="lg:col-span-2 bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Network size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Cluster Topology Visualization</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm">
            Available in Phase 4 — dynamically maps connections between Gateway, Cluster Manager, and Cache Nodes.
          </p>
        </div>

        <div className="lg:col-span-1 bg-[var(--border-color)] grid grid-cols-1 gap-px">
          <StatusCard
            title="Consistent Hashing"
            status="healthy"
            description="Virtual nodes are evenly distributed across the 4 active physical nodes."
          />
          <StatusCard
            title="Cluster Manager"
            status="healthy"
            description="Leader election stable. Handling heartbeats and node registration successfully."
          />
        </div>
      </div>
    </div>
  );
};

export default ClusterOverview;
