# Supabase Keepalive System

This directory contains an automated system to keep your Supabase database awake using GitHub Actions, eliminating the need for external services.

## 📁 Files Overview

- **`netlify/functions/keepalive.js`** - Enhanced Netlify serverless function that pings Supabase
- **`.github/workflows/keepalive.yml`** - Basic GitHub Actions workflow (every 10 minutes)
- **`.github/workflows/advanced-keepalive.yml`** - Advanced workflow with retry logic (every 8 minutes)
- **`setup-keepalive.ps1`** - Windows PowerShell setup script
- **`setup-keepalive.sh`** - Unix/Linux setup script

## 🚀 Quick Setup

### 1. Deploy to Netlify
Make sure your app is deployed to Netlify with the updated `keepalive.js` function.

### 2. Set Environment Variables in Netlify
Go to your Netlify site dashboard → Environment Variables and add:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Configure GitHub Actions
Run the setup script for your platform:

**Windows PowerShell:**
```powershell
.\setup-keepalive.ps1
```

**Linux/Mac:**
```bash
chmod +x setup-keepalive.sh
./setup-keepalive.sh
```

**Manual Setup:**
Edit both workflow files and replace `YOUR_NETLIFY_SITE` with your actual Netlify site name.

### 4. Push to GitHub
```bash
git add .
git commit -m "Add Supabase keepalive automation"
git push origin master
```

## ⚙️ How It Works

### The Keepalive Function
- Performs lightweight Supabase operations every few minutes
- Uses multiple fallback queries to ensure database activity
- Returns proper JSON responses with status information
- Handles errors gracefully with detailed logging

### GitHub Actions Workflows
- **Basic**: Pings every 10 minutes (GitHub's minimum for cron)
- **Advanced**: Pings every 8 minutes with retry logic and better error handling
- Runs automatically without requiring external services
- Logs all activity for monitoring

### Database Operations
The keepalive function performs these lightweight operations:
1. Count query on `diary_entries` table
2. Version check using built-in Supabase functions
3. Minimal data transfer to keep connection active

## 📊 Monitoring

### GitHub Actions Logs
1. Go to your GitHub repository
2. Click the "Actions" tab
3. Select "Supabase Keepalive" or "Advanced Supabase Keepalive"
4. View individual run logs to see keepalive status

### Netlify Function Logs
1. Go to your Netlify site dashboard
2. Navigate to Functions → keepalive
3. View function logs for detailed execution information

### Manual Testing
Test the keepalive endpoint directly:
```bash
curl https://your-site.netlify.app/.netlify/functions/keepalive
```

Expected response:
```json
{
  "message": "Supabase keepalive successful",
  "operations": 2,
  "timestamp": "2025-11-07T10:30:00.000Z",
  "status": "healthy"
}
```

## 🔧 Configuration Options

### Changing Frequency
Edit the cron schedule in the workflow files:
- `*/8 * * * *` = every 8 minutes
- `*/10 * * * *` = every 10 minutes
- `*/15 * * * *` = every 15 minutes

### Adding More Operations
You can extend the keepalive function to perform additional database operations:

```javascript
const operations = [
  supabase.from('diary_entries').select('id', { count: 'exact', head: true }),
  supabase.from('your_other_table').select('*').limit(1),
  // Add more operations as needed
];
```

### Customizing Retry Logic
The advanced workflow includes configurable retry settings:
- `MAX_RETRIES`: Number of retry attempts (default: 3)
- `RETRY_DELAY`: Seconds between retries (default: 30)

## 🚨 Troubleshooting

### Keepalive Function Returns 500
1. Check Netlify environment variables are set correctly
2. Verify Supabase URL and key are valid
3. Check Netlify function logs for specific error messages

### GitHub Actions Failing
1. Verify the Netlify site URL is correct in workflow files
2. Check if your Netlify site is accessible publicly
3. Review the Actions logs for specific error details

### White Page on Endpoint
1. Check browser developer tools for JavaScript errors
2. Test with curl instead of browser: `curl -v https://your-site.netlify.app/.netlify/functions/keepalive`
3. Verify the function is deployed and environment variables are set

### Database Still Going to Sleep
1. Increase ping frequency (reduce cron interval)
2. Add more database operations to the keepalive function
3. Check GitHub Actions are running successfully

## 💡 Best Practices

1. **Use the Advanced Workflow**: It includes retry logic and better error handling
2. **Monitor Regularly**: Check Actions logs weekly to ensure keepalives are working
3. **Keep Operations Lightweight**: Don't perform heavy database operations in keepalive
4. **Set Proper Timeouts**: Keep function execution under 10 seconds
5. **Log Everything**: The enhanced function includes comprehensive logging

## 📈 Benefits

- ✅ **No External Dependencies**: Uses only GitHub Actions (free for public repos)
- ✅ **Automatic**: Runs without manual intervention
- ✅ **Reliable**: Multiple retry attempts and fallback operations
- ✅ **Monitorable**: Comprehensive logging and status reporting
- ✅ **Cost-Effective**: Free solution using existing services
- ✅ **Scalable**: Easy to adjust frequency and operations as needed

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions and Netlify function logs
3. Test the keepalive endpoint manually
4. Verify all environment variables are set correctly