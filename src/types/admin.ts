export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';

export type TeamRole = 'owner' | 'staff';

export type NotificationChannel = 'email' | 'whatsapp';

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'skipped_unconfigured';

export interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: TeamRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  details: string;
  status: LeadStatus;
  assigned_to: string | null;
  source: string;
  metadata: Record<string, unknown>;
  submitted_at: string;
  updated_at: string;
  archived_at: string | null;
  // Joined relation:
  assignee?: TeamMember | null;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  old_status: LeadStatus | null;
  new_status: LeadStatus;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
  author?: {
    full_name: string;
    email: string;
  } | null;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    email: string;
  } | null;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  actor_id: string | null;
  activity_type: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
  actor?: {
    full_name: string;
    email: string;
  } | null;
}

export interface NotificationLog {
  id: string;
  lead_id: string;
  channel: NotificationChannel;
  recipient: string;
  attempt_count: number;
  status: NotificationStatus;
  error_message: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'all';
  service: string | 'all';
  assignedTo: string | 'all';
  includeArchived: boolean;
  page: number;
  pageSize: number;
}

export interface LeadStats {
  total: number;
  newCount: number;
  contactedCount: number;
  qualifiedCount: number;
  proposalSentCount: number;
  wonCount: number;
  lostCount: number;
  openCount: number;
  archivedCount: number;
  conversionRate: number;
}

