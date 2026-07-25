import { createContext, useContext, useState, useCallback } from 'react';
import {
  DEFAULT_REFRESH_INTERVAL,
  LS_SIDEBAR_COLLAPSED,
  LS_REFRESH_INTERVAL,
} from '../constants';

// -------------------------------------------------------------------
// AppContext
// StateManagement.md section 17 — AppContextProvider
// Contains lightweight application-wide state:
//   - Sidebar expanded/collapsed
//   - Auto-refresh interval
//   - Notification queue
// Does NOT contain backend datasets (use React Query for that).
// -------------------------------------------------------------------

const AppContext = createContext(null);

export function AppContextProvider({ children }) {
  // Sidebar state — persisted in localStorage per Memory.md
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem(LS_SIDEBAR_COLLAPSED);
    return stored === 'true';
  });

  // Auto-refresh interval — persisted in localStorage per Memory.md
  const [refreshInterval, setRefreshIntervalState] = useState(() => {
    const stored = localStorage.getItem(LS_REFRESH_INTERVAL);
    return stored ? Number(stored) : DEFAULT_REFRESH_INTERVAL;
  });

  // Notification queue — toast messages managed via react-hot-toast
  // Kept minimal here; actual toasts dispatched directly via react-hot-toast
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(LS_SIDEBAR_COLLAPSED, String(next));
      return next;
    });
  }, []);

  const collapseSidebar = useCallback(() => {
    setSidebarCollapsed(true);
    localStorage.setItem(LS_SIDEBAR_COLLAPSED, 'true');
  }, []);

  const expandSidebar = useCallback(() => {
    setSidebarCollapsed(false);
    localStorage.setItem(LS_SIDEBAR_COLLAPSED, 'false');
  }, []);

  const setRefreshInterval = useCallback((ms) => {
    setRefreshIntervalState(ms);
    localStorage.setItem(LS_REFRESH_INTERVAL, String(ms));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), ...notification },
    ]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        collapseSidebar,
        expandSidebar,
        refreshInterval,
        setRefreshInterval,
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppContextProvider');
  }
  return context;
}

export default AppContext;
