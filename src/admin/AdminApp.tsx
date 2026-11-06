// ==============================================================================
// SR STUDIO — ADMIN APPLICATION ROOT & ROUTER
// File: src/admin/AdminApp.tsx
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminNavbar } from './components/AdminNavbar';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { LeadsList } from './pages/LeadsList';
import { LeadDetail } from './pages/LeadDetail';
import { TeamManagement } from './pages/TeamManagement';
import { ShieldAlert, LogOut, RefreshCw } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, profile, isActive, loading, isConfigured, signOut } = useAuth();
  
  // Custom type-safe path state synced with window.location
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C0D10] text-[#F5F1EB] flex flex-col items-center justify-center p-4">
        <RefreshCw size={32} className="text-[#F07835] animate-spin mb-4" />
        <span className="text-xs font-mono tracking-widest text-[#FFAD76] uppercase">
          Verifying Encrypted Admin Session...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated State -> Render Login
  if (!user) {
    return <AdminLogin />;
  }

  // 3. Authenticated but not in team_members or suspended
  if (isConfigured && (!profile || !isActive)) {
    return (
      <div className="min-h-screen bg-[#0C0D10] text-[#F5F1EB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F07835] mb-4">
          <ShieldAlert size={32} />
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          Access Restricted: Staff Authorization Required
        </h1>
        <p className="text-xs sm:text-sm text-[#A5A5A5] max-w-md mb-6 leading-relaxed">
          You are signed in as <strong className="text-white">{user.email}</strong>, but this account is not registered as an active SR Studio team member. Please contact the agency owner to request team access.
        </p>
        <button
          onClick={() => signOut()}
          className="px-5 py-2.5 rounded-xl bg-[#141619] border border-white/10 hover:border-white/20 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  // 4. Authenticated & Authorized: Match Admin Sub-Routes
  const renderCurrentView = () => {
    if (currentPath === '/admin' || currentPath === '/admin/') {
      return <AdminDashboard onNavigate={navigate} />;
    }

    if (currentPath === '/admin/leads' || currentPath === '/admin/leads/') {
      return <LeadsList onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/admin/leads/')) {
      const parts = currentPath.split('/');
      const leadId = parts[3];
      if (leadId) {
        return <LeadDetail leadId={leadId} onNavigate={navigate} />;
      }
    }

    if (currentPath === '/admin/team' || currentPath === '/admin/team/') {
      return <TeamManagement />;
    }

    // Default fallback: Dashboard
    return <AdminDashboard onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#F5F1EB] selection:bg-[#F07835] selection:text-white flex flex-col">
      <AdminNavbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        {renderCurrentView()}
      </main>
      <footer className="border-t border-white/[0.06] py-6 px-4 text-center text-xs text-[#737373] font-mono">
        SR STUDIO • Inbound Pipeline & Agency Telemetry System
      </footer>
    </div>
  );
};

export const AdminApp: React.FC = () => {
  return (
    <AuthProvider>
      <AdminLayout />
    </AuthProvider>
  );
};

export default AdminApp;

