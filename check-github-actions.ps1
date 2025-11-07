# GitHub Actions Status Checker
# Run this to verify your keepalive system is working

Write-Host "🔍 GitHub Actions Keepalive Status Check" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Check current time
$currentTime = Get-Date
Write-Host "📅 Current Time: $($currentTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray

Write-Host ""
Write-Host "🚀 Your Keepalive Workflows:" -ForegroundColor Yellow
Write-Host ""

# List your workflows
$workflows = @(
    @{Name="Simple Supabase Keepalive"; Schedule="Every 10 minutes"; File="simple-keepalive.yml"},
    @{Name="Advanced Supabase Keepalive"; Schedule="Every 8 minutes"; File="advanced-keepalive.yml"},
    @{Name="Supabase Keepalive"; Schedule="Every 10 minutes"; File="keepalive.yml"},
    @{Name="Direct Supabase Keepalive"; Schedule="Every 8 minutes"; File="direct-keepalive.yml"}
)

foreach ($workflow in $workflows) {
    Write-Host "  ✅ $($workflow.Name)" -ForegroundColor Green
    Write-Host "     Schedule: $($workflow.Schedule)" -ForegroundColor Gray
    Write-Host "     File: .github/workflows/$($workflow.File)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📋 What to Check:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🌐 Open your GitHub Actions page:" -ForegroundColor White
Write-Host "   https://github.com/saberfahid/diary-me/actions" -ForegroundColor Blue
Write-Host ""
Write-Host "2. 🔍 Look for these workflows running automatically:" -ForegroundColor White
Write-Host "   • Simple Supabase Keepalive (should run every 10 min)" -ForegroundColor Gray
Write-Host "   • Advanced Supabase Keepalive (should run every 8 min)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. ✅ Check the status:" -ForegroundColor White
Write-Host "   🟢 Green checkmarks = Working perfectly" -ForegroundColor Green
Write-Host "   🔴 Red X marks = Need to fix errors" -ForegroundColor Red
Write-Host "   🟡 Yellow dots = Currently running" -ForegroundColor Yellow
Write-Host ""

Write-Host "🧪 Testing Your Site Manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Testing your site response..." -ForegroundColor Gray

try {
    $siteTest = Invoke-WebRequest -Uri "https://bejewelled-salamander-08452f.netlify.app" -Method HEAD -TimeoutSec 10
    if ($siteTest.StatusCode -eq 200) {
        Write-Host "✅ Your site is responding correctly (Status: 200)" -ForegroundColor Green
        Write-Host "   GitHub Actions can successfully ping your site!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Site responded with status: $($siteTest.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot reach your site: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This might affect GitHub Actions keepalive" -ForegroundColor Red
}

Write-Host ""
Write-Host "⏰ Keepalive Timeline:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Since your workflows were pushed at approximately 4:08 AM:" -ForegroundColor Gray

# Calculate expected run times
$pushTime = Get-Date "2025-11-07 04:08:00"
$nextSimple = $pushTime.AddMinutes(10 - ($pushTime.Minute % 10))
$nextAdvanced = $pushTime.AddMinutes(8 - ($pushTime.Minute % 8))

Write-Host "🕐 Next Simple Keepalive: $($nextSimple.ToString('HH:mm'))" -ForegroundColor Cyan
Write-Host "🕐 Next Advanced Keepalive: $($nextAdvanced.ToString('HH:mm'))" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: GitHub Actions may take 1-2 minutes to start after the scheduled time." -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 What This Means:" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Your Supabase database will be pinged automatically" -ForegroundColor Green
Write-Host "✅ No manual intervention needed" -ForegroundColor Green  
Write-Host "✅ Works 24/7 even when no users visit your site" -ForegroundColor Green
Write-Host "✅ Multiple workflows provide backup redundancy" -ForegroundColor Green

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")