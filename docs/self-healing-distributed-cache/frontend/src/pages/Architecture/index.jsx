import React, { useState } from 'react';
import { Layers, Cpu, Activity, GitBranch, Image as ImageIcon, ZoomIn, X, Maximize2 } from 'lucide-react';

const ARCHITECTURE_DIAGRAMS = [
  {
    id: 'architecture-overview',
    title: 'High-Level System Architecture',
    badge: 'System Architecture',
    description: 'Comprehensive end-to-end architecture showing client ingress, API gateway proxy, distributed hash ring nodes, and consensus health engine.',
    imagePath: '/architecture/Architecture.png'
  },
  {
    id: 'consistent-hashing-ring',
    title: 'Consistent Hashing Ring Topology',
    badge: 'Ring Topology',
    description: 'Virtual nodes ring distribution mapping key hash values evenly across physical cluster peers with zero-downtime scaling.',
    imagePath: '/architecture/Consistent_hashing_Ring.png'
  },
  {
    id: 'request-flow',
    title: 'Client Request & Ingress Routing Flow',
    badge: 'Request Flow',
    description: 'Client request routing path from Gateway Proxy hash calculation to target node GET/SET execution.',
    imagePath: '/architecture/Request_flow.png'
  },
  {
    id: 'heartbeat-failure',
    title: 'Heartbeat Monitoring & Failure Detection',
    badge: 'Health Monitoring',
    description: 'Continuous 1000ms daemon pinging sequence, heartbeat miss counter threshold, and node state transitions.',
    imagePath: '/architecture/Heartbeat_and_failure_flow.png'
  },
  {
    id: 'self-healing-recovery',
    title: 'Self-Healing Failover & Recovery Protocol',
    badge: 'Self-Healing',
    description: 'Automated dead node eviction, topology ring recalculation, and partition key re-replication sequence.',
    imagePath: '/architecture/Self_healing_recovery_flow.png'
  },
  {
    id: 'cluster-rebalance',
    title: 'Cluster Partition Rebalancing',
    badge: 'Rebalancing',
    description: 'Dynamic partition keys rebalancing across remaining nodes with minimal key movement during topology shifts.',
    imagePath: '/architecture/Cluster_rebalance.png'
  },
  {
    id: 'replication-flow',
    title: 'Multi-Replica Data Sync & Quorum Flow',
    badge: 'Replication',
    description: 'N-replica asynchronous background sync flow ensuring fault-tolerant data redundancy across peer nodes.',
    imagePath: '/architecture/Replication_flow.png'
  }
];

const ARCH_SECTIONS = [
  {
    layer: "Layer 1: Gateway Proxy Ingress",
    icon: <Layers size={24} />,
    title: "Lightweight Request Router",
    description: "Accepts incoming client GET/SET/DELETE commands, computes key hash ring placement using consistent hashing, and forwards requests to the correct cluster node with sub-millisecond overhead.",
    specs: [
      "Zero-copy socket I/O proxying",
      "Consistent Hash Ring key mapping",
      "Automatic failover redirect on node down"
    ]
  },
  {
    layer: "Layer 2: Distributed Cache Cluster",
    icon: <Cpu size={24} />,
    title: "In-Memory Storage Shards",
    description: "High-performance node network maintaining key-value storage shards. Implements configurable replica factors (N=2, N=3) across physical nodes for instant redundancy.",
    specs: [
      "Concurrent LRU key eviction",
      "Virtual Node Ring distribution (256 vnodes)",
      "Background asynchronous replica syncing"
    ]
  },
  {
    layer: "Layer 3: Consensus & Health Engine",
    icon: <Activity size={24} />,
    title: "Self-Healing Recovery Daemon",
    description: "Continuously probes physical node status every 1000ms. Upon detecting a dead node, triggers partition re-replication and updates cluster ring topology within seconds.",
    specs: [
      "1000ms Heartbeat Ping Intervals",
      "Automatic Node Eviction Protocol",
      "Ring Rebalance & Key Redistribution"
    ]
  }
];

