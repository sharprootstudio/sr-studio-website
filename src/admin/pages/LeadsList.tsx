// ==============================================================================
// SR STUDIO — LEADS PIPELINE DIRECTORY & FILTERING
// File: src/admin/pages/LeadsList.tsx
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Inbox, 
  Eye, 
  Archive, 
  RefreshCw,
  User,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Lead, LeadStatus, TeamMember } from '../../types/admin';
import { useAuth } from '../context/AuthContext';

interface LeadsListProps {
  onNavigate: (path: string) => void;
}

export const LeadsList: React.FC<LeadsListProps> = ({ onNavigate }) => {
  const { isOwner } = useAuth();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [includeArchived, setIncludeArchived] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const fetchTeamMembers = async () => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('full_name');
    if (data) {
      setTeamMembers(data as TeamMember[]);
    }
  };

  const fetchLeads = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      let query = supabase
        .from('leads')
        .select('*, assignee:team_members(id, full_name, email, role)', { count: 'exact' });

      // 1. Archive filter
      if (!includeArchived) {
        query = query.is('archived_at', null);
      } else {
        query = query.not('archived_at', 'is', null);
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // 3. Service filter
      if (serviceFilter !== 'all') {
        query = query.eq('service', serviceFilter);
      }

      // 4. Assignee filter
      if (assigneeFilter === 'unassigned') {
        query = query.is('assigned_to', null);
      } else if (assigneeFilter !== 'all') {
        query = query.eq('assigned_to', assigneeFilter);
      }

      // 5. Search filter (Name, Email, or Company)
      if (search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`name.ilike.${term},email.ilike.${term},company.ilike.${term}`);
      }

      // 6. Ordering & Pagination
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      query = query.order('submitted_at', { ascending: false }).range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('[Leads List Error]', error);
      } else {
        setLeads((data as Lead[]) || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('[Leads Fetch Exception]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, serviceFilter, assigneeFilter, includeArchived]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const exportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'Company', 'Service', 'Status', 'Assignee', 'Submitted At', 'Details'];
    
    // Sanitize values against Excel/CSV injection
    const sanitize = (val: string | null | undefined) => {
      if (!val) return '""';
      let clean = String(val).replace(/"/g, '""');
      // If starts with =, +, -, @, prepend single quote to prevent formula execution
      if (/^[=+\-@]/.test(clean)) {
        clean = `'${clean}`;
      }
      return `"${clean}"`;
    };

    const rows = leads.map(l => [
      sanitize(l.id),
      sanitize(l.name),
      sanitize(l.email),
      sanitize(l.company),
      sanitize(l.service),
      sanitize(l.status),
      sanitize(l.assignee?.full_name || 'Unassigned'),
      sanitize(new Date(l.submitted_at).toISOString()),
      sanitize(l.details),
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sr_studio_leads_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F5F1EB]">
            Leads Pipeline Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A5A5] mt-0.5">
            {includeArchived ? 'Viewing Archived Records' : `Showing ${totalCount} active client opportunities`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Archive Toggle */}
          <button
            onClick={() => {
              setIncludeArchived(!includeArchived);
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              includeArchived
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-[#141619] border-white/10 text-[#A5A5A5] hover:text-[#F5F1EB]'
            }`}
          >
            <Archive size={14} />
            <span>{includeArchived ? 'Archived View' : 'Archive'}</span>
          </button>

          {/* Export CSV (Only for authenticated users with permission) */}
          <button
            onClick={exportCSV}
            disabled={leads.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#141619] border border-white/10 text-xs font-semibold text-[#A5A5A5] hover:text-[#F5F1EB] hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          {/* Refresh */}
          <button
            onClick={fetchLeads}
            className="p-2 rounded-xl bg-[#141619] border border-white/10 text-[#A5A5A5] hover:text-[#F5F1EB] transition-all cursor-pointer"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141619] border border-white/[0.08] space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Input (5 cols) */}
          <div className="lg:col-span-4 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, company, or email..."
              className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] focus:ring-1 focus:ring-[#F07835]/40 rounded-xl pl-9 pr-4 py-2 text-xs text-[#F5F1EB] placeholder-white/20 outline-none"
            />
          </div>

          {/* Status Dropdown (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl px-3 py-2 text-xs text-[#F5F1EB] outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Service Dropdown (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl px-3 py-2 text-xs text-[#F5F1EB] outline-none cursor-pointer"
            >
              <option value="all">All Services</option>
              <option value="Website Development">Website Development</option>
              <option value="AI Solutions & Automation">AI Solutions & Automation</option>
              <option value="Branding & Creative Design">Branding & Creative Design</option>
              <option value="Digital Growth Solutions">Digital Growth Solutions</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          {/* Assignee Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={assigneeFilter}
              onChange={(e) => {
                setAssigneeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl px-3 py-2 text-xs text-[#F5F1EB] outline-none cursor-pointer"
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {teamMembers.map((tm) => (
                <option key={tm.id} value={tm.id}>{tm.full_name}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Leads Table Container */}
      <div className="rounded-2xl bg-[#141619] border border-white/[0.08] overflow-hidden">
        
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw size={24} className="mx-auto text-[#F07835] animate-spin mb-3" />
            <p className="text-xs text-[#A5A5A5] font-mono">Querying database pipeline...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center">
            <Inbox size={36} className="mx-auto text-[#737373] mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-[#F5F1EB]">No inquiries match these criteria</h3>
            <p className="text-xs text-[#A5A5A5] mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, status filters, or archive toggle.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0C0D10]/80 border-b border-white/[0.08] text-[#A5A5A5] font-mono">
                  <th className="py-3 px-4 font-medium">CLIENT / CONTACT</th>
                  <th className="py-3 px-4 font-medium">SERVICE</th>
                  <th className="py-3 px-4 font-medium">STATUS</th>
                  <th className="py-3 px-4 font-medium">ASSIGNEE</th>
                  <th className="py-3 px-4 font-medium text-right">SUBMITTED</th>
                  <th className="py-3 px-4 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {leads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => onNavigate(`/admin/leads/${lead.id}`)}
                    className="hover:bg-white/[0.025] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#F5F1EB] group-hover:text-white flex items-center gap-1.5">
                        <span>{lead.name}</span>
                        {lead.company && (
                          <span className="text-[11px] text-[#A5A5A5] font-normal">
                            • {lead.company}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#A5A5A5] mt-0.5">{lead.email}</div>
                    </td>

                    <td className="py-3.5 px-4 text-[#A5A5A5]">
                      <span className="bg-[#1D2024] px-2 py-0.5 rounded text-[11px] text-[#FFAD76] font-mono border border-white/5">
                        {lead.service}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#A5A5A5]">
                      {lead.assignee ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#F5F1EB]">
                          <User size={12} className="text-[#F07835]" />
                          <span>{lead.assignee.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[#737373]">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#737373]">
                      {new Date(lead.submitted_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onNavigate(`/admin/leads/${lead.id}`)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#F07835]/15 text-[#A5A5A5] hover:text-[#FFAD76] border border-white/5 transition-colors cursor-pointer"
                        title="Manage lead"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#A5A5A5] bg-[#0C0D10]/40">
            <div>
              Showing <span className="font-semibold text-white">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-semibold text-white">{Math.min(page * PAGE_SIZE, totalCount)}</span> of{' '}
              <span className="font-semibold text-white">{totalCount}</span> leads
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg bg-[#141619] border border-white/10 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-xs px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-[#141619] border border-white/10 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

