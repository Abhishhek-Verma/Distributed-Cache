import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';

const MOCK_REQUESTS = [
  { id: 'req-901', method: 'GET', path: '/api/v1/cache/user:session:9481', status: 200, latency: '0.8ms', node: 'node-01', timestamp: '10:42:01.120' },
  { id: 'req-902', method: 'SET', path: '/api/v1/cache/rate:ip:192.168.1.1', status: 201, latency: '1.4ms', node: 'node-03', timestamp: '10:42:01.145' },
  { id: 'req-903', method: 'GET', path: '/api/v1/cache/missing:key', status: 404, latency: '0.4ms', node: 'node-02', timestamp: '10:42:01.198' },
  { id: 'req-904', method: 'DELETE', path: '/api/v1/cache/auth:token:a8f91c', status: 200, latency: '1.1ms', node: 'node-01', timestamp: '10:42:01.210' },
  { id: 'req-905', method: 'GET', path: '/api/v1/cache/product:cat:tech', status: 200, latency: '0.9ms', node: 'node-02', timestamp: '10:42:01.250' }
];

const COLUMNS = [
  { key: 'timestamp', label: 'Timestamp', render: (val) => <span className="font-mono text-xs text-[var(--text-secondary)]">{val}</span> },
  {
    key: 'method',
    label: 'Method',
    render: (val) => (
      <span className={`font-mono text-xs font-bold ${
        val === 'GET' ? 'text-blue-500' : val === 'SET' ? 'text-green-500' : 'text-red-500'
      }`}>
        {val}
      </span>
    )
  },
  { key: 'path', label: 'Path / Key', render: (val) => <span className="font-mono text-xs font-medium text-[var(--text-primary)]">{val}</span> },
  {
    key: 'status',
    label: 'HTTP',
    render: (val) => (
      <Badge
        variant={val < 300 ? 'healthy' : val === 404 ? 'warning' : 'error'}
        text={String(val)}
      />
    )
  },
  { key: 'latency', label: 'Latency' },
  { key: 'node', label: 'Routed Node', render: (val) => <Badge variant="secondary" text={val} /> }
];

const RequestExplorer = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Request Explorer"
        description="Live stream of HTTP requests hitting the Gateway, latency metrics, and cache routing decisions."
      />

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Live Gateway Request Stream</h2>
        <DataTable
          columns={COLUMNS}
          data={MOCK_REQUESTS}
          searchable={true}
          pagination={true}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default RequestExplorer;
