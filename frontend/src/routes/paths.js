// -------------------------------------------------------------------
// Centralised route definitions
// Architecture.md section 14 — Routing Architecture
// Architecture.md section 16 — Folder Structure / routes/
// Route hierarchy matches Architecture.md section 14 / PRD.md section 12
// -------------------------------------------------------------------

export const ROUTES = {
  HOME: '/',
  FEATURES: '/features',
  ARCHITECTURE: '/architecture',
  API_PREVIEW: '/api-preview',
  DASHBOARD: '/dashboard',
  CLUSTER_OVERVIEW: '/dashboard/cluster',
  CACHE_NODES: '/dashboard/nodes',
  CACHE_EXPLORER: '/dashboard/cache',
  METRICS: '/dashboard/metrics',
  MONITORING: '/dashboard/monitoring',
  HEALTH: '/dashboard/health',
  REPLICATION: '/dashboard/replication',
  HEARTBEAT: '/dashboard/heartbeat',
  REBALANCING: '/dashboard/rebalancing',
  REQUEST_EXPLORER: '/dashboard/requests',
  LOGS: '/dashboard/logs',
  API_PLAYGROUND: '/dashboard/api-playground',
  SETTINGS: '/dashboard/settings',
  SYSTEM_INFO: '/dashboard/system',
  ABOUT: '/dashboard/about',
  NOT_FOUND: '*',
};

export default ROUTES;
