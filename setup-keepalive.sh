#!/bin/bash
# Supabase Keepalive Setup Script
# Run this after deploying to Netlify and pushing to GitHub

echo "🔧 Supabase Keepalive Setup"
echo "=========================="

# Get Netlify site URL
echo ""
echo "📝 Step 1: Configure your Netlify site URL"
echo ""
echo "Please enter your Netlify site URL (just the site name, not the full URL):"
echo "Example: if your site is https://amazing-site-123.netlify.app, enter: amazing-site-123"
read -p "Netlify site name: " NETLIFY_SITE

if [ -z "$NETLIFY_SITE" ]; then
    echo "❌ Site name cannot be empty"
    exit 1
fi

# Update the workflow files
echo ""
echo "🔄 Updating GitHub Actions workflows..."

# Update basic keepalive
sed -i "s/YOUR_NETLIFY_SITE/$NETLIFY_SITE/g" .github/workflows/keepalive.yml
sed -i "s/YOUR_NETLIFY_SITE/$NETLIFY_SITE/g" .github/workflows/advanced-keepalive.yml

echo "✅ Workflow files updated"

# Test the keepalive endpoint
echo ""
echo "🧪 Testing keepalive endpoint..."
KEEPALIVE_URL="https://${NETLIFY_SITE}.netlify.app/.netlify/functions/keepalive"

echo "Testing: $KEEPALIVE_URL"
RESPONSE=$(curl -s -w "\n%{http_code}" "$KEEPALIVE_URL" 2>/dev/null || echo "failed\n000")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Keepalive endpoint is working!"
    echo "Response: $BODY"
else
    echo "❌ Keepalive endpoint test failed (Status: $HTTP_CODE)"
    echo "Response: $BODY"
    echo ""
    echo "🔍 Troubleshooting tips:"
    echo "1. Make sure you've deployed the updated function to Netlify"
    echo "2. Check that SUPABASE_URL and SUPABASE_ANON_KEY are set in Netlify environment variables"
    echo "3. Verify your Netlify site name is correct: $NETLIFY_SITE"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Commit and push these changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add Supabase keepalive automation'"
echo "   git push origin master"
echo ""
echo "2. The GitHub Actions will start running automatically every 8-10 minutes"
echo "3. You can manually trigger them from the GitHub Actions tab for testing"
echo ""
echo "4. Monitor the Actions tab in your GitHub repository to see the keepalive logs"
echo ""
echo "🎉 Setup complete! Your Supabase database will now stay awake automatically."