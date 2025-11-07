// Netlify serverless function: keepalive.js
// Keeps Supabase database awake by performing lightweight queries

const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  console.log('Keepalive function triggered at:', new Date().toISOString());
  
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing environment variables');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Supabase environment variables not set',
        timestamp: new Date().toISOString()
      })
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    console.log('Attempting Supabase connection...');
    
    // Try multiple lightweight operations to ensure database stays active
    const operations = [
      // 1. Simple count query
      supabase.from('diary_entries').select('id', { count: 'exact', head: true }),
      // 2. Check if tables exist by querying system info
      supabase.rpc('version', {}) // Built-in function that should always work
    ];

    const results = await Promise.allSettled(operations);
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`Keepalive operations completed: ${successCount}/${operations.length} successful`);

    // If at least one operation succeeded, consider it a success
    if (successCount > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Supabase keepalive successful',
          operations: successCount,
          timestamp: new Date().toISOString(),
          status: 'healthy'
        })
      };
    } else {
      // All operations failed
      console.error('All keepalive operations failed');
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ 
          error: 'All Supabase operations failed',
          timestamp: new Date().toISOString(),
          status: 'unhealthy'
        })
      };
    }
  } catch (err) {
    console.error('Keepalive error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Unexpected error: ' + err.message,
        timestamp: new Date().toISOString(),
        status: 'error'
      })
    };
  }
};
