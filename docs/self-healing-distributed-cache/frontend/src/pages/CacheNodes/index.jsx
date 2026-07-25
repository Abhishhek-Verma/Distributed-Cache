import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { Database, HardDrive, Zap, Trash2 } from 'lucide-react';
import { useCluster } from '../../hooks/useCluster';

const CacheNodes = () => {
  const { useGetClusterNodes, useRemoveNode } = useCluster();
  const { data: nodesData, isLoading, error } = useGetClusterNodes();
  const removeNodeMutation = useRemoveNode();

  const nodesList = nodesData?.data || [];

  const handleRemoveNode = (nodeId) => {
    if (window.confirm(`Are you sure you want to remove node ${nodeId} from cluster?`)) {
      removeNodeMutation.mutate(nodeId);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Node ID',
      sortable: true,
      render: (val) => <span className="font-medium text-[var(--color-brand-cta)]">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge
          variant={val === 'ONLINE' ? 'healthy' : val === 'DEGRADED' ? 'warning' : 'offline'}
          text={val || 'UNKNOWN'}
          className="uppercase"
        />
      )
    },
    {
      key: 'host',
      label: 'Address',
      render: (val, row) => `${val || 'localhost'}:${row.port || 5000}`
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => <span className="uppercase text-xs font-semibold text-[var(--text-secondary)]">{val || 'PRIMARY'}</span>
    },
    {
      key: 'vnodes',
      label: 'Virtual Nodes',
      render: (_, row) => row.virtualNodes ? row.virtualNodes.length : 256
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleRemoveNode(row.id)}
          disabled={removeNodeMutation.isPending}
        >
          <Trash2 size={13} className="text-red-500 mr-1" />
          Remove
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Cache Nodes"
        description="Manage and monitor individual cache nodes. Click on a node for detailed insights."
      />
      {isLoading ? (
        <div className="p-8 text-center text-sm text-[var(--text-muted)] border border-[var(--border-color)] rounded-[var(--radius-md)]">
          Loading cache nodes from Cluster Manager...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-[var(--radius-md)] text-sm">
          Failed to fetch cluster nodes: {error.message}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={nodesList}
          searchable={true}
          pagination={false}
        />
      )}
    </div>
  );
};

export default CacheNodes;
