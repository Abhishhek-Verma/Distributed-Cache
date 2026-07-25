import React from 'react';
import { GitBranch, FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-3 px-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left side: Copyright */}
        <div className="text-sm text-[var(--text-muted)]">
          &copy; {currentYear} Self-Healing Distributed Cache. All rights reserved.
        </div>

        {/* Right side: Links and Info */}
        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--color-brand-cta)] transition-colors"
          >
            <FileText size={16} className="mr-1.5" />
            Documentation
          </a>
          <a 
            href="#" 
            className="flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <GitBranch size={16} className="mr-1.5" />
            GitHub
          </a>
          <div className="flex items-center text-xs text-[var(--text-muted)] border-l border-[var(--border-color)] pl-6">
            <span>v1.0.0</span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] mr-1.5 animate-pulse"></span>
              Environment: Production
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
