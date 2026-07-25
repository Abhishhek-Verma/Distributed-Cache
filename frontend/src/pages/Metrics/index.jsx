import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import { Target, Zap, ShieldCheck, HardDrive, Activity, Database, Server, AlertCircle, ExternalLink } from 'lucide-react';
import { useMetrics } from '../../hooks/useMetrics';
import config from '../../config/env';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Metrics = () => {
  const { useGetMetricsOverview, useGetMetricsRange } = useMetrics();
  const { data: overviewRes, isLoading: isOverviewLoading, isError: isOverviewError, error: overviewError } = useGetMetricsOverview();
  const { data: rangeRes, isLoading: isRangeLoading } = useGetMetricsRange();

  const metrics = overviewRes?.data || {};
  const range = rangeRes?.data || {};

  const memoryData = range.memoryUsage || [];
  const hitRatioData = range.hitRatio || [];

  if (isOverviewError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Metrics"
          description="Real-time Prometheus telemetry, memory distribution, hit ratio analysis, and embedded Grafana analytics."
        />

        <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-[var(--radius-md)] flex flex-col items-center justify-center text-center gap-3">
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-full text-red-500">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-1 max-w-md">
            <h2 className="text-sm font-semibold text-red-400">Unable to retrieve Prometheus metrics.</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {overviewError?.response?.data?.message || 'The Prometheus telemetry service is unreachable or returned an error.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metrics"
        description="Real-time Prometheus telemetry, memory distribution, hit ratio analysis, and embedded Grafana analytics."
      />

      {/* Primary Metrics Summary Grid */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
        <MetricCard
          title="Active Cluster Nodes"
          value={isOverviewLoading ? 'Loading...' : `${metrics.activeNodes ?? 0} Active (${metrics.failedNodes ?? 0} Failed)`}
          icon={<Target size={18} />}
        />
        <MetricCard
          title="Cache Hit Ratio"
          value={isOverviewLoading ? 'Loading...' : `${metrics.hitRatio ?? 0}%`}
          icon={<Activity size={18} />}
        />
        <MetricCard
          title="Cache Memory Usage"
          value={isOverviewLoading ? 'Loading...' : `${metrics.memoryMB ?? 0} MB`}
          icon={<HardDrive size={18} />}
        />
        <MetricCard
          title="Total Cached Keys"
          value={isOverviewLoading ? 'Loading...' : `${metrics.totalKeys ?? 0} Keys`}
          icon={<Database size={18} />}
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-px">
        <MetricCard
          title="Gateway Service Status"
          value={isOverviewLoading ? 'Loading...' : metrics.gatewayStatus || 'UP'}
          icon={<Server size={18} />}
        />
        <MetricCard
          title="Cluster Health State"
          value={isOverviewLoading ? 'Loading...' : metrics.clusterStatus || 'Healthy'}
          icon={<ShieldCheck size={18} />}
        />
        <MetricCard
          title="Prometheus Auto Refresh"
          value="Polling (5s)"
          icon={<Zap size={18} />}
        />
      </div>

      {/* Live Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Memory Usage Chart */}
        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Cluster Memory Usage over Time (MB)</h2>
            <span className="text-xs font-mono text-[var(--color-brand-cta)]">PromQL: sum(cache_memory_usage_bytes)</span>
          </div>
          <div className="h-48 w-full pt-2">
            {isRangeLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">Loading Prometheus query_range...</div>
            ) : memoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">No memory series data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '4px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Memory (MB)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Hit Ratio Chart */}
        <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Cache Hit Ratio over Time (%)</h2>
            <span className="text-xs font-mono text-[var(--color-brand-cta)]">PromQL: avg(cache_hit_ratio)</span>
          </div>
          <div className="h-48 w-full pt-2">
            {isRangeLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">Loading Prometheus query_range...</div>
            ) : hitRatioData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">No hit ratio series data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hitRatioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '4px', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} name="Hit Ratio (%)" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Grafana Analytics Launch Card */}
      <div className="my-6 p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-md bg-[var(--color-brand-cta)]/10 text-[var(--color-brand-cta)]">
                <Activity size={18} />
              </div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Grafana Analytics & Cluster Monitoring</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Access full Grafana dashboards, system telemetry, memory heatmaps, and real-time node throughput analysis.
            </p>
          </div>

          <a
            href="http://13.201.81.221:3001/d/5d890a18-002c-4cb2-bd48-6349efac271e/distributed-cache-cluster-monitor?orgId=1&from=now-15m&to=now&timezone=browser&refresh=5s"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-cta)] text-white font-medium text-xs rounded-[var(--radius-md)] hover:opacity-90 hover:shadow transition-all"
          >
            <span>Launch Grafana Dashboard</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Clickable Target Endpoint Box */}
        <a
          href="http://13.201.81.221:3001/d/5d890a18-002c-4cb2-bd48-6349efac271e/distributed-cache-cluster-monitor?orgId=1&from=now-15m&to=now&timezone=browser&refresh=5s"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--color-brand-cta)]/40 rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[var(--text-muted)] font-semibold shrink-0">Target URL:</span>
            <span className="underline decoration-dotted underline-offset-4 group-hover:text-[var(--color-brand-cta)] truncate">
              http://13.201.81.221:3001/d/5d890a18-002c-4cb2-bd48-6349efac271e/distributed-cache-cluster-monitor
            </span>
          </div>
          <span className="text-[10px] uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Endpoint ↗
          </span>
        </a>
      </div>
    </div>
  );
};

export default Metrics;
