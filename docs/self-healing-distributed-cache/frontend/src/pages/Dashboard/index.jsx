import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import StatusCard from '../../components/cards/StatusCard';
import Alert from '../../components/feedback/Alert';
import PageHeader from '../../components/common/PageHeader';
import { Database, HardDrive, Activity, Zap } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const Dashboard = () => {
  const { useGetClusterInfo, useGetHealth } = useCluster();
  const { data: clusterData, isLoading: isClusterLoading, error: clusterError } = useGetClusterInfo();
  const { data: healthData, isLoading: isHealthLoading, error: healthError } = useGetHealth();

  const cluster = clusterData?.data || {};
  const activeNodes = cluster.healthyNodes ?? 0;
  const totalNodes = cluster.totalNodes ?? 0;
  const failedNodes = cluster.failedNodes ?? 0;

  const alerts = [];
  if (failedNodes > 0) {
    alerts.push({
      id: 'failed-nodes',
      variant: 'warning',
      title: 'Node Failure Detected',
      description: `${failedNodes} node(s) currently offline in cluster registry.`
    });
  }

  const isHealthy = !clusterError && !healthError && healthData?.status === 'UP';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your distributed cache cluster."
      />

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
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
        <MetricCard
          title="Active Nodes"
          value={isClusterLoading ? 'Loading...' : `${activeNodes} / ${totalNodes}`}
          icon={<Database size={18} />}
        />
        <MetricCard
          title="Replication Factor"
          value={isClusterLoading ? 'Loading...' : `${cluster.replicationFactor ?? 2}`}
          icon={<HardDrive size={18} />}
        />
        <MetricCard
          title="Cluster Status"
          value={isClusterLoading ? 'Loading...' : (failedNodes === 0 ? 'Optimal' : 'Degraded')}
          icon={<Activity size={18} />}
        />
        <MetricCard
          title="Gateway Status"
          value={isHealthLoading ? 'Loading...' : (healthData?.status === 'UP' ? 'Online' : 'Offline')}
          icon={<Zap size={18} />}
        />
      </div>

      {/* Lower Section - Border-Joined Double Column Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-3 gap-px">
        <div className="lg:col-span-2 bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Activity size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Cluster Traffic Telemetry</p>
          <p className="text-xs text-[var(--text-muted)]">
            {isHealthy ? `Gateway live on port 3000 — Cluster Manager operational.` : `Connecting to Cluster Manager API...`}
          </p>
        </div>

        <div className="lg:col-span-1 bg-[var(--border-color)] grid grid-cols-1 gap-px">
          <StatusCard
            title="Cluster Health"
            status={failedNodes === 0 && !clusterError ? 'healthy' : 'warning'}
            description={clusterError ? `Cluster Manager API Error: ${clusterError.message}` : `Active Nodes: ${activeNodes}. Failed Nodes: ${failedNodes}.`}
          />
          <StatusCard
            title="Gateway API"
            status={isHealthy ? 'healthy' : 'error'}
            description={healthError ? `Gateway Error: ${healthError.message}` : `Gateway routing requests cleanly.`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
