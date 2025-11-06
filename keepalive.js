const fs = require('fs');
// keepalive.js
// Scheduled job to keep Supabase DB warm by running a tiny, safe read every 5–60 minutes

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase project URL and service role key
const SUPABASE_URL = 'https://jacjddyduizteupvbxop.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphY2pkZHlkdWl6dGV1cHZieG9wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ0NjkxMywiZXhwIjoyMDc4MDIyOTEzfQ.JUpmSYLpVGhnYlNI0dDOG0SaaRpiOghDLn365fLg23k';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function keepAlive() {
  // Tiny, safe read: just count rows in a small table
  const { count, error } = await supabase
    .from('diary_entries')
    .select('id', { count: 'exact', head: true });
  if (error) console.error('Keepalive error:', error);
  else {
    console.log('Supabase keepalive pinged:', count, 'rows');
    fs.appendFileSync('keepalive.log', new Date().toISOString() + ' keepalive ran\n');
  }
}

keepAlive();
