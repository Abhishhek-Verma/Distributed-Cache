import React from 'react';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import { Target, Zap, ShieldCheck, HardDrive, Activity, Database, Server, AlertCircle } from 'lucide-react';
import { useMetrics } from '../../hooks/useMetrics';
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
          description="Real-time Prometheus telemetry, memory distribution, hit ratio analysis, and cluster analytics."
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
        description="Real-time Prometheus telemetry, memory distribution, hit ratio analysis, and cluster analytics."
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

      {/* Embedded Telemetry Status Panel */}
      <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Telemetry & Cluster Analytics</h2>
          <span className="text-xs font-mono text-emerald-400 font-semibold">● PROMETHEUS LIVE TELEMETRY</span>
        </div>
        <div className="w-full p-8 rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center text-center gap-3">
          <Activity className="w-8 h-8 text-[var(--color-brand-cta)] animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Prometheus Telemetry Stream Active</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md">
              Real-time cluster memory usage, hit ratio analytics, active nodes, and gateway telemetry are rendered securely above via Prometheus PromQL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
