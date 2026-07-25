import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import { useCluster } from '../../hooks/useCluster';
import { useSettings } from '../../hooks/useSettings';

const Settings = () => {
  const { useGetClusterInfo } = useCluster();
  const { data: clusterData } = useGetClusterInfo();
  const cluster = clusterData?.data || {};

  const { useGetSettings, useUpdateSettings } = useSettings();
  const { data: settingsData, isLoading } = useGetSettings();
  const updateMutation = useUpdateSettings();

  const [gatewayUrl, setGatewayUrl] = useState('http://localhost:3000/api/v1');
  const [pollingInterval, setPollingInterval] = useState('5000');
  const [memThreshold, setMemThreshold] = useState('85');
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (settingsData?.data) {
      const s = settingsData.data;
      if (s.gatewayUrl) setGatewayUrl(s.gatewayUrl);
      if (s.pollingInterval !== undefined) setPollingInterval(String(s.pollingInterval));
      if (s.memThreshold !== undefined) setMemThreshold(String(s.memThreshold));
    }
  }, [settingsData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await updateMutation.mutateAsync({
        gatewayUrl,
        pollingInterval: parseInt(pollingInterval, 10) || 5000,
        memThreshold: parseInt(memThreshold, 10) || 85,
        replicationFactor: cluster.replicationFactor || 2,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Configure dashboard preferences, alert thresholds, and cluster connection parameters."
      />

      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Gateway Connection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Gateway Endpoint</label>
              <Input value={gatewayUrl} onChange={(e) => setGatewayUrl(e.target.value)} fullWidth disabled={isLoading} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Polling Interval (ms)</label>
              <Input type="number" value={pollingInterval} onChange={(e) => setPollingInterval(e.target.value)} fullWidth disabled={isLoading} />
            </div>
          </div>
        </div>

        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Cluster Config & Thresholds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Memory Warning Threshold (%)</label>
              <Input type="number" value={memThreshold} onChange={(e) => setMemThreshold(e.target.value)} fullWidth disabled={isLoading} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Cluster Replication Factor</label>
              <Input type="number" value={cluster.replicationFactor || 2} readOnly fullWidth />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {saved && <span className="text-xs text-emerald-500 font-medium">Settings saved successfully</span>}
            {errorMsg && <span className="text-xs text-red-500 font-medium">{errorMsg}</span>}
          </div>
          <Button type="submit" size="sm" disabled={updateMutation.isPending || isLoading}>
            {updateMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
