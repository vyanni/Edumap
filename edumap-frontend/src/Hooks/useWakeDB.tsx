import { useEffect } from 'react';
import { supabase } from '../Authentication/supabaseClient';

export default function useWakeDB() {
  useEffect(() => {
    // lightweight query to wake the DB
    // Using an anonymous query that doesn't require RLS policies
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .limit(1)
      .then(() => {
        console.log('Supabase awakened');
      })
      .catch(err => {
        console.warn('Could not wake DB:', err);
        // Try alternative method if regular query fails
        supabase.auth.getSession()
          .then(() => console.log('Supabase session check completed'))
          .catch(e => console.warn('Supabase check failed:', e));
      });
  }, []);
}