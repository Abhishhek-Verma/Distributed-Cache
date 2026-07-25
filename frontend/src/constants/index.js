// Application-wide constants
// Naming: UPPER_SNAKE_CASE per DeveloperGuide.md section 26

// -------------------------------------------------------------------
// API
// -------------------------------------------------------------------
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
export const DEFAULT_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000;

// -------------------------------------------------------------------
// App
// -------------------------------------------------------------------
export const APP_NAME = 'Self-Healing Distributed Cache';
export const APP_VERSION = '1.0.0';

// -------------------------------------------------------------------
// Local Storage Keys — per Memory.md section 8
// -------------------------------------------------------------------
export const LS_THEME = 'theme';
export const LS_SIDEBAR_COLLAPSED = 'sidebarCollapsed';
export const LS_REFRESH_INTERVAL = 'refreshInterval';
export const LS_CHART_PREFERENCE = 'chartPreference';
export const LS_TABLE_COLUMNS = 'tableColumns';

// -------------------------------------------------------------------
// Session Storage Keys — per Memory.md section 8
// -------------------------------------------------------------------
export const SS_LAST_PAGE = 'lastVisitedPage';
export const SS_SELECTED_NODE = 'selectedNode';
export const SS_CACHE_SEARCH = 'cacheSearch';
export const SS_ACTIVE_FILTERS = 'activeFilters';

// -------------------------------------------------------------------
// Polling Intervals (ms) — per StateManagement.md section 12
// -------------------------------------------------------------------
export const POLL_DASHBOARD = 30_000;
export const POLL_MONITORING = 30_000;
export const POLL_HEALTH = 30_000;
export const POLL_HEARTBEAT = 15_000;
export const POLL_REPLICATION = 30_000;
export const POLL_LOGS = 15_000;

// -------------------------------------------------------------------
// React Query — per Memory.md section 9
// -------------------------------------------------------------------
export const RQ_STALE_TIME = 5_000;
export const RQ_GC_TIME = 5 * 60 * 1_000;
export const RQ_RETRY = 3;

// -------------------------------------------------------------------
// Default Refresh Interval options for Settings
// -------------------------------------------------------------------
export const REFRESH_INTERVALS = [
  { label: '10 seconds', value: 10_000 },
  { label: '30 seconds', value: 30_000 },
  { label: '1 minute', value: 60_000 },
  { label: '5 minutes', value: 300_000 },
  { label: 'Manual', value: 0 },
];

export const DEFAULT_REFRESH_INTERVAL = 30_000;
