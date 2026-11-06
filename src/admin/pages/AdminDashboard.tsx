// ==============================================================================
// SR STUDIO — ADMIN DASHBOARD OVERVIEW
// File: src/admin/pages/AdminDashboard.tsx
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Mail, 
  MessageSquare, 
  Layers, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Lead, LeadStats, NotificationLog } from '../../types/admin';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { isOwner, profile } = useAuth();
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    qualifiedCount: 0,
    proposalSentCount: 0,
    wonCount: 0,
    lostCount: 0,
    openCount: 0,
    archivedCount: 0,
    conversionRate: 0,
  });

  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch leads for metrics computation
      const { data: allLeads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (leadsError) {
        console.error('[Dashboard Error]', leadsError);
      } else if (allLeads) {
        const activeLeads = allLeads.filter(l => !l.archived_at);
        const archivedLeads = allLeads.filter(l => l.archived_at);

        const newCount = activeLeads.filter(l => l.status === 'new').length;
        const contactedCount = activeLeads.filter(l => l.status === 'contacted').length;
        const qualifiedCount = activeLeads.filter(l => l.status === 'qualified').length;
        const proposalSentCount = activeLeads.filter(l => l.status === 'proposal_sent').length;
        const wonCount = activeLeads.filter(l => l.status === 'won').length;
        const lostCount = activeLeads.filter(l => l.status === 'lost').length;
        const openCount = newCount + contactedCount + qualifiedCount + proposalSentCount;

        const rate = activeLeads.length > 0 ? (wonCount / activeLeads.length) * 100 : 0;

        setStats({
          total: activeLeads.length,
          newCount,
          contactedCount,
          qualifiedCount,
          proposalSentCount,
          wonCount,
          lostCount,
          openCount,
          archivedCount: archivedLeads.length,
          conversionRate: Math.round(rate),
        });

        setRecentLeads(activeLeads.slice(0, 6) as Lead[]);
      }

      // 2. Fetch recent notification logs
      const { data: notifications } = await supabase
        .from('notification_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (notifications) {
        setRecentNotifications(notifications as NotificationLog[]);
      }
    } catch (err) {
      console.error('[Dashboard Fetch Exception]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'contacted':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'qualified':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'proposal_sent':
        return 'bg-[#F07835]/15 text-[#FFAD76] border-[#F07835]/40';
      case 'won':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'lost':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-[#A5A5A5] border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#141619] border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F07835]/08 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFAD76]">
            AGENCY PIPELINE TELEMETRY
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F5F1EB] mt-1">
            Welcome back, {profile?.full_name || 'Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A5A5] mt-1 max-w-xl">
            Monitor incoming client briefs, track assignment velocity, and review conversion metrics across all SR Studio service offerings.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchDashboardData}
            title="Refresh metrics"
            className="p-2.5 rounded-xl bg-[#1D2024] border border-white/10 text-[#A5A5A5] hover:text-[#F5F1EB] hover:border-white/20 transition-all cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => onNavigate('/admin/leads')}
            className="px-4 py-2.5 rounded-xl bg-[#F07835] text-white text-xs sm:text-sm font-semibold hover:bg-[#d96726] shadow-[0_4px_18px_rgba(240,120,53,0.35)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>All Leads ({stats.total})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: New Inquiries */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141619] border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A5] mb-3">
            <span>NEW INQUIRIES</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Inbox size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-display font-bold text-[#F5F1EB]">
            {stats.newCount}
          </div>
          <span className="text-[11px] text-[#A5A5A5] mt-1 block">
            Awaiting initial contact
          </span>
        </div>

        {/* Card 2: Active Open Pipeline */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141619] border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A5] mb-3">
            <span>ACTIVE PIPELINE</span>
            <div className="w-8 h-8 rounded-lg bg-[#F07835]/15 border border-[#F07835]/30 flex items-center justify-center text-[#F07835]">
              <Sparkles size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-display font-bold text-[#F5F1EB]">
            {stats.openCount}
          </div>
          <span className="text-[11px] text-[#A5A5A5] mt-1 block">
            In qualification or proposal
          </span>
        </div>

        {/* Card 3: Won Projects */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141619] border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A5] mb-3">
            <span>WON ENGAGEMENTS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-display font-bold text-[#F5F1EB]">
            {stats.wonCount}
          </div>
          <span className="text-[11px] text-[#A5A5A5] mt-1 block">
            Successfully closed contracts
          </span>
        </div>

        {/* Card 4: Conversion Velocity */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141619] border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono text-[#A5A5A5] mb-3">
            <span>CONVERSION RATE</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-display font-bold text-[#F5F1EB]">
            {stats.conversionRate}%
          </div>
          <span className="text-[11px] text-[#A5A5A5] mt-1 block">
            Won vs total submitted
          </span>
        </div>

      </div>

      {/* Main Split: Recent Leads & System Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Leads Table (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-[#F5F1EB]">
                Recent Inbound Inquiries
              </h2>
              <p className="text-xs text-[#A5A5A5]">
                Direct client briefs recorded from public website
              </p>
            </div>
            <button
              onClick={() => onNavigate('/admin/leads')}
              className="text-xs font-semibold text-[#FFAD76] hover:text-[#F07835] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
              <Inbox size={32} className="mx-auto text-[#737373] mb-3 opacity-60" />
              <p className="text-sm font-semibold text-[#F5F1EB]">No inquiries received yet</p>
              <p className="text-xs text-[#A5A5A5] mt-1">
                Submissions from the public contact form will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#A5A5A5] font-mono">
                    <th className="pb-3 font-medium">CLIENT</th>
                    <th className="pb-3 font-medium">SERVICE</th>
                    <th className="pb-3 font-medium">STATUS</th>
                    <th className="pb-3 font-medium text-right">DATE</th>
                    <th className="pb-3 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3.5 pr-3">
                        <div className="font-semibold text-[#F5F1EB]">{lead.name}</div>
                        <div className="text-[11px] text-[#A5A5A5]">{lead.email}</div>
                      </td>
                      <td className="py-3.5 pr-3 text-[#A5A5A5]">
                        <span className="bg-[#1D2024] px-2 py-0.5 rounded text-[11px] text-[#FFAD76] font-mono border border-white/5">
                          {lead.service}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                          {lead.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono text-[11px] text-[#737373]">
                        {new Date(lead.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => onNavigate(`/admin/leads/${lead.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#F07835]/15 hover:text-[#FFAD76] text-[#A5A5A5] text-[11px] font-semibold border border-white/5 transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Notification Delivery Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dispatch Integrity Card */}
          <div className="p-6 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFAD76] uppercase tracking-wider">
              <ShieldCheck size={16} className="text-[#F07835]" />
              <span>Notification Dispatch Integrity</span>
            </div>
            
            <p className="text-xs text-[#A5A5A5] leading-relaxed">
              When an inquiry arrives, the database records the lead first before dispatching alert notifications to email and WhatsApp.
            </p>

            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#F5F1EB]">
                  <Mail size={15} className="text-[#F07835]" />
                  <span>Resend Email Dispatch</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active Server Runtime
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#F5F1EB]">
                  <MessageSquare size={15} className="text-[#25D366]" />
                  <span>WhatsApp Cloud API</span>
                </div>
                <span className="text-[11px] font-mono text-[#A5A5A5] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Template Enforced
                </span>
              </div>
            </div>
          </div>

          {/* Recent Notification Events */}
          <div className="p-6 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A5A5A5]">
              Recent Notification Audits
            </h3>

            {recentNotifications.length === 0 ? (
              <p className="text-xs text-[#737373] italic">No notification events recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 rounded-xl bg-[#0C0D10] border border-white/5 text-xs flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#F5F1EB]">
                        {notif.channel === 'email' ? <Mail size={12} className="text-[#F07835]" /> : <MessageSquare size={12} className="text-[#25D366]" />}
                        <span className="capitalize">{notif.channel}</span>
                      </div>
                      <div className="text-[10px] text-[#737373] font-mono truncate max-w-[160px]">
                        {notif.recipient}
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      notif.status === 'sent'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : notif.status === 'failed'
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-[#A5A5A5]'
                    }`}>
                      {notif.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