const ArchitecturePage = () => {
  const [modalImg, setModalImg] = useState(null);

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto space-y-16">
        
        {/* Page Header */}
        <div className="w-full border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-8 sm:p-14 text-center space-y-5 shadow-[var(--shadow-sm)] flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[var(--color-brand-cta)]/10 border border-[var(--color-brand-cta)]/30 rounded-[var(--radius-pill)]">
            <GitBranch size={14} className="text-[var(--color-brand-cta)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-cta)]">
              Topology & System Architecture
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-[var(--text-primary)] text-center leading-tight">
            Distributed Architecture & Technical Diagrams
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed text-center">
            Detailed visual diagrams and architectural specifications explaining request routing, consistent hashing, heartbeat failover, and automated self-healing routines.
          </p>
        </div>

        {/* Architecture Diagrams Gallery */}
        <div className="w-full space-y-8">
          <div className="w-full border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-[var(--shadow-sm)]">
            <h2 className="text-xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center justify-center gap-3">
              <ImageIcon size={26} className="text-[var(--color-brand-cta)]" />
              <span>Architecture Diagrams & Flowcharts ({ARCHITECTURE_DIAGRAMS.length})</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center max-w-xl leading-relaxed">
              Click any diagram to expand into high-resolution view.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {ARCHITECTURE_DIAGRAMS.map((diagram) => (
              <div
                key={diagram.id}
                onClick={() => setModalImg(diagram)}
                className="p-6 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-color)] hover:border-[var(--color-brand-cta)]/60 hover:shadow-[var(--shadow-md)] transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[var(--color-brand-cta)] uppercase tracking-widest px-2.5 py-1 bg-[var(--color-brand-cta)]/10 rounded-[var(--radius-sm)] border border-[var(--color-brand-cta)]/20">
                      {diagram.badge}
                    </span>
                    <div className="p-1 text-[var(--text-muted)] group-hover:text-[var(--color-brand-cta)] transition-colors">
                      <Maximize2 size={15} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--color-brand-cta)] transition-colors">
                    {diagram.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    {diagram.description}
                  </p>

                  {/* Diagram Preview Image Box */}
                  <div className="relative w-full h-52 bg-[var(--bg-secondary)] rounded-[var(--radius-md)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center p-2 group-hover:border-[var(--color-brand-cta)]/40 transition-colors">
                    <img
                      src={diagram.imagePath}
                      alt={diagram.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <ZoomIn size={14} />
                        <span>Click to Expand</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer-by-Layer Specifications */}
        <div className="w-full space-y-8 pt-12 border-t border-[var(--border-color)]/60">
          <div className="w-full border border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-[var(--shadow-sm)]">
            <h2 className="text-xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Layer-by-Layer System Specification
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] text-center max-w-xl leading-relaxed">
              In-depth architectural layer capabilities, ingress proxy sharding, and consensus rules.
            </p>
          </div>

          <div className="space-y-6 w-full">
            {ARCH_SECTIONS.map((sec, idx) => (
              <div
                key={idx}
                className="p-8 bg-[var(--bg-primary)] rounded-[var(--radius-md)] border border-[var(--border-color)] hover:border-[var(--color-brand-cta)]/50 transition-all duration-200 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start group w-full"
              >
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-cta)]/10 text-[var(--color-brand-cta)] border border-[var(--color-brand-cta)]/20 group-hover:bg-[var(--color-brand-cta)] group-hover:text-white transition-colors">
                      {sec.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[var(--color-brand-cta)] uppercase tracking-widest px-2 py-0.5 bg-[var(--color-brand-cta)]/10 rounded-[var(--radius-sm)] border border-[var(--color-brand-cta)]/20">
                        {sec.layer}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] pt-1">
                        {sec.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="p-5 bg-[var(--bg-secondary)] rounded-[var(--radius-md)] border border-[var(--border-color)] space-y-2">
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Technical Specifications
                  </h4>
                  <ul className="space-y-1.5 pt-1">
                    {sec.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-cta)]"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* High Resolution Image Modal / Lightbox */}
      {modalImg && (
        <div
          onClick={() => setModalImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm p-4 sm:p-8 flex flex-col items-center justify-center animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[90vh] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-6 flex flex-col space-y-4 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <span className="text-[10px] font-bold text-[var(--color-brand-cta)] uppercase tracking-widest px-2.5 py-0.5 bg-[var(--color-brand-cta)]/10 rounded-[var(--radius-sm)] border border-[var(--color-brand-cta)]/20">
                  {modalImg.badge}
                </span>
                <h2 className="text-xl font-bold text-[var(--text-primary)] pt-1">
                  {modalImg.title}
                </h2>
              </div>
              <button
                onClick={() => setModalImg(null)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image Box */}
            <div className="flex-1 overflow-auto bg-[var(--bg-primary)] p-4 rounded-[var(--radius-md)] border border-[var(--border-color)] flex items-center justify-center">
              <img
                src={modalImg.imagePath}
                alt={modalImg.title}
                className="max-w-full max-h-[70vh] object-contain rounded-[var(--radius-sm)]"
              />
            </div>

            {/* Modal Footer Description */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed text-center">
              {modalImg.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitecturePage;
