import React from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';

const MOCK_ENV = [
  { key: 'Application Version', value: 'v1.0.0' },
  { key: 'Backend Version', value: 'v1.2.0' },
  { key: 'Build Number', value: '#4092' },
  { key: 'Environment', value: 'Production' },
  { key: 'Cluster Uptime', value: '14d 2h 45m' },
  { key: 'Node.js Engine', value: 'v20.9.0' },
  { key: 'Architecture', value: 'x64' }
];

const COLUMNS = [
  { key: 'key', label: 'Property', render: (val) => <span className="font-medium text-[var(--text-primary)]">{val}</span> },
  {
    key: 'value',
    label: 'Value',
    render: (val) => (
      val === 'Production'
        ? <Badge variant="healthy" text={val} />
        : <span className="font-mono text-xs text-[var(--text-secondary)]">{val}</span>
    )
  }
];

const SystemInformation = () => {
  return (
    <div className="space-y-4 max-w-4xl">
      <PageHeader
        title="System Information"
        description="System and environment variables currently active across the cluster."
      />

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Environment Details</h2>
        <DataTable
          columns={COLUMNS}
          data={MOCK_ENV}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SystemInformation;
