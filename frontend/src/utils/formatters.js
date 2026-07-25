// Utility helper functions
// DeveloperGuide.md section 26 — Utility Files: camelCase naming

// -------------------------------------------------------------------
// Date / Time Formatting
// -------------------------------------------------------------------

/**
 * Format a date/time string or timestamp into a readable format.
 * @param {string|number|Date} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date/time string with time component.
 * @param {string|number|Date} value
 * @returns {string}
 */
export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Return a human-readable relative time string ("2 mins ago").
 * @param {string|number|Date} value
 * @returns {string}
 */
export function formatRelativeTime(value) {
  if (!value) return '—';
  const now = Date.now();
  const ts = new Date(value).getTime();
  if (isNaN(ts)) return '—';
  const diff = Math.floor((now - ts) / 1000);

  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// -------------------------------------------------------------------
// Number Formatting
// -------------------------------------------------------------------

/**
 * Format a number with locale-aware separators.
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (value == null || isNaN(value)) return '—';
  return Number(value).toLocaleString('en-US');
}

/**
 * Format a byte value into a human-readable string (KB, MB, GB).
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes == null || isNaN(bytes)) return '—';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format a percentage value with one decimal place.
 * @param {number} value  0–100
 * @returns {string}
 */
export function formatPercent(value) {
  if (value == null || isNaN(value)) return '—';
  return `${Number(value).toFixed(1)}%`;
}

/**
 * Format milliseconds into a readable duration string.
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms == null || isNaN(ms)) return '—';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}
