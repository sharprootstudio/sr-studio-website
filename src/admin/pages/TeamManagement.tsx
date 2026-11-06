// ==============================================================================
// SR STUDIO — TEAM DIRECTORY & PERMISSIONS MANAGEMENT (OWNER-ONLY)
// File: src/admin/pages/TeamManagement.tsx
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, Shield, UserCheck, UserX } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { TeamMember, TeamRole } from '../../types/admin';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../components/common/Button';

export const TeamManagement: React.FC = () => {
  const { isOwner, user } = useAuth();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New Member Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<TeamRole>('staff');
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);

    try {
      const { data, error: fetchErr } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (fetchErr) {
        setError(fetchErr.message);
      } else {
        setMembers(data as TeamMember[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchMembers();
    }
  }, [isOwner]);

  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Direct insert into team_members (allowed for owners via RLS)
      // Note: In Supabase, invited team members can be added by ID or by email
      const dummyId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

      const { error: insertErr } = await supabase.from('team_members').insert({
        id: dummyId,
        email: newEmail.trim().toLowerCase(),
        full_name: newName.trim(),
        role: newRole,
        is_active: true,
      });

      if (insertErr) {
        // If foreign key constraint on auth.users is enforced, guide the owner on Supabase invite
        setError(`Database note: ${insertErr.message}. For invite-only onboarding, invite the user via Supabase Auth Dashboard -> Users, and their profile will link upon first sign-in.`);
      } else {
        setSuccess(`Team member ${newName} added with ${newRole.toUpperCase()} permissions.`);
        setNewEmail('');
        setNewName('');
        setNewRole('staff');
        fetchMembers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    if (member.id === user?.id) {
      alert('You cannot deactivate your own account.');
      return;
    }

    const { error: updateErr } = await supabase
      .from('team_members')
      .update({ is_active: !member.is_active })
      .eq('id', member.id);

    if (updateErr) {
      alert(`Update failed: ${updateErr.message}`);
    } else {
      fetchMembers();
    }
  };

  const handleRoleChange = async (member: TeamMember, newR: TeamRole) => {
    if (member.id === user?.id) {
      alert('You cannot alter your own owner role.');
      return;
    }

    const { error: updateErr } = await supabase
      .from('team_members')
      .update({ role: newR })
      .eq('id', member.id);

    if (updateErr) {
      alert(`Role change failed: ${updateErr.message}`);
    } else {
      fetchMembers();
    }
  };

  if (!isOwner) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <ShieldAlert size={36} className="mx-auto text-amber-400 mb-3" />
        <h2 className="text-xl font-bold text-white">Permission Denied</h2>
        <p className="text-xs text-[#A5A5A5] mt-1">
          Team directory and role management is restricted strictly to agency owners. Contact the primary founder for permission adjustments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFAD76]">
            ACCESS CONTROL & GOVERNANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F5F1EB] mt-1">
            Agency Team Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A5A5] mt-0.5">
            Manage owner and staff permissions across the SR Studio lead pipeline.
          </p>
        </div>

        <button
          onClick={fetchMembers}
          className="p-2.5 rounded-xl bg-[#141619] border border-white/10 text-[#A5A5A5] hover:text-[#F5F1EB] transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertCircle size={16} className="text-[#F07835] flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Split: Members List (8 cols) & Add Member Form (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Team Members Table */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-6">
          <h2 className="text-base font-display font-bold text-[#F5F1EB] flex items-center gap-2">
            <Users size={18} className="text-[#F07835]" />
            <span>Active Team Members ({members.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#A5A5A5] font-mono">
                  <th className="pb-3 font-medium">MEMBER</th>
                  <th className="pb-3 font-medium">ROLE</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium text-right">JOINED</th>
                  <th className="pb-3 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-semibold text-[#F5F1EB]">{member.full_name}</div>
                      <div className="text-[11px] text-[#A5A5A5] font-mono">{member.email}</div>
                    </td>

                    <td className="py-3.5 pr-3">
                      <select
                        value={member.role}
                        disabled={member.id === user?.id}
                        onChange={(e) => handleRoleChange(member, e.target.value as TeamRole)}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded-md border outline-none cursor-pointer ${
                          member.role === 'owner'
                            ? 'bg-[#F07835]/15 text-[#FFAD76] border-[#F07835]/30'
                            : 'bg-white/5 text-[#A5A5A5] border-white/10'
                        }`}
                      >
                        <option value="owner">OWNER</option>
                        <option value="staff">STAFF</option>
                      </select>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        member.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{member.is_active ? 'ACTIVE' : 'SUSPENDED'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 text-right font-mono text-[11px] text-[#737373]">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 text-right">
                      {member.id !== user?.id && (
                        <button
                          onClick={() => handleToggleActive(member)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-white/10 hover:border-white/20 transition-colors text-[#A5A5A5] hover:text-white cursor-pointer"
                        >
                          {member.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Invite / Register Form */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#141619] border border-white/[0.08] space-y-5">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[#F07835]" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F5F1EB]">
              Register Staff Member
            </h3>
          </div>

          <p className="text-xs text-[#A5A5A5] leading-relaxed">
            Invite-only onboarding: Register a team member below, or invite them through the Supabase Auth Dashboard. Staff accounts can view and manage assigned inquiries.
          </p>

          <form onSubmit={handleRegisterMember} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl px-3.5 py-2 text-xs text-[#F5F1EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="jordan@srstudio.agency"
                className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl px-3.5 py-2 text-xs text-[#F5F1EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A5A5A5] mb-1.5">
                Access Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as TeamRole)}
                className="w-full bg-[#0C0D10] border border-white/10 focus:border-[#F07835] rounded-xl px-3.5 py-2 text-xs text-[#F5F1EB] outline-none cursor-pointer"
              >
                <option value="staff">Staff (Assigned Leads Only)</option>
                <option value="owner">Owner (Full Agency Access)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting}
              className="w-full justify-center text-xs font-semibold shadow-[0_4px_18px_rgba(240,120,53,0.35)]"
            >
              {submitting ? 'Registering...' : 'Register Team Member'}
            </Button>
          </form>

          <div className="pt-3 border-t border-white/5 text-[11px] text-[#737373] space-y-1">
            <div className="font-semibold text-[#A5A5A5]">Role Permissions:</div>
            <div>• <strong>Owner:</strong> Full access to all leads, delete, team management, CSV export.</div>
            <div>• <strong>Staff:</strong> View & manage assigned and unassigned leads, add notes.</div>
          </div>
        </div>

      </div>

    </div>
  );
};

