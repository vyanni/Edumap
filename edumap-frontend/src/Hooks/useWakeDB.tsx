import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useWakeDB() {
  useEffect(() => {
    // simple lightweight query to wake the DB
    supabase
      .from('users')       // or any small table
      .select('id')
      .limit(1)
      .then(() => {
        console.log('Supabase awakened');
      })
      .catch(err => console.warn('Could not wake DB', err));
  }, []);
}