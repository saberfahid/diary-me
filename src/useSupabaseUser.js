import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useSupabaseUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then(({ data }) => {
      console.log('useSupabaseUser: Initial session:', data?.session?.user);
      setUser(data?.session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useSupabaseUser: Auth state change, user:', session?.user);
      setUser(session?.user || null);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);
  return user;
}
