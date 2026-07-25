import React from 'react';
import StatusCard from '../../components/cards/StatusCard';
import PageHeader from '../../components/common/PageHeader';
import { HeartPulse, CheckCircle2 } from 'lucide-react';

const Health = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Health Status"
        description="Real-time health indicators and diagnostics across all sub-systems."
      />

      <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center gap-3">
        <CheckCircle2 size={22} className="text-[var(--color-success)] shrink-0" />
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">System Fully Operational</h2>
          <p className="text-xs text-[var(--text-secondary)]">All 8 cache nodes, gateway, and consensus algorithms are operating within normal parameters.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Subsystem Health</h2>
        
        {/* Subsystem Health Cards Grid - Border-Joined Panel */}
        <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
          <StatusCard title="Gateway API" status="healthy" description="Handling request routing and load distribution smoothly." />
          <StatusCard title="Cluster Manager" status="healthy" description="Leader node active and managing cluster topology." />
          <StatusCard title="Consensus Service" status="healthy" description="Raft consensus quorum maintained without lag." />
          <StatusCard title="Storage Engine" status="healthy" description="In-memory cache storage read/write performance optimal." />
          <StatusCard title="Replication Pipeline" status="healthy" description="Syncing data across nodes with zero backlog." />
          <StatusCard title="Heartbeat Monitor" status="healthy" description="Pinging nodes every 1000ms. All responses timely." />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Recent Failures & Recovery Logs</h2>
        <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] flex flex-col items-center justify-center text-center gap-1.5 text-[var(--text-muted)]">
          <HeartPulse size={28} className="opacity-30" />
          <p className="text-xs text-[var(--text-secondary)]">No active or historical failure incidents recorded.</p>
        </div>
      </div>
    </div>
  );
};

export default Health;
