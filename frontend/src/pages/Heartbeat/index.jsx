import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/cards/MetricCard';
import { Heart, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const Heartbeat = () => {
  const { useGetClusterNodes, useGetClusterInfo } = useCluster();
  const { data: nodesData, isLoading: isNodesLoading } = useGetClusterNodes();
  const { data: clusterData } = useGetClusterInfo();

  const nodes = nodesData?.data || [];
  const cluster = clusterData?.data || {};

  const heartbeatRows = nodes.map(n => ({
    node: n.id,
    status: n.status === 'ONLINE' ? 'alive' : n.status === 'DEGRADED' ? 'degraded' : 'dead',
    lastPing: n.lastHeartbeat ? `${Math.round((Date.now() - new Date(n.lastHeartbeat).getTime()) / 1000)}s ago` : 'Active',
    interval: '5000ms',
    address: `${n.host}:${n.port}`
  }));

  const columns = [
    { key: 'node', label: 'Node ID', render: (val) => <span className="font-medium text-[var(--color-brand-cta)]">{val}</span> },
    {
      key: 'status',
      label: 'Heartbeat Status',
      render: (val) => (
        <Badge
          variant={val === 'alive' ? 'healthy' : val === 'degraded' ? 'warning' : 'error'}
          text={val}
          className="uppercase"
        />
      )
    },
    { key: 'address', label: 'Node Address' },
    { key: 'lastPing', label: 'Last Heartbeat' },
    { key: 'interval', label: 'Heartbeat Window' }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Heartbeat Monitor"
        description="Node health heartbeats, failure detection intervals, and pulse response times."
      />

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Monitored Nodes" value={isNodesLoading ? 'Loading...' : `${nodes.length}`} icon={<Heart size={18} />} />
        <MetricCard title="Heartbeat Interval" value="5000ms" icon={<Activity size={18} />} />
        <MetricCard title="Quorum Status" value={cluster.healthyNodes > 0 ? 'Healthy' : 'Degraded'} icon={<ShieldCheck size={18} />} />
        <MetricCard title="Failed Heartbeats" value={`${cluster.failedNodes ?? 0}`} icon={<AlertTriangle size={18} />} />
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Node Pulse Status</h2>
        <DataTable
          columns={columns}
          data={heartbeatRows}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Heartbeat;
