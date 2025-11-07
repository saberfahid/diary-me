# Test Keepalive Function
# Run this after redeploying to Netlify

Write-Host "🧪 Testing Keepalive Function..." -ForegroundColor Yellow
Write-Host ""

$url = "https://bejewelled-salamander-08452f.netlify.app/.netlify/functions/keepalive"
Write-Host "Testing URL: $url" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 30
    
    Write-Host "✅ SUCCESS! Function is working properly" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3
    
    if ($response.status -eq "healthy") {
        Write-Host ""
        Write-Host "🎉 Keepalive system is operational!" -ForegroundColor Green
        Write-Host "Your Supabase database will stay awake automatically." -ForegroundColor Green
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "❌ FAILED! Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($statusCode -eq 404) {
        Write-Host ""
        Write-Host "💡 This means the function isn't deployed yet." -ForegroundColor Yellow
        Write-Host "Make sure you uploaded the diary-me-netlify-deploy-updated.zip to Netlify" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")