import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/forms/Input';
import Badge from '../../components/common/Badge';
import { Send, Play } from 'lucide-react';

const APIPlayground = () => {
  const [method, setMethod] = useState('GET');
  const [key, setKey] = useState('user:session:9481');
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (method === 'GET') {
        setResponse({
          status: 200,
          statusText: 'OK',
          time: '0.8ms',
          routedNode: 'node-01',
          data: { key, value: '{"id": 9481, "role": "admin"}', ttl: '3540s' }
        });
      } else if (method === 'SET') {
        setResponse({
          status: 201,
          statusText: 'Created',
          time: '1.4ms',
          routedNode: 'node-03',
          data: { success: true, key, message: 'Key saved with replication factor 2' }
        });
      } else {
        setResponse({
          status: 200,
          statusText: 'OK',
          time: '1.1ms',
          routedNode: 'node-01',
          data: { success: true, key, message: 'Key deleted across all partition replicas' }
        });
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="API Playground"
        description="Test Gateway REST API endpoints directly against the distributed cache cluster."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request Panel */}
        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-4">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Request Builder</h2>

          <form onSubmit={handleExecute} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">HTTP Method</label>
              <div className="flex gap-2">
                {['GET', 'SET', 'DELETE'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border transition-colors ${
                      method === m
                        ? 'bg-[var(--color-brand-cta)] text-white border-[var(--color-brand-cta)]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Cache Key</label>
              <Input
                placeholder="e.g. user:session:100"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                fullWidth
              />
            </div>

            {method === 'SET' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Value (String or JSON)</label>
                  <Input
                    placeholder='e.g. {"name": "Alice"}'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">TTL (seconds, optional)</label>
                  <Input
                    type="number"
                    placeholder="3600"
                    value={ttl}
                    onChange={(e) => setTtl(e.target.value)}
                    fullWidth
                  />
                </div>
              </>
            )}

            <Button type="submit" disabled={loading} size="sm">
              <Play size={14} className="mr-1.5" />
              {loading ? 'Executing...' : 'Send Request'}
            </Button>
          </form>
        </div>

        {/* Response Panel */}
        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Response Output</h2>
            {response && (
              <div className="flex items-center gap-2">
                <Badge variant={response.status < 300 ? 'healthy' : 'error'} text={`${response.status} ${response.statusText}`} />
                <span className="text-xs font-mono text-[var(--text-secondary)]">{response.time}</span>
              </div>
            )}
          </div>

          {response ? (
            <div className="space-y-2">
              <div className="text-xs text-[var(--text-secondary)] flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span>Routed Node: <strong className="text-[var(--color-brand-cta)]">{response.routedNode}</strong></span>
              </div>
              <pre className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-sm)] font-mono text-xs text-[var(--text-primary)] overflow-x-auto">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-[var(--radius-sm)]">
              <Send size={24} className="opacity-30" />
              <p className="text-xs text-[var(--text-secondary)]">Click 'Send Request' to view Gateway response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIPlayground;
