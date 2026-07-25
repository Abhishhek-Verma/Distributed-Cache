import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/cards/MetricCard';
import { GitBranch, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const MOCK_REPLICAS = [
  { id: 'rep-01', primary: 'node-01', replica: 'node-02', status: 'synced', lag: '0ms', keys: 1450 },
  { id: 'rep-02', primary: 'node-02', replica: 'node-03', status: 'synced', lag: '2ms', keys: 1620 },
  { id: 'rep-03', primary: 'node-03', replica: 'node-04', status: 'syncing', lag: '45ms', keys: 2100 },
  { id: 'rep-04', primary: 'node-04', replica: 'node-01', status: 'synced', lag: '1ms', keys: 0 }
];

const COLUMNS = [
  { key: 'id', label: 'Replication ID', render: (val) => <span className="font-medium text-[var(--color-brand-cta)]">{val}</span> },
  { key: 'primary', label: 'Primary Node' },
  { key: 'replica', label: 'Replica Node' },
  {
    key: 'status',
    label: 'Sync Status',
    render: (val) => (
      <Badge
        variant={val === 'synced' ? 'healthy' : 'warning'}
        text={val}
        className="uppercase"
      />
    )
  },
  { key: 'lag', label: 'Replication Lag' },
  { key: 'keys', label: 'Replicated Keys' }
];

const Replication = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Replication"
        description="Monitor data replication status, sync lag, and replica pairs across nodes."
      />

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Replication Pairs" value="4" icon={<GitBranch size={18} />} />
        <MetricCard title="Avg Sync Lag" value="12ms" icon={<Clock size={18} />} trend={1.5} trendDirection="down" />
        <MetricCard title="Sync Success Rate" value="99.9%" icon={<CheckCircle size={18} />} trend={0.1} trendDirection="up" />
        <MetricCard title="Pending Sync Ops" value="14" icon={<RefreshCw size={18} />} />
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Replica Pair Status</h2>
        <DataTable
          columns={COLUMNS}
          data={MOCK_REPLICAS}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Replication;
