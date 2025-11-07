# Supabase Keepalive Setup Script for Windows
# Run this after deploying to Netlify and pushing to GitHub

Write-Host "🔧 Supabase Keepalive Setup" -ForegroundColor Cyan
Write-Host "=========================="

# Get Netlify site URL
Write-Host ""
Write-Host "📝 Step 1: Configure your Netlify site URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please enter your Netlify site URL (just the site name, not the full URL):"
Write-Host "Example: if your site is https://amazing-site-123.netlify.app, enter: amazing-site-123" -ForegroundColor Gray
$NETLIFY_SITE = Read-Host "Netlify site name"

if ([string]::IsNullOrWhiteSpace($NETLIFY_SITE)) {
    Write-Host "❌ Site name cannot be empty" -ForegroundColor Red
    exit 1
}

# Update the workflow files
Write-Host ""
Write-Host "🔄 Updating GitHub Actions workflows..." -ForegroundColor Yellow

try {
    # Update basic keepalive
    $keepaliveContent = Get-Content ".github/workflows/keepalive.yml" -Raw
    $keepaliveContent = $keepaliveContent -replace "YOUR_NETLIFY_SITE", $NETLIFY_SITE
    Set-Content ".github/workflows/keepalive.yml" $keepaliveContent

    # Update advanced keepalive
    $advancedContent = Get-Content ".github/workflows/advanced-keepalive.yml" -Raw
    $advancedContent = $advancedContent -replace "YOUR_NETLIFY_SITE", $NETLIFY_SITE
    Set-Content ".github/workflows/advanced-keepalive.yml" $advancedContent

    Write-Host "✅ Workflow files updated" -ForegroundColor Green
} catch {
    Write-Host "❌ Error updating workflow files: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test the keepalive endpoint
Write-Host ""
Write-Host "🧪 Testing keepalive endpoint..." -ForegroundColor Yellow
$KEEPALIVE_URL = "https://$NETLIFY_SITE.netlify.app/.netlify/functions/keepalive"

Write-Host "Testing: $KEEPALIVE_URL" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $KEEPALIVE_URL -Method GET -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Keepalive endpoint is working!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Keepalive endpoint test failed (Status: $($response.StatusCode))" -ForegroundColor Red
        Write-Host "Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Keepalive endpoint test failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Make sure you've deployed the updated function to Netlify"
    Write-Host "2. Check that SUPABASE_URL and SUPABASE_ANON_KEY are set in Netlify environment variables"
    Write-Host "3. Verify your Netlify site name is correct: $NETLIFY_SITE"
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push these changes to GitHub:"
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Add Supabase keepalive automation'" -ForegroundColor Gray
Write-Host "   git push origin master" -ForegroundColor Gray
Write-Host ""
Write-Host "2. The GitHub Actions will start running automatically every 8-10 minutes"
Write-Host "3. You can manually trigger them from the GitHub Actions tab for testing"
Write-Host ""
Write-Host "4. Monitor the Actions tab in your GitHub repository to see the keepalive logs"
Write-Host ""
Write-Host "🎉 Setup complete! Your Supabase database will now stay awake automatically." -ForegroundColor Green

# Pause to keep window open
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")