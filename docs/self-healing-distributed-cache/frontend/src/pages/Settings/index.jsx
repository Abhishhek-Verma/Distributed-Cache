import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';

const Settings = () => {
  return (
    <div className="space-y-4 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Configure dashboard preferences, alert thresholds, and cluster connection parameters."
      />

      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Gateway Connection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Gateway Endpoint</label>
            <Input defaultValue="http://localhost:8080" fullWidth />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Polling Interval (ms)</label>
            <Input type="number" defaultValue="2000" fullWidth />
          </div>
        </div>
      </div>

      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Alert Thresholds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Memory Warning Threshold (%)</label>
            <Input type="number" defaultValue="85" fullWidth />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Latency Warning Threshold (ms)</label>
            <Input type="number" defaultValue="5.0" fullWidth />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
