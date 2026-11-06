// ==============================================================================
// SR STUDIO — ADMIN NAVIGATION BAR
// File: src/admin/components/AdminNavbar.tsx
// ==============================================================================

import React from 'react';
import { LayoutDashboard, Users, Inbox, LogOut, ExternalLink, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, profile, isOwner, signOut } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={16} /> },
    { label: 'Leads Pipeline', path: '/admin/leads', icon: <Inbox size={16} /> },
    ...(isOwner ? [{ label: 'Team', path: '/admin/team', icon: <Users size={16} /> }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0C0D10]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Brand & Admin Console Identifier */}
        <div className="flex items-center gap-6">
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/admin');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="h-9 w-9 flex items-center justify-center flex-shrink-0">
              <img
                src="/logo-clean.png"
                alt="SR Studio Emblem"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_10px_rgba(240,120,53,0.4)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-[#F5F1EB] leading-none">
                SR STUDIO
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#FFAD76] uppercase font-semibold mt-0.5">
                Admin Console
              </span>
            </div>
          </a>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-white/[0.08]">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F07835]/15 text-[#FFAD76] border border-[#F07835]/30'
                      : 'text-[#A5A5A5] hover:text-[#F5F1EB] hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: User Information & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Website Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A5A5A5] hover:text-[#F5F1EB] hover:bg-white/[0.04] border border-white/5 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink size={13} />
          </a>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#141619] border border-white/[0.08]">
            <div className="w-6 h-6 rounded-lg bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835]">
              <UserIcon size={13} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F5F1EB] leading-tight max-w-[120px] truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Team User'}
              </span>
              <span className="text-[10px] font-mono text-[#FFAD76] uppercase">
                {isOwner ? 'Owner' : 'Staff'}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            title="Sign out of Admin Console"
            className="p-2 rounded-xl text-[#A5A5A5] hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-around gap-2 pt-3 mt-3 border-t border-white/[0.06]">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-[#F07835]/15 text-[#FFAD76] border border-[#F07835]/30'
                  : 'text-[#A5A5A5] hover:text-[#F5F1EB]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

