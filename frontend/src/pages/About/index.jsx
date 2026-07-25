import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Database, Shield, Zap, RefreshCw } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-4 max-w-4xl">
      <PageHeader
        title="About System"
        description="Architecture design, cluster consensus model, and technology specifications."
      />

      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-2">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Self-Healing Distributed Cache System</h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          A high-availability, fault-tolerant distributed in-memory cache system designed to handle dynamic node failures, key partition rebalancing, and consistent hashing seamlessly without service interruption.
        </p>
      </div>

      {/* Feature Cards Grid - Border-Joined Panel */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 gap-px">
        <div className="p-4 bg-[var(--bg-primary)] space-y-1.5">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[var(--color-brand-cta)] shrink-0" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">Consistent Hashing</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Uses virtual nodes ring architecture (MD5 hash space) to minimize key movement during node join and failure events.
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-primary)] space-y-1.5">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-[var(--color-brand-cta)] shrink-0" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">Automated Self-Healing</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Detects missed heartbeats, marks unhealthy nodes, and triggers automatic background partition redistribution.
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-primary)] space-y-1.5">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[var(--color-brand-cta)] shrink-0" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">Replication & Quorum</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Configurable N-replica redundancy ensures high availability and zero data loss on primary node crashes.
          </p>
        </div>

        <div className="p-4 bg-[var(--bg-primary)] space-y-1.5">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[var(--color-brand-cta)] shrink-0" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">Sub-millisecond Routing</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Lightweight API Gateway routes client requests directly to target partitions with sub-1ms routing overhead.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
