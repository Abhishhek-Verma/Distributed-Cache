import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import { useCluster } from '../../hooks/useCluster';

const SystemInformation = () => {
  const { useGetHealth, useGetClusterInfo } = useCluster();
  const { data: healthData } = useGetHealth();
  const { data: clusterData } = useGetClusterInfo();

  const cluster = clusterData?.data || {};

  const systemProps = [
    { key: 'Gateway Service Status', value: healthData?.status || 'UP' },
    { key: 'Cluster Manager Service', value: cluster.totalNodes ? 'UP' : 'UNKNOWN' },
    { key: 'Replication Factor', value: `${cluster.replicationFactor || 2}` },
    { key: 'Total Cache Nodes', value: `${cluster.totalNodes || 4}` },
    { key: 'Healthy Cache Nodes', value: `${cluster.healthyNodes || 4}` },
    { key: 'Failed Cache Nodes', value: `${cluster.failedNodes || 0}` },
    { key: 'Virtual Nodes per Peer', value: '256' },
    { key: 'Gateway Port', value: '3000' },
    { key: 'Cluster Manager Port', value: '8082' }
  ];

  const columns = [
    { key: 'key', label: 'Property', render: (val) => <span className="font-medium text-[var(--text-primary)]">{val}</span> },
    {
      key: 'value',
      label: 'Value',
      render: (val) => (
        val === 'UP'
          ? <Badge variant="healthy" text={val} />
          : <span className="font-mono text-xs text-[var(--text-secondary)]">{val}</span>
      )
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <PageHeader
        title="System Information"
        description="System and environment variables currently active across the cluster."
      />

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Environment & Cluster Metadata</h2>
        <DataTable
          columns={columns}
          data={systemProps}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SystemInformation;
