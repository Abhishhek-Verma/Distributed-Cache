import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/paths';

// 404 Not Found Page
// Architecture.md section 14 — 404 Handling
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-6xl font-bold" style={{ color: 'var(--color-brand-accent)' }}>
        404
      </h1>
      <p className="text-xl text-gray-500 dark:text-gray-400">
        Page not found.
      </p>
      <Link
        to={ROUTES.HOME}
        className="px-5 py-3 rounded-lg text-white font-semibold transition-all"
        style={{ backgroundColor: 'var(--color-brand-cta)' }}
      >
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;
