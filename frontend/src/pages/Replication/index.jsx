import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/cards/MetricCard';
import { GitBranch, RefreshCw, Info } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const Replication = () => {
  const { useGetClusterInfo, useGetClusterNodes } = useCluster();
  const { data: clusterData, isLoading: isClusterLoading } = useGetClusterInfo();
  const { data: nodesData } = useGetClusterNodes();

  const cluster = clusterData?.data || {};
  const nodes = nodesData?.data || [];

  const replicationRows = nodes.map((n, idx) => {
    const nextNode = nodes[(idx + 1) % nodes.length] || n;
    return {
      id: `rep-0${idx + 1}`,
      primary: n.id,
      replica: nextNode.id,
      status: n.status === 'ONLINE' ? 'ONLINE' : 'DEGRADED',
      replicationFactor: cluster.replicationFactor || 2
    };
  });

  const columns = [
    { key: 'id', label: 'Pair ID', render: (val) => <span className="font-medium text-[var(--color-brand-cta)]">{val}</span> },
    { key: 'primary', label: 'Primary Node ID' },
    { key: 'replica', label: 'Replica Node ID' },
    {
      key: 'status',
      label: 'Node Status',
      render: (val) => (
        <Badge
          variant={val === 'ONLINE' ? 'healthy' : 'warning'}
          text={val}
          className="uppercase"
        />
      )
    },
    { key: 'replicationFactor', label: 'Replication Factor' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Replication"
        description="Monitor data replication status, sync lag, and replica pairs across nodes."
      />

      <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        <Info size={14} className="text-[var(--color-brand-cta)] shrink-0" />
        <span>Notice: Replica pairs and topology mapping displayed below are <strong>Derived from backend data</strong> (`GET /api/v1/cluster` & `GET /api/v1/cluster/nodes`).</span>
      </div>

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
        <MetricCard title="Total Cluster Nodes" value={`${nodes.length}`} icon={<GitBranch size={18} />} />
        <MetricCard title="Replication Factor" value={isClusterLoading ? 'Loading...' : `${cluster.replicationFactor ?? 2}`} icon={<RefreshCw size={18} />} />
        <MetricCard title="Active Healthy Pairs" value={isClusterLoading ? 'Loading...' : `${cluster.healthyNodes ?? nodes.length}`} icon={<GitBranch size={18} />} />
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Replica Topology Mapping</h2>
        <DataTable
          columns={columns}
          data={replicationRows}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Replication;
