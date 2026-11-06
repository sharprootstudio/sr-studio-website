-- ==============================================================================
-- SR STUDIO — DATABASE MIGRATION: FIRST-OWNER BOOTSTRAP & SECURE ONBOARDING
-- File: 20261106000002_bootstrap_first_owner.sql
-- ==============================================================================

-- 1. SECURE FIRST-OWNER BOOTSTRAP FUNCTION
-- This procedure enables the agency founder/owner to claim the primary owner role
-- upon their initial sign-up, WITHOUT public self-registration backdoors or hardcoded passwords.
-- Once the first owner is established, this procedure permanently locks itself against further use.

CREATE OR REPLACE FUNCTION public.bootstrap_first_owner(user_full_name TEXT)
RETURNS JSONB AS $$
DECLARE
    current_user_id UUID := auth.uid();
    user_email TEXT;
    existing_owner_count INT;
    result JSONB;
BEGIN
    -- 1. Ensure user is authenticated via Supabase Auth
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required: You must be signed in to bootstrap the first owner.';
    END IF;

    -- 2. Fetch the caller's email directly from auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
    IF user_email IS NULL THEN
        RAISE EXCEPTION 'User account not found in authentication system.';
    END IF;

    -- 3. Strict Check: Are there any active or existing owners?
    SELECT COUNT(*) INTO existing_owner_count
    FROM public.team_members
    WHERE role = 'owner';

    IF existing_owner_count > 0 THEN
        RAISE EXCEPTION 'Bootstrap locked: The first owner for SR Studio has already been claimed. New team members must be invited by an existing owner.';
    END IF;

    -- 4. Insert or update the calling user as the primary Owner
    INSERT INTO public.team_members (
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        current_user_id,
        user_email,
        COALESCE(NULLIF(TRIM(user_full_name), ''), 'SR Studio Owner'),
        'owner',
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'owner',
        is_active = true,
        full_name = EXCLUDED.full_name,
        updated_at = NOW();

    result := jsonb_build_object(
        'success', true,
        'message', 'Initial agency owner successfully established.',
        'user_id', current_user_id,
        'email', user_email,
        'role', 'owner'
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. OWNER TEAM MANAGEMENT RPC: INVITE OR REGISTER TEAM MEMBER
-- Only existing active owners can register or invite new staff members
CREATE OR REPLACE FUNCTION public.admin_register_team_member(
    target_user_id UUID,
    target_email TEXT,
    target_full_name TEXT,
    target_role public.team_role DEFAULT 'staff'
)
RETURNS JSONB AS $$
BEGIN
    -- Strict authorization check
    IF NOT public.is_owner() THEN
        RAISE EXCEPTION 'Access Denied: Only active agency owners can add team members.';
    END IF;

    INSERT INTO public.team_members (
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        target_user_id,
        LOWER(TRIM(target_email)),
        TRIM(target_full_name),
        target_role,
        true,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = true,
        updated_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Team member registered successfully.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. CHECK BOOTSTRAP STATUS RPC
-- Publicly returns whether the initial owner has been bootstrapped
-- Used by the login UI to display "Initial Setup Required" vs standard team sign-in
CREATE OR REPLACE FUNCTION public.get_bootstrap_status()
RETURNS JSONB AS $$
DECLARE
    owner_count INT;
BEGIN
    SELECT COUNT(*) INTO owner_count
    FROM public.team_members
    WHERE role = 'owner';

    RETURN jsonb_build_object(
        'is_bootstrapped', (owner_count > 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

