import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function DashboardLayout() {
  const { sidebarCollapsed, toggleSidebar } = useAppContext();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div
        className={`
          fixed md:relative z-40 h-full transition-transform duration-[var(--duration-nav)]
          ${sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        <Sidebar />
      </div>

      {/* Right column: Header + Content + Footer */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />

        {/* Main scrollable content — compact asymmetric padding */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 md:px-6 md:pt-4 md:pb-6 animate-fade-in custom-scrollbar">
          <div className="max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
