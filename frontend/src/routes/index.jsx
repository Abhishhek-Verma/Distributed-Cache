import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ROUTES from './paths';
import LandingLayout from '../layouts/LandingLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/common/Spinner';

// -------------------------------------------------------------------
// Lazy-loaded pages
// Architecture.md section 14 — Lazy Loaded Pages
// -------------------------------------------------------------------
const Landing = lazy(() => import('../pages/Landing'));
const Features = lazy(() => import('../pages/Features'));
const Architecture = lazy(() => import('../pages/Architecture'));
const ApiPreview = lazy(() => import('../pages/ApiPreview'));

const Dashboard = lazy(() => import('../pages/Dashboard'));
const ClusterOverview = lazy(() => import('../pages/ClusterOverview'));
const CacheNodes = lazy(() => import('../pages/CacheNodes'));
const CacheExplorer = lazy(() => import('../pages/CacheExplorer'));
const Metrics = lazy(() => import('../pages/Metrics'));
const Monitoring = lazy(() => import('../pages/Monitoring'));
const Health = lazy(() => import('../pages/Health'));
const Replication = lazy(() => import('../pages/Replication'));
const Heartbeat = lazy(() => import('../pages/Heartbeat'));
const Rebalancing = lazy(() => import('../pages/Rebalancing'));
const RequestExplorer = lazy(() => import('../pages/RequestExplorer'));
const Logs = lazy(() => import('../pages/Logs'));
const APIPlayground = lazy(() => import('../pages/APIPlayground'));
const Settings = lazy(() => import('../pages/Settings'));
const SystemInformation = lazy(() => import('../pages/SystemInformation'));
const About = lazy(() => import('../pages/About'));
const NotFound = lazy(() => import('../pages/NotFound'));

// -------------------------------------------------------------------
// Loading fallback wrapper
// -------------------------------------------------------------------
const Fallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

// -------------------------------------------------------------------
// Router
// Architecture.md section 14 — Routing Architecture
// Architecture.md section 15 — Application Layout
// PRD.md section 12 — Application Sitemap
// -------------------------------------------------------------------
const router = createBrowserRouter([
  // Landing Layout Pages (no sidebar)
  {
    path: ROUTES.HOME,
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Fallback />}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: 'features',
        element: (
          <Suspense fallback={<Fallback />}>
            <Features />
          </Suspense>
        ),
      },
      {
        path: 'architecture',
        element: (
          <Suspense fallback={<Fallback />}>
            <Architecture />
          </Suspense>
        ),
      },
      {
        path: 'api-preview',
        element: (
          <Suspense fallback={<Fallback />}>
            <ApiPreview />
          </Suspense>
        ),
      },
    ],
  },

  // Dashboard — DashboardLayout (sidebar + header + footer)
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Fallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'cluster',
        element: (
          <Suspense fallback={<Fallback />}>
            <ClusterOverview />
          </Suspense>
        ),
      },
      {
        path: 'nodes',
        element: (
          <Suspense fallback={<Fallback />}>
            <CacheNodes />
          </Suspense>
        ),
      },
      {
        path: 'cache',
        element: (
          <Suspense fallback={<Fallback />}>
            <CacheExplorer />
          </Suspense>
        ),
      },
      {
        path: 'metrics',
        element: (
          <Suspense fallback={<Fallback />}>
            <Metrics />
          </Suspense>
        ),
      },
      {
        path: 'monitoring',
        element: (
          <Suspense fallback={<Fallback />}>
            <Monitoring />
          </Suspense>
        ),
      },
      {
        path: 'health',
        element: (
          <Suspense fallback={<Fallback />}>
            <Health />
          </Suspense>
        ),
      },
      {
        path: 'replication',
        element: (
          <Suspense fallback={<Fallback />}>
            <Replication />
          </Suspense>
        ),
      },
      {
        path: 'heartbeat',
        element: (
          <Suspense fallback={<Fallback />}>
            <Heartbeat />
          </Suspense>
        ),
      },
      {
        path: 'rebalancing',
        element: (
          <Suspense fallback={<Fallback />}>
            <Rebalancing />
          </Suspense>
        ),
      },
      {
        path: 'requests',
        element: (
          <Suspense fallback={<Fallback />}>
            <RequestExplorer />
          </Suspense>
        ),
      },
      {
        path: 'logs',
        element: (
          <Suspense fallback={<Fallback />}>
            <Logs />
          </Suspense>
        ),
      },
      {
        path: 'api-playground',
        element: (
          <Suspense fallback={<Fallback />}>
            <APIPlayground />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<Fallback />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'system',
        element: (
          <Suspense fallback={<Fallback />}>
            <SystemInformation />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Fallback />}>
            <About />
          </Suspense>
        ),
      },
    ],
  },

  // 404 catch-all
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<Fallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
