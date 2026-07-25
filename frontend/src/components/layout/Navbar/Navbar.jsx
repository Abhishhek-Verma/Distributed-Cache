import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database } from 'lucide-react';
import Button from '../../common/Button';
import ThemeToggle from '../../utility/ThemeToggle';
import { ROUTES } from '../../../routes/paths';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)] z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Brand */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-[var(--color-brand-cta)]/10 rounded-[var(--radius-sm)] border border-[var(--color-brand-cta)]/20 group-hover:bg-[var(--color-brand-cta)]/20 transition-colors">
            <Database className="text-[var(--color-brand-cta)]" size={20} />
          </div>
          <span className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight">
            CacheDash
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to={ROUTES.FEATURES}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              location.pathname === ROUTES.FEATURES
                ? 'text-[var(--color-brand-cta)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Features
          </Link>

          <Link
            to={ROUTES.ARCHITECTURE}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              location.pathname === ROUTES.ARCHITECTURE
                ? 'text-[var(--color-brand-cta)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Architecture
          </Link>

          <Link
            to={ROUTES.API_PREVIEW}
            className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
              location.pathname === ROUTES.API_PREVIEW
                ? 'text-[var(--color-brand-cta)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            API Preview
          </Link>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" size="sm">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
