-- ==============================================================================
-- SR STUDIO — DATABASE MIGRATION: SECURE LEAD MANAGEMENT & TEAM PERMISSIONS
-- File: 20261106000001_create_lead_management_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES / ENUMS
DO $$ BEGIN
    CREATE TYPE public.lead_status AS ENUM (
        'new',
        'contacted',
        'qualified',
        'proposal_sent',
        'won',
        'lost'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.team_role AS ENUM (
        'owner',
        'staff'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.notification_channel AS ENUM (
        'email',
        'whatsapp'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.notification_status AS ENUM (
        'pending',
        'sent',
        'failed',
        'skipped_unconfigured'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 3. TABLES DEFINITION

-- 3.1 Team Members Table (Profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.team_role NOT NULL DEFAULT 'staff',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT NOT NULL,
    details TEXT NOT NULL,
    status public.lead_status NOT NULL DEFAULT 'new',
    assigned_to UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'website_contact_form',
    idempotency_key TEXT UNIQUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- 3.3 Lead Status History Table
CREATE TABLE IF NOT EXISTS public.lead_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    old_status public.lead_status,
    new_status public.lead_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Lead Notes Table
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Lead Activities Stream Table
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 Notification Logs Table
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    channel public.notification_channel NOT NULL,
    recipient TEXT NOT NULL,
    attempt_count INT NOT NULL DEFAULT 1,
    status public.notification_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 4. PERFORMANCE & FILTERING INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_status_submitted ON public.leads(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_archived_at ON public.leads(archived_at);
CREATE INDEX IF NOT EXISTS idx_leads_idempotency ON public.leads(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON public.lead_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON public.lead_notes(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead ON public.lead_status_history(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_lead ON public.notification_logs(lead_id, created_at DESC);


-- 5. AUTOMATED TIMESTAMP & AUDIT TRIGGERS

-- 5.1 Updated_at Function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger applications for updated_at
DROP TRIGGER IF EXISTS trg_team_members_updated_at ON public.team_members;
CREATE TRIGGER trg_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_lead_notes_updated_at ON public.lead_notes;
CREATE TRIGGER trg_lead_notes_updated_at
BEFORE UPDATE ON public.lead_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_notification_logs_updated_at ON public.notification_logs;
CREATE TRIGGER trg_notification_logs_updated_at
BEFORE UPDATE ON public.notification_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5.2 Status Change Audit Logger Trigger
CREATE OR REPLACE FUNCTION public.log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO public.lead_status_history (
            lead_id,
            old_status,
            new_status,
            changed_by,
            notes
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid(),
            'Status transition from ' || OLD.status::text || ' to ' || NEW.status::text
        );

        INSERT INTO public.lead_activities (
            lead_id,
            actor_id,
            activity_type,
            description,
            metadata
        ) VALUES (
            NEW.id,
            auth.uid(),
            'status_changed',
            'Lead status updated to ' || NEW.status::text,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
        );
    END IF;

    -- Assignment change audit
    IF (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
        INSERT INTO public.lead_activities (
            lead_id,
            actor_id,
            activity_type,
            description,
            metadata
        ) VALUES (
            NEW.id,
            auth.uid(),
            'assigned',
            CASE 
                WHEN NEW.assigned_to IS NULL THEN 'Lead unassigned'
                ELSE 'Lead assigned to team member'
            END,
            jsonb_build_object('old_assignee', OLD.assigned_to, 'new_assignee', NEW.assigned_to)
        );
    END IF;

    -- Archive status change audit
    IF (OLD.archived_at IS NULL AND NEW.archived_at IS NOT NULL) THEN
        INSERT INTO public.lead_activities (
            lead_id,
            actor_id,
            activity_type,
            description,
            metadata
        ) VALUES (
            NEW.id,
            auth.uid(),
            'archived',
            'Lead was archived',
            '{}'::jsonb
        );
    ELSIF (OLD.archived_at IS NOT NULL AND NEW.archived_at IS NULL) THEN
        INSERT INTO public.lead_activities (
            lead_id,
            actor_id,
            activity_type,
            description,
            metadata
        ) VALUES (
            NEW.id,
            auth.uid(),
            'restored',
            'Lead was restored from archive',
            '{}'::jsonb
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_lead_status_audit ON public.leads;
CREATE TRIGGER trg_lead_status_audit
AFTER UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.log_lead_status_change();


-- 6. SECURITY & AUTHORIZATION FUNCTIONS (SECURITY DEFINER)

-- Helper: Check if current authenticated user is an active team member
CREATE OR REPLACE FUNCTION public.is_active_team_member()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.team_members
        WHERE id = auth.uid()
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper: Check if current authenticated user is an active owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.team_members
        WHERE id = auth.uid()
        AND role = 'owner'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper: Check if current user has permission to access a specific lead
CREATE OR REPLACE FUNCTION public.can_access_lead(target_lead_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Owners can access all leads
    IF public.is_owner() THEN
        RETURN true;
    END IF;

    -- Staff can access leads assigned to them or unassigned leads
    RETURN EXISTS (
        SELECT 1 FROM public.leads
        WHERE id = target_lead_id
        AND (
            assigned_to = auth.uid()
            OR assigned_to IS NULL
        )
    ) AND public.is_active_team_member();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- 7. ROW LEVEL SECURITY (RLS) POLICIES — STRICT LEAST PRIVILEGE

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- 7.1 Team Members Policies
-- Active team members can read team profiles (for assignments, names)
CREATE POLICY "Team members can view team directory"
ON public.team_members FOR SELECT
TO authenticated
USING (public.is_active_team_member());

-- Only Owners can invite, modify, or deactivate team members
CREATE POLICY "Owners can manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_owner())
WITH CHECK (public.is_owner());


-- 7.2 Leads Policies
-- Anonymous visitors: Strictly NO direct SELECT/UPDATE/DELETE. Public submissions insert via Edge Function (Service Role)
-- Owners: Can SELECT, INSERT, UPDATE, DELETE all leads
CREATE POLICY "Owners have full access to all leads"
ON public.leads FOR ALL
TO authenticated
USING (public.is_owner())
WITH CHECK (public.is_owner());

-- Staff: Can SELECT assigned leads or unassigned leads
CREATE POLICY "Staff can view assigned and unassigned leads"
ON public.leads FOR SELECT
TO authenticated
USING (
    public.is_active_team_member()
    AND (assigned_to = auth.uid() OR assigned_to IS NULL)
);

-- Staff: Can UPDATE assigned leads (status, notes, etc.)
CREATE POLICY "Staff can update assigned leads"
ON public.leads FOR UPDATE
TO authenticated
USING (
    public.is_active_team_member()
    AND assigned_to = auth.uid()
)
WITH CHECK (
    public.is_active_team_member()
    AND assigned_to = auth.uid()
);


-- 7.3 Status History Policies
CREATE POLICY "Team can view status history for accessible leads"
ON public.lead_status_history FOR SELECT
TO authenticated
USING (public.can_access_lead(lead_id));

CREATE POLICY "Team can insert status history for accessible leads"
ON public.lead_status_history FOR INSERT
TO authenticated
WITH CHECK (public.can_access_lead(lead_id));


-- 7.4 Lead Notes Policies
CREATE POLICY "Team can view notes for accessible leads"
ON public.lead_notes FOR SELECT
TO authenticated
USING (public.can_access_lead(lead_id));

CREATE POLICY "Team can add notes to accessible leads"
ON public.lead_notes FOR INSERT
TO authenticated
WITH CHECK (
    public.can_access_lead(lead_id)
    AND auth_id = auth.uid()
);

CREATE POLICY "Authors and owners can update their notes"
ON public.lead_notes FOR UPDATE
TO authenticated
USING (
    author_id = auth.uid() OR public.is_owner()
)
WITH CHECK (
    author_id = auth.uid() OR public.is_owner()
);

CREATE POLICY "Authors and owners can delete their notes"
ON public.lead_notes FOR DELETE
TO authenticated
USING (
    author_id = auth.uid() OR public.is_owner()
);


-- 7.5 Lead Activities Stream Policies
CREATE POLICY "Team can view activity history for accessible leads"
ON public.lead_activities FOR SELECT
TO authenticated
USING (public.can_access_lead(lead_id));

CREATE POLICY "Team can record activity for accessible leads"
ON public.lead_activities FOR INSERT
TO authenticated
WITH CHECK (public.can_access_lead(lead_id));


-- 7.6 Notification Logs Policies
CREATE POLICY "Team can view notification delivery status for accessible leads"
ON public.notification_logs FOR SELECT
TO authenticated
USING (public.can_access_lead(lead_id));

