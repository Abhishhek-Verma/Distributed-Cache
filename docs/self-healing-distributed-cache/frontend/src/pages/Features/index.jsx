import React from 'react';
import { Database, Zap, Activity, RefreshCcw, ShieldCheck, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';

const ALL_FEATURES = [
  {
    icon: <Database size={24} />,
    title: "Consistent Hash Ring",
    badge: "Core Topology",
    description: "Virtual nodes ring architecture mapping keys across cluster nodes with minimal key movement during topology shifts.",
    details: ["256 Virtual Nodes per Physical Node", "MD5 / Murmur3 Hash Algorithm Support", "Zero-downtime Ring Expansion & Contraction"]
  },
  {
    icon: <RefreshCcw size={24} />,
    title: "Automated Self-Healing",
    badge: "Fault Tolerance",
    description: "Real-time failure detection, automatic node eviction, and transparent partition rebalancing without manual intervention.",
    details: ["1000ms Heartbeat Timeout Eviction", "Automatic Hot-Standby Promotion", "Background Key Re-replication"]
  },
  {
    icon: <Zap size={24} />,
    title: "Sub-Millisecond Speed",
    description: "High-throughput in-memory key-value caching layer optimized for microsecond latency reads and writes.",
    details: ["Microsecond Read Latency (< 0.8ms)", "Non-blocking Concurrent I/O Engine", "In-Memory LRU Eviction Policy"]
  },
  {
    icon: <Activity size={24} />,
    title: "Cluster Telemetry",
    badge: "Observability",
    description: "Live node health tracking, heartbeat monitoring, and request throughput diagnostics with live metrics streaming.",
    details: ["Real-time Operations per Second (OPS)", "Node Memory & CPU Allocation Graphs", "Cluster Replication Status Badges"]
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Multi-Replica Quorum",
    badge: "Data Integrity",
    description: "Configurable N-replica redundancy factor guaranteeing high availability, quorum reads, and fault tolerance.",
    details: ["Configurable Replica Factor (R=2, R=3)", "Quorum Read / Write Consistency", "Automatic Conflict Resolution Engine"]
  },
  {
    icon: <Terminal size={24} />,
    title: "Interactive Management Suite",
    badge: "Control Center",
    description: "Complete Web UI suite featuring Cache Explorer, Key Search, System Logs, and API Playground.",
    details: ["Live Key-Value Explorer & TTL Setter", "Interactive REST API Playground", "Real-time System Logs Streaming"]
  }
];

const FeaturesPage = () => {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="w-full border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-8 sm:p-12 text-center space-y-4 shadow-[var(--shadow-sm)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--color-brand-cta)]/10 border border-[var(--color-brand-cta)]/30 rounded-[var(--radius-pill)]">
            <Zap size={14} className="text-[var(--color-brand-cta)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-cta)]">
              Platform Features Deep Dive
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
            System Capabilities & Infrastructure Features
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Explore the comprehensive feature set powering the Self-Healing Distributed Cache Platform, designed for high throughput, sub-millisecond latency, and automated failure recovery.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {ALL_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="p-7 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-color)] hover:border-[var(--color-brand-cta)]/50 hover:shadow-[var(--shadow-md)] transition-all duration-200 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-cta)]/10 text-[var(--color-brand-cta)] border border-[var(--color-brand-cta)]/20 group-hover:bg-[var(--color-brand-cta)] group-hover:text-white transition-colors">
                    {feat.icon}
                  </div>
                  {feat.badge && (
                    <span className="text-[10px] font-bold text-[var(--color-brand-cta)] uppercase tracking-widest px-2.5 py-1 bg-[var(--color-brand-cta)]/10 rounded-[var(--radius-sm)] border border-[var(--color-brand-cta)]/20">
                      {feat.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] pt-1">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feat.description}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)]/60 space-y-2">
                  {feat.details.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 size={13} className="text-[var(--color-brand-cta)] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand-cta)] hover:underline"
                >
                  <span>Explore in Dashboard</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FeaturesPage;
