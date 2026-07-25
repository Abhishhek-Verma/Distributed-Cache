import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/cache/:key",
    description: "Fetch cached value for specified key via Consistent Hash Gateway Proxy.",
    sampleRequest: "curl -X GET http://localhost:8080/api/v1/cache/user_1092",
    sampleResponse: `{\n  "status": "HIT",\n  "key": "user_1092",\n  "value": { "id": 1092, "name": "Alex Vance", "role": "admin" },\n  "node": "cache-node-02",\n  "ttl_seconds": 3600,\n  "latency_ms": 0.42\n}`
  },
  {
    method: "POST",
    path: "/api/v1/cache",
    description: "Store a new key-value pair into the distributed hash ring with TTL.",
    sampleRequest: `curl -X POST http://localhost:8080/api/v1/cache \\\n  -H "Content-Type: application/json" \\\n  -d '{"key": "session_88", "value": "active", "ttl": 1800}'`,
    sampleResponse: `{\n  "status": "SUCCESS",\n  "key": "session_88",\n  "partition_hash": "0x8f4a12",\n  "primary_node": "cache-node-01",\n  "replica_nodes": ["cache-node-03"]\n}`
  },
  {
    method: "DELETE",
    path: "/api/v1/cache/:key",
    description: "Invalidate and delete key across primary and replica cluster nodes.",
    sampleRequest: "curl -X DELETE http://localhost:8080/api/v1/cache/session_88",
    sampleResponse: `{\n  "status": "DELETED",\n  "key": "session_88",\n  "nodes_invalidated": 2\n}`
  },
  {
    method: "GET",
    path: "/api/v1/cluster/health",
    description: "Retrieve real-time cluster health summary, node counts, and ring state.",
    sampleRequest: "curl -X GET http://localhost:8080/api/v1/cluster/health",
    sampleResponse: `{\n  "cluster_status": "HEALTHY",\n  "total_nodes": 4,\n  "active_nodes": 4,\n  "replication_factor": 2,\n  "virtual_nodes_per_peer": 256\n}`
  }
];

const ApiPreviewPage = () => {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyCode = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="w-full border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-8 sm:p-12 text-center space-y-4 shadow-[var(--shadow-sm)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--color-brand-cta)]/10 border border-[var(--color-brand-cta)]/30 rounded-[var(--radius-pill)]">
            <Terminal size={14} className="text-[var(--color-brand-cta)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-cta)]">
              Developer API Documentation
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
            REST Gateway API Preview
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            High-performance HTTP REST endpoints exposed by the API Gateway Proxy for key-value CRUD operations and cluster diagnostics.
          </p>
        </div>

        {/* API Endpoints List */}
        <div className="space-y-6 w-full">
          {ENDPOINTS.map((ep, idx) => (
            <div
              key={idx}
              className="p-7 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-color)] space-y-4 w-full"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-[var(--radius-sm)] ${
                    ep.method === 'GET' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono font-bold text-[var(--text-primary)]">
                    {ep.path}
                  </code>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {ep.description}
                </p>
              </div>

              {/* Code Snippets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                {/* Request */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    <span>Sample Request</span>
                    <button
                      onClick={() => copyCode(ep.sampleRequest, `req-${idx}`)}
                      className="inline-flex items-center gap-1 text-[11px] text-[var(--color-brand-cta)] hover:underline"
                    >
                      {copiedIdx === `req-${idx}` ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedIdx === `req-${idx}` ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] overflow-x-auto">
                    {ep.sampleRequest}
                  </pre>
                </div>

                {/* Response */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    <span>JSON Response</span>
                  </div>
                  <pre className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)] border border-[var(--border-color)] text-xs font-mono text-emerald-500 dark:text-emerald-400 overflow-x-auto">
                    {ep.sampleResponse}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ApiPreviewPage;
