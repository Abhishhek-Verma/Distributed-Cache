import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

function LandingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] items-center w-full">
      <Navbar />
      
      <main className="flex-1 w-full flex flex-col items-center justify-start pb-16" style={{ paddingTop: '90px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default LandingLayout;
