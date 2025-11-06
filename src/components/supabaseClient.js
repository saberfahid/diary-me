import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jacjddyduizteupvbxop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphY2pkZHlkdWl6dGV1cHZieG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDY5MTMsImV4cCI6MjA3ODAyMjkxM30.WExcCa9S7vRg4Y29b16AiE8BpIsypMGhnmWhR00D7Nw';

export const supabase = createClient(supabaseUrl, supabaseKey);
