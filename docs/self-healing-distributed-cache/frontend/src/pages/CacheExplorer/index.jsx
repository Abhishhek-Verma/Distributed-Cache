import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';

const MOCK_KEYS = [
  { key: 'user:session:9481', value: '{"id": 9481, "role": "admin"}', ttl: '3540s', node: 'node-01', size: '128 B' },
  { key: 'product:cat:tech', value: '[{"id": 1, "name": "Cache Node"}]', ttl: '86400s', node: 'node-02', size: '2.4 KB' },
  { key: 'rate:ip:192.168.1.1', value: '45', ttl: '12s', node: 'node-03', size: '8 B' },
  { key: 'auth:token:a8f91c', value: 'ey...78', ttl: '1240s', node: 'node-01', size: '256 B' },
  { key: 'config:cluster:global', value: '{"replica": 2}', ttl: 'Infinity', node: 'node-02', size: '64 B' }
];

const COLUMNS = [
  { key: 'key', label: 'Key', searchable: true, render: (val) => <span className="font-mono text-sm font-medium text-[var(--color-brand-cta)]">{val}</span> },
  { key: 'value', label: 'Value Preview', render: (val) => <span className="font-mono text-xs text-[var(--text-secondary)] truncate max-w-xs block">{val}</span> },
  { key: 'ttl', label: 'TTL' },
  { key: 'node', label: 'Assigned Node', render: (val) => <Badge variant="secondary" text={val} /> },
  { key: 'size', label: 'Size' }
];

const CacheExplorer = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Cache Explorer"
        description="Inspect key-value pairs stored across cluster partitions, check TTLs, and view memory distribution."
      />

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Cluster Key Store</h2>
        <DataTable
          columns={COLUMNS}
          data={MOCK_KEYS}
          searchable={true}
          pagination={true}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default CacheExplorer;
