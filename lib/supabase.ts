import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vacwspdonfoflhtpfdex.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'YOUR_COPIED_ANON_KEY_HERE'
  );
};

export interface ApplicationRecord {
  id: string;
  student_email: string;
  student_name: string;
  institution: string;
  route: string;
  id_card_url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at?: string;
}
