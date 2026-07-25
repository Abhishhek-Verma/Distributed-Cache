import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-3 px-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left side: Copyright */}
        <div className="text-sm text-[var(--text-muted)]">
          &copy; {currentYear} Self-Healing Distributed Cache. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
