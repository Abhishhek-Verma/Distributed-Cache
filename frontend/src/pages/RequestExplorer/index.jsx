import React, { useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import Badge from '../../components/common/Badge';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import { Send } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const RequestExplorer = () => {
  const [testKey, setTestKey] = useState('user:session:9481');
  const [requestsLog, setRequestsLog] = useState([
    { id: 'req-1', method: 'GET', path: '/api/v1/health', status: 200, latency: '1.1ms', node: 'gateway', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [loading, setLoading] = useState(false);

  const handleTestRequest = async (e) => {
    e.preventDefault();
    if (!testKey) return;
    setLoading(true);
    const start = performance.now();

    try {
      const res = await axiosInstance.get(`/cache/${testKey}`);
      const elapsed = (performance.now() - start).toFixed(1);
      setRequestsLog(prev => [
        {
          id: `req-${Date.now()}`,
          method: 'GET',
          path: `/api/v1/cache/${testKey}`,
          status: res.status,
          latency: `${elapsed}ms`,
          node: res.data?.primaryNode || 'cluster-node',
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    } catch (err) {
      const elapsed = (performance.now() - start).toFixed(1);
      setRequestsLog(prev => [
        {
          id: `req-${Date.now()}`,
          method: 'GET',
          path: `/api/v1/cache/${testKey}`,
          status: err.status || 404,
          latency: `${elapsed}ms`,
          node: 'gateway',
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
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

  return (
    <div className="space-y-4">
      <PageHeader
        title="Request Explorer"
        description="Live stream of HTTP requests hitting the Gateway, latency metrics, and cache routing decisions."
      />

      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Execute Gateway Test Request</h2>
        <form onSubmit={handleTestRequest} className="flex gap-2">
          <Input
            placeholder="Enter key to GET from Gateway"
            value={testKey}
            onChange={(e) => setTestKey(e.target.value)}
            fullWidth
          />
          <Button type="submit" disabled={loading} size="sm">
            <Send size={14} className="mr-1.5" />
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Live Gateway Request Stream</h2>
        <DataTable
          columns={columns}
          data={requestsLog}
          searchable={true}
          pagination={true}
          pageSize={5}
        />
      </div>
    </div>
  );
};

export default RequestExplorer;
