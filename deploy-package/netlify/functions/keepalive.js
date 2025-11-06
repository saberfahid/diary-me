// Netlify serverless function: keepalive.js
// Place this file in /netlify/functions/keepalive.js

const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      statusCode: 500,
      body: 'Supabase environment variables not set.'
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    // Minimal, safe read: select one row from a small table (e.g., diary_entries)
    const { data, error } = await supabase
      .from('diary_entries')
      .select('id')
      .limit(1);
    if (error) {
      return {
        statusCode: 500,
        body: 'Supabase error: ' + error.message
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Supabase keepalive successful', rowCount: data.length })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Unexpected error: ' + err.message
    };
  }
};
