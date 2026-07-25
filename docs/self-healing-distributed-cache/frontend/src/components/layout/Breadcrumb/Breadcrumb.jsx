import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // If we are at dashboard root
  if (pathnames.length === 1 && `/${pathnames[0]}` === ROUTES.DASHBOARD) {
    return null;
  }

  return (
    <nav className="flex text-sm text-[var(--text-muted)]" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to={ROUTES.DASHBOARD} className="inline-flex items-center hover:text-[var(--text-primary)] transition-colors">
            <Home size={14} className="mr-2" />
            Dashboard
          </Link>
        </li>
        {pathnames.map((value, index) => {
          // Skip first if it's dashboard, as we handled it above
          if (index === 0 && `/${value}` === ROUTES.DASHBOARD) return null;
          
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Format label (e.g. cluster-overview -> Cluster Overview)
          const label = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight size={14} className="mx-1" />
                {isLast ? (
                  <span className="ml-1 font-medium text-[var(--text-primary)]" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link to={to} className="ml-1 hover:text-[var(--text-primary)] transition-colors">
                    {label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
