import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/paths';
import { useAppContext } from '../../../contexts/AppContext';
import {
  LayoutDashboard,
  Network,
  Database,
  Search,
  Activity,
  BarChart2,
  HeartPulse,
  GitBranch,
  Heart,
  RefreshCcw,
  ListFilter,
  ScrollText,
  Code2,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from '../../utility/ThemeToggle';

const NAV_ITEMS = [
  { group: 'Overview' },
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.CLUSTER_OVERVIEW, label: 'Cluster Overview', icon: Network },

  { group: 'Cache Management' },
  { path: ROUTES.CACHE_NODES, label: 'Cache Nodes', icon: Database },
  { path: ROUTES.CACHE_EXPLORER, label: 'Cache Explorer', icon: Search },

  { group: 'Observability' },
  { path: ROUTES.METRICS, label: 'Metrics', icon: Activity },
  { path: ROUTES.MONITORING, label: 'Monitoring', icon: BarChart2 },
  { path: ROUTES.HEALTH, label: 'Health Status', icon: HeartPulse },

  { group: 'Cluster Ops' },
  { path: ROUTES.REPLICATION, label: 'Replication', icon: GitBranch },
  { path: ROUTES.HEARTBEAT, label: 'Heartbeat', icon: Heart },
  { path: ROUTES.REBALANCING, label: 'Rebalancing', icon: RefreshCcw },

  { group: 'Diagnostics' },
  { path: ROUTES.REQUEST_EXPLORER, label: 'Request Explorer', icon: ListFilter },
  { path: ROUTES.LOGS, label: 'System Logs', icon: ScrollText },
  { path: ROUTES.API_PLAYGROUND, label: 'API Playground', icon: Code2 },

  { group: 'System' },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  { path: ROUTES.ABOUT, label: 'About', icon: Info },
];

const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppContext();

  return (
    <aside
      className={`
        flex flex-col h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
        transition-all duration-[var(--duration-nav)] z-40
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Brand / Logo + Toggle — always in header row, always same position */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center overflow-hidden whitespace-nowrap min-w-0">
          <Database className="text-[var(--color-brand-cta)] shrink-0" size={20} />
          {!sidebarCollapsed && (
            <span className="ml-2.5 font-display font-semibold text-base text-[var(--text-primary)] truncate">
              CacheDash
            </span>
          )}
        </div>
        {/* Toggle always rendered at top-right; icon flips based on state */}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] shrink-0 ml-1"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-4 custom-scrollbar">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item, index) => {
            if (item.group) {
              if (sidebarCollapsed) {
                return <li key={index} className="my-3 border-t border-[var(--border-color)]" />;
              }
              return (
                <li
                  key={index}
                  className="px-2 pt-3 pb-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider"
                >
                  {item.group}
                </li>
              );
            }

            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-2 py-2 rounded-[var(--radius-sm)] transition-colors
                    ${isActive
                      ? 'bg-[var(--color-brand-cta)]/10 text-[var(--color-brand-cta)] font-medium'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                    }
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="ml-2.5 truncate text-sm">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Theme Toggle */}
      <div
        className={`px-3 py-3 border-t border-[var(--border-color)] flex items-center shrink-0 ${
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        {!sidebarCollapsed && (
          <span className="text-sm font-medium text-[var(--text-secondary)]">Theme</span>
        )}
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
