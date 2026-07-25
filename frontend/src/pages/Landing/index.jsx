import React from 'react';
import { Database, Zap, Activity, RefreshCcw, ShieldCheck, Terminal, Cpu, Layers } from 'lucide-react';

const OVERVIEW_FEATURES = [
  {
    icon: <Database size={22} />,
    title: "Consistent Hash Ring",
    description: "Virtual nodes ring architecture mapping keys across cluster nodes with minimal key movement during topology shifts."
  },
  {
    icon: <RefreshCcw size={22} />,
    title: "Automated Self-Healing",
    description: "Real-time failure detection, automatic node eviction, and transparent partition rebalancing without manual intervention."
  },
  {
    icon: <Zap size={22} />,
    title: "Sub-Millisecond Speed",
    description: "High-throughput in-memory key-value caching layer optimized for microsecond latency reads and writes."
  },
  {
    icon: <Activity size={22} />,
    title: "Cluster Telemetry",
    description: "Live node health tracking, heartbeat monitoring, and request throughput diagnostics."
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Multi-Replica Quorum",
    description: "Configurable N-replica redundancy factor guaranteeing high availability and fault tolerance."
  },
  {
    icon: <Terminal size={22} />,
    title: "Interactive Management",
    description: "Complete Web UI suite featuring Cache Explorer, Key Search, System Logs, and API Playground."
  }
];

const ARCHITECTURE_LAYERS = [
  {
    layer: "Layer 1",
    title: "API Gateway Proxy",
    icon: <Layers size={20} />,
    details: "Lightweight ingress routing client requests directly to target partition nodes based on hash key computation."
  },
  {
    layer: "Layer 2",
    title: "Distributed Cache Ring",
    icon: <Cpu size={20} />,
    details: "In-memory data store nodes operating on consistent hashing rings with automated key replication."
  },
  {
    layer: "Layer 3",
    title: "Health & Consensus Engine",
    icon: <Activity size={20} />,
    details: "Heartbeat daemon pinging nodes every 1000ms, triggering instant recovery routines upon node failure."
  }
];

const Landing = () => {
  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-20">

        {/* Main Website Purpose & 
        Intro Hero Card */}
        <div className="w-full border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-8 sm:p-14 flex flex-col items-center text-center space-y-6 shadow-[var(--shadow-sm)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--color-brand-cta)]/10 border border-[var(--color-brand-cta)]/30 rounded-[var(--radius-pill)]">
            <Database size={14} className="text-[var(--color-brand-cta)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-cta)]">
              Distributed Infrastructure Dashboard
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-[var(--text-primary)] max-w-4xl leading-tight">
            Self-Healing Distributed Cache Platform
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            CacheDash is a centralized engineering control suite designed to monitor, inspect, and manage a self-healing distributed in-memory cache cluster. It provides real-time visibility into consistent hashing ring topology, partition key distribution, node heartbeats, and automated fault-tolerant failover routines.
          </p>
        </div>

        {/* System Capabilities Section */}
        <div id="features" className="w-full pt-10 border-t border-[var(--border-color)]/60">
          <div className="text-center py-8 sm:py-12 my-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              System Capabilities & Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OVERVIEW_FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-color)] hover:border-[var(--color-brand-cta)]/50 hover:shadow-[var(--shadow-md)] transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-cta)]/10 text-[var(--color-brand-cta)] border border-[var(--color-brand-cta)]/20 group-hover:bg-[var(--color-brand-cta)] group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture Layer Section */}
        <div id="architecture" className="w-full pt-10 border-t border-[var(--border-color)]/60">
          <div className="text-center py-8 sm:py-12 my-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              System Architecture & Design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARCHITECTURE_LAYERS.map((arch, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-color)] hover:border-[var(--color-brand-cta)]/50 hover:shadow-[var(--shadow-md)] transition-all duration-200 space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--color-brand-cta)] uppercase tracking-widest px-2.5 py-1 bg-[var(--color-brand-cta)]/10 rounded-[var(--radius-sm)] border border-[var(--color-brand-cta)]/20">
                      {arch.layer}
                    </span>
                    <div className="text-[var(--text-muted)] group-hover:text-[var(--color-brand-cta)] transition-colors">{arch.icon}</div>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] pt-1">
                    {arch.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {arch.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;
