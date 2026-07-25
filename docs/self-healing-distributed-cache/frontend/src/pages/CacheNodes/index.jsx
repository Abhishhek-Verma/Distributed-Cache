import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import { Database, HardDrive, Zap, Clock } from 'lucide-react';

const MOCK_NODES = [
  { id: 'node-01', host: '192.168.1.101:5001', status: 'healthy', memory: '512 MB', keys: 1450, reqs: 320, uptime: '14d 2h' },
  { id: 'node-02', host: '192.168.1.102:5002', status: 'healthy', memory: '640 MB', keys: 1620, reqs: 380, uptime: '14d 2h' },
  { id: 'node-03', host: '192.168.1.103:5003', status: 'warning', memory: '980 MB', keys: 2100, reqs: 450, uptime: '12d 5h' },
  { id: 'node-04', host: '192.168.1.104:5004', status: 'offline', memory: '0 MB', keys: 0, reqs: 0, uptime: '0s' },
];

const COLUMNS = [
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
        variant={val === 'healthy' ? 'healthy' : val === 'warning' ? 'warning' : 'offline'}
        text={val}
        className="uppercase"
      />
    )
  },
  { key: 'host', label: 'Address' },
  {
    key: 'memory',
    label: 'Memory',
    sortable: true,
    render: (val) => (
      <div className="flex items-center text-[var(--text-secondary)]">
        <HardDrive size={14} className="mr-1.5" />
        {val}
      </div>
    )
  },
  {
    key: 'keys',
    label: 'Cache Keys',
    sortable: true,
    render: (val) => (
      <div className="flex items-center text-[var(--text-secondary)]">
        <Database size={14} className="mr-1.5" />
        {val}
      </div>
    )
  },
  {
    key: 'reqs',
    label: 'Req/sec',
    sortable: true,
    render: (val) => (
      <div className="flex items-center text-[var(--text-secondary)]">
        <Zap size={14} className="mr-1.5" />
        {val}
      </div>
    )
  },
  {
    key: 'uptime',
    label: 'Uptime',
    render: (val) => (
      <div className="flex items-center text-[var(--text-secondary)]">
        <Clock size={14} className="mr-1.5" />
        {val}
      </div>
    )
  }
];

const CacheNodes = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Cache Nodes"
        description="Manage and monitor individual cache nodes. Click on a node for detailed insights."
      />
      <DataTable
        columns={COLUMNS}
        data={MOCK_NODES}
        searchable={true}
        pagination={false}
      />
    </div>
  );
};

export default CacheNodes;
