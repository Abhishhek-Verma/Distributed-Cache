import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import MetricCard from '../../components/cards/MetricCard';
import { Heart, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const MOCK_HEARTBEATS = [
  { id: 'hb-node-01', node: 'node-01', status: 'alive', lastPing: '120ms ago', interval: '1000ms', missedPings: 0 },
  { id: 'hb-node-02', node: 'node-02', status: 'alive', lastPing: '450ms ago', interval: '1000ms', missedPings: 0 },
  { id: 'hb-node-03', node: 'node-03', status: 'degraded', lastPing: '890ms ago', interval: '1000ms', missedPings: 1 },
  { id: 'hb-node-04', node: 'node-04', status: 'dead', lastPing: '14,200ms ago', interval: '1000ms', missedPings: 14 }
];

const COLUMNS = [
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
  { key: 'lastPing', label: 'Last Heartbeat' },
  { key: 'interval', label: 'Expected Interval' },
  { key: 'missedPings', label: 'Missed Intervals' }
];

const Heartbeat = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Heartbeat Monitor"
        description="Node health heartbeats, failure detection intervals, and pulse response times."
      />

      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard title="Monitored Nodes" value="4" icon={<Heart size={18} />} />
        <MetricCard title="Heartbeat Rate" value="1.0/s" icon={<Activity size={18} />} />
        <MetricCard title="Quorum Status" value="Healthy" icon={<ShieldCheck size={18} />} />
        <MetricCard title="Missed Pulses" value="15" icon={<AlertTriangle size={18} />} trend={12} trendDirection="up" />
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Node Pulse Status</h2>
        <DataTable
          columns={COLUMNS}
          data={MOCK_HEARTBEATS}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Heartbeat;
