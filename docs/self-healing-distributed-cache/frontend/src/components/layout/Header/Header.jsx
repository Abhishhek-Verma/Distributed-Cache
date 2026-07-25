import React from 'react';
import Breadcrumb from '../Breadcrumb';
import Badge from '../../common/Badge';
import { Activity } from 'lucide-react';

const Header = ({ clusterStatus = 'healthy' }) => {
  return (
    <header className="h-14 bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-5 sticky top-0 z-30 flex items-center justify-between">
      {/* Left: Breadcrumb only — sidebar has its own toggle */}
      <div className="flex items-center">
        <Breadcrumb />
      </div>

      {/* Right: Cluster Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-secondary)] hidden sm:inline-block">Cluster Status:</span>
        <Badge
          variant={clusterStatus === 'healthy' ? 'healthy' : 'warning'}
          text={clusterStatus}
          icon={<Activity size={12} />}
          className="uppercase"
        />
      </div>
    </header>
  );
};

export default Header;
