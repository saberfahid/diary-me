// Netlify serverless function to keep Supabase database awake
// Runs every 10-15 minutes via scheduled function

const https = require('https');

// Supabase configuration
const SUPABASE_URL = 'https://jacjddyduizteupvbxop.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphY2pkZHlkdWl6dGV1cHZieG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDY5MTMsImV4cCI6MjA3ODAyMjkxM30.WExcCa9S7vRg4Y29b16AiE8BpIsypMGhnmWhR00D7Nw';

// Function to make a lightweight query to keep database awake
async function keepSupabaseAwake() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'jacjddyduizteupvbxop.supabase.co',
      port: 443,
      path: '/rest/v1/diary_entries?select=id&limit=1',
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = new Date().toISOString();
        console.log(`✅ Supabase keepalive successful at ${responseTime}`);
        console.log(`Status: ${res.statusCode}, Response time: ${data.length} bytes`);
        
        resolve({
          statusCode: res.statusCode,
          timestamp: responseTime,
          responseSize: data.length,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (error) => {
      console.error('❌ Supabase keepalive failed:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      console.error('❌ Supabase keepalive timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Netlify function handler
exports.handler = async (event, context) => {
  const startTime = Date.now();
  
  try {
    console.log('🚀 Starting Supabase keepalive function...');
    
    // Perform the keepalive query
    const result = await keepSupabaseAwake();
    
    const executionTime = Date.now() - startTime;
    
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      executionTimeMs: executionTime,
      supabaseStatus: result.statusCode,
      responseSize: result.responseSize,
      message: 'Supabase database successfully kept awake'
    };

    console.log('✅ Keepalive function completed:', response);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('❌ Keepalive function error:', error);

    const errorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message,
      message: 'Failed to keep Supabase awake'
    };

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(errorResponse)
    };
  }
};

// For scheduled execution (if using Netlify scheduled functions)
exports.scheduled = exports.handler;