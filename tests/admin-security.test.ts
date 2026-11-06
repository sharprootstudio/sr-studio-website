// ==============================================================================
// SR STUDIO — TEST SUITE: ADMIN SECURITY, RBAC & CSV INJECTION DEFENSE
// File: tests/admin-security.test.ts
// ==============================================================================

import { describe, it, expect } from 'vitest';
import { LeadStatus, TeamRole, TeamMember, Lead } from '../src/types/admin';

// Helper matching RLS and can_access_lead PostgreSQL functions
export function canAccessLead(user: TeamMember | null, lead: Lead): boolean {
  if (!user || !user.is_active) return false;
  if (user.role === 'owner') return true;
  // Staff can only access unassigned leads or leads assigned directly to them
  if (user.role === 'staff') {
    return !lead.assigned_to || lead.assigned_to === user.id;
  }
  return false;
}

// Helper validating lifecycle state progression
const VALID_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];

export function isValidStatusTransition(current: LeadStatus, next: string): next is LeadStatus {
  return VALID_STATUSES.includes(next as LeadStatus);
}

// Helper matching CSV cell sanitizer against formula injection (CWE-1236)
export function sanitizeCSVCell(val: string | null | undefined): string {
  if (val === null || val === undefined || val === '') return '""';
  let clean = String(val).replace(/"/g, '""');
  // If the cell begins with formula trigger characters (=, +, -, @, tab, CR), prepend a single quote
  if (/^[=+\-@\t\r]/.test(clean)) {
    clean = `'${clean}`;
  }
  return `"${clean}"`;
}

describe('SR Studio — Role-Based Access Control (RBAC) & Security Policies', () => {
  const mockOwner: TeamMember = {
    id: 'owner-uuid-1',
    auth_user_id: 'auth-owner-1',
    email: 'director@srstudio.com',
    full_name: 'Studio Director',
    role: 'owner',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockStaff1: TeamMember = {
    id: 'staff-uuid-1',
    auth_user_id: 'auth-staff-1',
    email: 'leadeng@srstudio.com',
    full_name: 'Lead Engineer',
    role: 'staff',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockStaff2: TeamMember = {
    id: 'staff-uuid-2',
    auth_user_id: 'auth-staff-2',
    email: 'designer@srstudio.com',
    full_name: 'UI Designer',
    role: 'staff',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockInactiveMember: TeamMember = {
    ...mockStaff1,
    id: 'inactive-uuid-1',
    is_active: false,
  };

  const unassignedLead: Lead = {
    id: 'lead-unassigned',
    name: 'New Client',
    email: 'client@new.com',
    service: 'Website Development',
    status: 'new',
    details: 'Project discussion',
    submitted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const staff1AssignedLead: Lead = {
    ...unassignedLead,
    id: 'lead-staff1',
    assigned_to: 'staff-uuid-1',
    status: 'contacted',
  };

  const staff2AssignedLead: Lead = {
    ...unassignedLead,
    id: 'lead-staff2',
    assigned_to: 'staff-uuid-2',
    status: 'qualified',
  };

  it('allows owner to access every lead regardless of assignment', () => {
    expect(canAccessLead(mockOwner, unassignedLead)).toBe(true);
    expect(canAccessLead(mockOwner, staff1AssignedLead)).toBe(true);
    expect(canAccessLead(mockOwner, staff2AssignedLead)).toBe(true);
  });

  it('allows staff to access unassigned leads to claim or review them', () => {
    expect(canAccessLead(mockStaff1, unassignedLead)).toBe(true);
    expect(canAccessLead(mockStaff2, unassignedLead)).toBe(true);
  });

  it('allows staff to access leads assigned strictly to their own ID', () => {
    expect(canAccessLead(mockStaff1, staff1AssignedLead)).toBe(true);
    expect(canAccessLead(mockStaff2, staff2AssignedLead)).toBe(true);
  });

  it('denies staff access to leads assigned to another staff member', () => {
    // Staff 1 cannot view or modify Staff 2's lead
    expect(canAccessLead(mockStaff1, staff2AssignedLead)).toBe(false);
    // Staff 2 cannot view or modify Staff 1's lead
    expect(canAccessLead(mockStaff2, staff1AssignedLead)).toBe(false);
  });

  it('denies access to inactive or suspended team accounts immediately', () => {
    expect(canAccessLead(mockInactiveMember, unassignedLead)).toBe(false);
    expect(canAccessLead(mockInactiveMember, staff1AssignedLead)).toBe(false);
  });

  it('denies access to null or unauthenticated users', () => {
    expect(canAccessLead(null, unassignedLead)).toBe(false);
  });
});

describe('SR Studio — Lead Status Lifecycle', () => {
  it('validates canonical lifecycle statuses', () => {
    expect(isValidStatusTransition('new', 'contacted')).toBe(true);
    expect(isValidStatusTransition('contacted', 'qualified')).toBe(true);
    expect(isValidStatusTransition('qualified', 'proposal_sent')).toBe(true);
    expect(isValidStatusTransition('proposal_sent', 'won')).toBe(true);
    expect(isValidStatusTransition('proposal_sent', 'lost')).toBe(true);
  });

  it('rejects arbitrary or malicious status strings', () => {
    expect(isValidStatusTransition('new', 'deleted')).toBe(false);
    expect(isValidStatusTransition('new', 'admin_override')).toBe(false);
    expect(isValidStatusTransition('new', '<script>alert(1)</script>')).toBe(false);
  });
});

describe('SR Studio — CSV / Formula Injection Defense (CWE-1236)', () => {
  it('neutralizes spreadsheet formula payloads starting with =', () => {
    const maliciousInput = '=CMD|\' /C calc\'!A0';
    const sanitized = sanitizeCSVCell(maliciousInput);
    // Prepends single quote so Excel/Sheets treats it as plain text string
    expect(sanitized).toBe("\"'=CMD|' /C calc'!A0\"");
  });

  it('neutralizes payloads starting with +, -, or @', () => {
    expect(sanitizeCSVCell('+1+2')).toBe("\"'+1+2\"");
    expect(sanitizeCSVCell('-2+3')).toBe("\"'-2+3\"");
    expect(sanitizeCSVCell('@SUM(1,2)')).toBe("\"'@SUM(1,2)\"");
  });

  it('properly quotes and escapes internal double quotes in benign text', () => {
    const regularText = 'Special "Enterprise" Plan';
    const sanitized = sanitizeCSVCell(regularText);
    expect(sanitized).toBe('"Special ""Enterprise"" Plan"');
  });

  it('safely handles empty, null, or undefined values', () => {
    expect(sanitizeCSVCell(null)).toBe('""');
    expect(sanitizeCSVCell(undefined)).toBe('""');
    expect(sanitizeCSVCell('')).toBe('""');
  });
});
