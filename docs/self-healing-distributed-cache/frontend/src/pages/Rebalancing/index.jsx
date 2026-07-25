import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import StatusCard from '../../components/cards/StatusCard';
import PageHeader from '../../components/common/PageHeader';
import { RefreshCcw, ArrowLeftRight, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const Rebalancing = () => {
  const { useGetClusterInfo, useGetClusterNodes } = useCluster();
  const { data: clusterData, isLoading: isClusterLoading } = useGetClusterInfo();
  const { data: nodesData } = useGetClusterNodes();

  const cluster = clusterData?.data || {};
  const nodes = nodesData?.data || [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Rebalancing & Self-Healing"
        description="Automated partition rebalancing, virtual node migration, and cluster self-healing logs."
      />

      {/* Top Metric Cards Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Rebalance Policy" value="Automatic" icon={<RefreshCcw size={18} />} />
        <MetricCard title="Active Cache Nodes" value={isClusterLoading ? 'Loading...' : `${cluster.healthyNodes ?? nodes.length}`} icon={<ArrowLeftRight size={18} />} />
        <MetricCard title="Self-Healing Status" value={cluster.failedNodes === 0 ? 'Optimal' : 'Rebalancing'} icon={<CheckCircle size={18} />} />
        <MetricCard title="Virtual Node Tokens" value="256 / Node" icon={<Database size={18} />} />
      </div>

      {/* Lower Section - Border-Joined Double Column Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-3 gap-px">
        <div className="lg:col-span-2 bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <RefreshCcw size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Consistent Hash Ring Partitioning</p>
          <p className="text-xs text-[var(--text-muted)] max-w-md">
            {nodes.length > 0
              ? `Virtual node tokens assigned across physical peers: ${nodes.map(n => n.id).join(', ')}.`
              : `Connecting to Cluster Manager API...`}
          </p>
          <div className="mt-3 p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] text-xs text-amber-500 flex items-center gap-1.5">
            <AlertCircle size={14} className="shrink-0" />
            <span>Note: The backend does not currently expose live migration progress stream.</span>
          </div>
        </div>

        <div className="lg:col-span-1 bg-[var(--border-color)] grid grid-cols-1 gap-px">
          <StatusCard
            title="Auto-Healing Policy"
            status="healthy"
            description="Cluster Manager automatically redistributes key range partitions upon node failure."
          />
          <StatusCard
            title="Consistent Hash Ring"
            status="healthy"
            description="MD5 hashing ring evenly balancing keyspace across registered node tokens."
          />
        </div>
      </div>
    </div>
  );
};

export default Rebalancing;
