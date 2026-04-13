import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Make sure to load env variables!
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);