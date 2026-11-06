// ==============================================================================
// SR STUDIO — LEAD DETAIL & ACTIVITY MANAGEMENT
// File: src/admin/pages/LeadDetail.tsx
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Building, 
  Clock, 
  User, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Archive, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle,
  FileText,
  Activity,
  History
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Lead, LeadStatus, LeadNote, LeadActivity, LeadStatusHistory, NotificationLog, TeamMember } from '../../types/admin';
import { useAuth } from '../context/AuthContext';

interface LeadDetailProps {
  leadId: string;
  onNavigate: (path: string) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ leadId, onNavigate }) => {
  const { isOwner, user } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [history, setHistory] = useState<LeadStatusHistory[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchLeadData = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);

    try {
      // 1. Fetch Lead Details
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*, assignee:team_members(id, full_name, email, role)')
        .eq('id', leadId)
        .maybeSingle();

      if (leadError || !leadData) {
        console.error('[Lead Detail Error]', leadError);
        setLead(null);
        setLoading(false);
        return;
      }

      setLead(leadData as Lead);

      // 2. Fetch Team Members for assignment dropdown
      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('full_name');
      if (teamData) setTeamMembers(teamData as TeamMember[]);

      // 3. Fetch Notes with Author details
      const { data: notesData } = await supabase
        .from('lead_notes')
        .select('*, author:team_members(full_name, email)')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      if (notesData) setNotes(notesData as LeadNote[]);

      // 4. Fetch Activities Stream
      const { data: activitiesData } = await supabase
        .from('lead_activities')
        .select('*, actor:team_members(full_name, email)')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      if (activitiesData) setActivities(activitiesData as LeadActivity[]);

      // 5. Fetch Status History
      const { data: historyData } = await supabase
        .from('lead_status_history')
        .select('*, author:team_members(full_name, email)')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      if (historyData) setHistory(historyData as LeadStatusHistory[]);

      // 6. Fetch Notification Logs
      const { data: notifData } = await supabase
        .from('notification_logs')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      if (notifData) setNotifications(notifData as NotificationLog[]);

    } catch (err) {
      console.error('[Lead Detail Exception]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [leadId]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    setUpdating(true);

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', lead.id);

    setUpdating(false);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else {
      setLead({ ...lead, status: newStatus });
      setFeedback('Status updated successfully');
      setTimeout(() => setFeedback(null), 2500);
      fetchLeadData();
    }
  };

  const handleAssigneeChange = async (newAssigneeId: string) => {
    if (!lead) return;
    setUpdating(true);

    const val = newAssigneeId === 'unassigned' ? null : newAssigneeId;

    const { error } = await supabase
      .from('leads')
      .update({ assigned_to: val })
      .eq('id', lead.id);

    setUpdating(false);

    if (error) {
      alert(`Failed to update assignee: ${error.message}`);
    } else {
      setFeedback('Assignee updated');
      setTimeout(() => setFeedback(null), 2500);
      fetchLeadData();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !user || !lead) return;

    setAddingNote(true);

    const { error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: lead.id,
        author_id: user.id,
        content: newNote.trim(),
      });

    setAddingNote(false);

    if (error) {
      alert(`Failed to add note: ${error.message}`);
    } else {
      setNewNote('');
      fetchLeadData();
    }
  };

  const handleToggleArchive = async () => {
    if (!lead) return;
    const isCurrentlyArchived = Boolean(lead.archived_at);
    const confirmMsg = isCurrentlyArchived
      ? 'Restore this lead back to the active pipeline?'
      : 'Archive this lead record? (Archived leads are kept safely but hidden from active lists)';

    if (!window.confirm(confirmMsg)) return;

    setUpdating(true);
    const { error } = await supabase
      .from('leads')
      .update({ archived_at: isCurrentlyArchived ? null : new Date().toISOString() })
      .eq('id', lead.id);

    setUpdating(false);

    if (error) {
      alert(`Archive action failed: ${error.message}`);
    } else {
      fetchLeadData();
    }
  };

  const handleDeleteLead = async () => {
    if (!lead || !isOwner) return;
    if (!window.confirm(`PERMANENT ACTION: Delete inquiry from ${lead.name}? This action cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from('leads').delete().eq('id', lead.id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      onNavigate('/admin/leads');
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'details') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedDetails(true);
      setTimeout(() => setCopiedDetails(false), 2000);
    }
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

  if (loading) {
    return (
      <div className="py-24 text-center">
        <RefreshCw size={28} className="mx-auto text-[#F07835] animate-spin mb-3" />
        <p className="text-xs text-[#A5A5A5] font-mono">Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <AlertCircle size={36} className="mx-auto text-amber-400 mb-3" />
        <h2 className="text-xl font-bold text-white">Lead Record Not Found</h2>
        <p className="text-xs text-[#A5A5A5] mt-1 mb-6">
          This record may have been deleted, or your account may not have permission to view this assigned lead.
        </p>
        <button
          onClick={() => onNavigate('/admin/leads')}
          className="px-4 py-2 rounded-xl bg-[#F07835] text-white text-xs font-semibold"
        >
          Return to Pipeline
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('/admin/leads')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A5A5A5] hover:text-[#F5F1EB] transition-colors cursor-pointer self-start"
        >
          <ArrowLeft size={15} />
          <span>Back to All Leads</span>
        </button>

        <div className="flex items-center gap-2.5">
          {feedback && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} /> {feedback}
            </span>
          )}

          <button
            onClick={handleToggleArchive}
            className="px-3.5 py-1.5 rounded-xl bg-[#141619] border border-white/10 text-xs font-semibold text-[#A5A5A5] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Archive size={14} />
            <span>{lead.archived_at ? 'Restore Lead' : 'Archive'}</span>
          </button>

          {isOwner && (
            <button
              onClick={handleDeleteLead}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
              title="Delete lead permanently"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Lead Summary Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141619] border border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F5F1EB]">
                {lead.name}
              </h1>
              {lead.archived_at && (
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Archived
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#A5A5A5]">
              {lead.company && (
                <div className="flex items-center gap-1.5">
                  <Building size={14} className="text-[#FFAD76]" />
                  <span>{lead.company}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-[#FFAD76]" />
                <a href={`mailto:${lead.email}`} className="hover:text-white underline">
                  {lead.email}
                </a>
                <button
                  onClick={() => copyToClipboard(lead.email, 'email')}
                  className="p-1 hover:text-[#F07835] transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#737373]">
                <Clock size={13} />
                <span>Submitted {new Date(lead.submitted_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Status and Assignment Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Select */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1">
                LIFECYCLE STAGE
              </label>
              <select
                value={lead.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border cursor-pointer outline-none ${getStatusColor(lead.status)}`}
              >
                <option value="new">NEW</option>
                <option value="contacted">CONTACTED</option>
                <option value="qualified">QUALIFIED</option>
                <option value="proposal_sent">PROPOSAL SENT</option>
                <option value="won">WON</option>
                <option value="lost">LOST</option>
              </select>
            </div>

            {/* Assignee Select */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#737373] mb-1">
                ASSIGNED TEAM MEMBER
              </label>
              <select
                value={lead.assigned_to || 'unassigned'}
                disabled={updating || !isOwner}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="bg-[#0C0D10] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#F5F1EB] outline-none cursor-pointer"
              >
                <option value="unassigned">Unassigned</option>
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.full_name} ({tm.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Two Column Layout: Brief & Notes on Left; Activity & Delivery on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Brief & Notes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Project Brief Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[#F07835]" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Project Requirements & Brief
                </h2>
              </div>
              <button
                onClick={() => copyToClipboard(lead.details, 'details')}
                className="text-xs text-[#A5A5A5] hover:text-[#FFAD76] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedDetails ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                <span>{copiedDetails ? 'Copied' : 'Copy Brief'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0C0D10] border border-white/5 text-sm text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">
              {lead.details}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-[#A5A5A5] font-mono">
              <span>SERVICE: <strong className="text-[#FFAD76]">{lead.service}</strong></span>
              <span>SOURCE: <strong className="text-white">{lead.source}</strong></span>
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#F07835]" />
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                  Internal Team Notes ({notes.length})
                </h3>
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal client updates, call summaries, or next actions..."
                className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl p-3 text-xs text-[#F5F1EB] placeholder-white/20 outline-none resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-[#F07835] text-white text-xs font-semibold hover:bg-[#d96726] transition-colors flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Send size={12} />
                  <span>{addingNote ? 'Saving...' : 'Add Note'}</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="text-xs text-[#737373] italic text-center py-4">
                No internal notes added yet. Use the field above to record team notes.
              </p>
            ) : (
              <div className="space-y-3 pt-2">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl bg-[#0C0D10] border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#A5A5A5] text-[11px] font-mono">
                      <span className="font-semibold text-[#FFAD76]">
                        {note.author?.full_name || 'Staff Member'}
                      </span>
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Timeline & Notifications (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Notification Delivery Telemetry */}
          <div className="p-6 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFAD76] flex items-center gap-1.5">
              <Mail size={14} className="text-[#F07835]" />
              <span>Notification Delivery Telemetry</span>
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-[#737373] italic">No notifications logged for this lead.</p>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 rounded-xl bg-[#0C0D10] border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white capitalize">{notif.channel} Alert</span>
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
                    <div className="text-[11px] text-[#A5A5A5] font-mono truncate">
                      {notif.recipient}
                    </div>
                    {notif.error_message && (
                      <p className="text-[11px] text-red-300/80 bg-red-500/10 p-2 rounded border border-red-500/20 mt-1">
                        {notif.error_message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline Stream */}
          <div className="p-6 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#F07835]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
                Chronological Activity Stream
              </h3>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {activities.map((act) => (
                <div key={act.id} className="pl-7 relative text-xs">
                  <div className="absolute left-2 top-1.5 w-2 h-2 rounded-full bg-[#F07835] ring-4 ring-[#141619]" />
                  <div className="font-semibold text-[#F5F1EB]">
                    {act.description}
                  </div>
                  <div className="text-[10px] font-mono text-[#737373] mt-0.5">
                    {new Date(act.created_at).toLocaleString()}
                    {act.actor && ` • ${act.actor.full_name}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

