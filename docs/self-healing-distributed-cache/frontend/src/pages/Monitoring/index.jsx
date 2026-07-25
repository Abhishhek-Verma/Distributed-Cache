import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import { Activity, Cpu, Server, BarChart2 } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const Monitoring = () => {
  const { useGetClusterInfo, useGetClusterNodes, useGetHealth } = useCluster();
  const { data: clusterData } = useGetClusterInfo();
  const { data: nodesData } = useGetClusterNodes();
  const { data: healthData } = useGetHealth();

  const cluster = clusterData?.data || {};
  const nodes = nodesData?.data || [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Monitoring"
        description="System resource usage and network throughput across all nodes."
      />

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Gateway Service" value={healthData?.status === 'UP' ? 'Online' : 'Offline'} icon={<Activity size={18} />} />
        <MetricCard title="Monitored Cache Nodes" value={`${nodes.length} Nodes`} icon={<Server size={18} />} />
        <MetricCard title="Cluster Healthy Nodes" value={`${cluster.healthyNodes ?? nodes.length}`} icon={<Cpu size={18} />} />
        <MetricCard title="Failed Node Counter" value={`${cluster.failedNodes ?? 0}`} icon={<BarChart2 size={18} />} />
      </div>

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 lg:grid-cols-2 gap-px">
        <div className="bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Activity size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Node Health Monitoring</p>
          <p className="text-xs text-[var(--text-muted)]">Active Cache Node List: {nodes.map(n => n.id).join(', ')}</p>
        </div>

        <div className="bg-[var(--bg-primary)] p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
          <Server size={36} className="opacity-30 text-[var(--color-brand-cta)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Prometheus Telemetry Scraper</p>
          <p className="text-xs text-[var(--text-muted)]">Prometheus scraping endpoints active on ports 3000, 8082, and 5001-5004.</p>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
