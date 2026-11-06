// ==============================================================================
// SR STUDIO — ADMIN AUTHENTICATION CONTEXT
// File: src/admin/context/AuthContext.tsx
// ==============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { TeamMember, TeamRole } from '../../types/admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: TeamMember | null;
  role: TeamRole | null;
  isOwner: boolean;
  isActive: boolean;
  loading: boolean;
  isConfigured: boolean;
  isBootstrapped: boolean | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  bootstrapOwner: (fullName: string, email: string, password: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBootstrapped, setIsBootstrapped] = useState<boolean | null>(null);

  const fetchProfile = async (userId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Failed to load team profile:', error.message);
        setProfile(null);
      } else {
        setProfile(data as TeamMember | null);
      }
    } catch (err) {
      console.warn('[AuthContext] Profile load error:', err);
      setProfile(null);
    }
  };

  const checkBootstrapStatus = async () => {
    if (!isSupabaseConfigured) {
      setIsBootstrapped(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_bootstrap_status');
      if (error) {
        // Fallback: check count directly
        const { count } = await supabase
          .from('team_members')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'owner');
        setIsBootstrapped((count || 0) > 0);
      } else {
        setIsBootstrapped(Boolean(data?.is_bootstrapped));
      }
    } catch {
      setIsBootstrapped(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setIsBootstrapped(false);
      return;
    }

    checkBootstrapStatus();

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen to auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
      checkBootstrapStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign-in failed.' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const bootstrapOwner = async (fullName: string, email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured yet.' };
    }

    try {
      // 1. Sign up the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (authError || !authData.user) {
        return { error: authError?.message || 'Failed to create owner user account.' };
      }

      // If email confirmation is required by Supabase project settings
      if (authData.session) {
        // User is logged in automatically
        const { error: rpcError } = await supabase.rpc('bootstrap_first_owner', {
          user_full_name: fullName.trim(),
        });

        if (rpcError) {
          return { error: rpcError.message };
        }

        await fetchProfile(authData.user.id);
        setIsBootstrapped(true);
        return {};
      } else {
        return {
          error: 'Owner account created. Please confirm the confirmation email sent to your inbox before signing in.',
        };
      }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Bootstrap failed.' };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const role = profile?.role ?? null;
  const isOwner = role === 'owner';
  const isActive = Boolean(profile?.is_active);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isOwner,
        isActive,
        loading,
        isConfigured: isSupabaseConfigured,
        isBootstrapped,
        signIn,
        signOut,
        bootstrapOwner,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

