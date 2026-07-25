import React from 'react';
import StatusCard from '../../components/cards/StatusCard';
import PageHeader from '../../components/common/PageHeader';
import { HeartPulse, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const Health = () => {
  const { useGetHealth, useGetClusterInfo, useGetClusterNodes } = useCluster();
  const { data: healthData, isLoading: isHealthLoading, error: healthError } = useGetHealth();
  const { data: clusterData, isLoading: isClusterLoading, error: clusterError } = useGetClusterInfo();
  const { data: nodesData } = useGetClusterNodes();

  const cluster = clusterData?.data || {};
  const nodes = nodesData?.data || [];
  const healthyCount = cluster.healthyNodes ?? nodes.filter(n => n.status === 'ONLINE').length;
  const totalCount = cluster.totalNodes ?? nodes.length;
  const failedCount = cluster.failedNodes ?? (totalCount - healthyCount);

  const isOverallHealthy = !healthError && !clusterError && failedCount === 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Health Status"
        description="Real-time health indicators and diagnostics across all sub-systems."
      />

      <div className={`p-3.5 rounded-[var(--radius-md)] border flex items-center gap-3 ${
        isOverallHealthy ? 'bg-[var(--bg-primary)] border-[var(--border-color)]' : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        {isOverallHealthy ? (
          <CheckCircle2 size={22} className="text-[var(--color-success)] shrink-0" />
        ) : (
          <AlertTriangle size={22} className="text-amber-500 shrink-0" />
        )}
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            {isOverallHealthy ? 'System Fully Operational' : 'System Degraded'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            {isOverallHealthy
              ? `All ${healthyCount} active cache nodes, gateway, and heartbeat monitors operating within normal parameters.`
              : `Cluster running with ${failedCount} node failure(s). Active nodes: ${healthyCount}/${totalCount}.`}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Subsystem Health</h2>

        {/* Subsystem Health Cards Grid - Border-Joined Panel */}
        <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          <StatusCard
            title="Gateway API"
            status={isHealthLoading ? 'warning' : healthError ? 'error' : 'healthy'}
            description={healthError ? `Gateway API unreachable: ${healthError.message}` : 'Proxying HTTP GET, SET, DELETE requests cleanly on port 3000.'}
          />
          <StatusCard
            title="Cluster Manager"
            status={isClusterLoading ? 'warning' : clusterError ? 'error' : 'healthy'}
            description={clusterError ? `Cluster Manager API unreachable` : `Cluster Manager active on port 8082 handling ring topology.`}
          />
          <StatusCard
            title="Cache Partition Ring"
            status={healthyCount > 0 ? 'healthy' : 'warning'}
            description={`Consistent Hash Ring partitioning requests across ${healthyCount} online cache node(s).`}
          />
          <StatusCard
            title="Storage Engine"
            status="healthy"
            description="In-memory TTL eviction background timer running optimal."
          />
          <StatusCard
            title="Replication Pipeline"
            status={cluster.replicationFactor > 1 ? 'healthy' : 'warning'}
            description={`Data replication factor set to ${cluster.replicationFactor || 2}.`}
          />
          <StatusCard
            title="Heartbeat Monitor"
            status={failedCount === 0 ? 'healthy' : 'warning'}
            description={`Monitoring node pings every 5000ms. Active: ${healthyCount}/${totalCount}.`}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Recent Failures & Recovery Logs</h2>
        <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] flex flex-col items-center justify-center text-center gap-1.5 text-[var(--text-muted)]">
          <HeartPulse size={28} className="opacity-30" />
          <p className="text-xs text-[var(--text-secondary)]">
            {failedCount > 0
              ? `${failedCount} node failure incident(s) currently being handled by Cluster Manager self-healing recovery.`
              : 'No active failure incidents recorded in Cluster Manager registry.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Health;
