import React from 'react';

/**
 * PageHeader — the standard top block for every dashboard page.
 *
 * Renders:
 *   <h1> title
 *   Optional <p> description (one line max)
 *
 * Used on every page as the first element. The global Header
 * (navigation chrome) does NOT render page titles.
 */
const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-3">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h1>
      {description && (
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
