import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqogdmvfogaojyhptsgk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxb2dkbXZmb2dhb2p5aHB0c2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjI5MzIsImV4cCI6MjA2ODkzODkzMn0.j4R5eCLfD4ZMu-I-kuNOIZbDxqk1hjy6wdGXObhTMlE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
