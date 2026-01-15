#!/bin/bash

# Cloudflare Pages production URL
PROD_URL="https://akagami.net"
PASSWORD="TaylorAlisonSwift"

echo "🔐 Step 1: Login to production..."
LOGIN_RESPONSE=$(curl -s -X POST "${PROD_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"${PASSWORD}\"}" \
  -c prod_cookies.txt)

echo "$LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
  echo "✅ Login successful!"
  
  echo ""
  echo "📝 Step 2: Creating article..."
  
  # Create article using the payload
  CREATE_RESPONSE=$(curl -s -X POST "${PROD_URL}/api/admin/articles" \
    -H "Content-Type: application/json" \
    -b prod_cookies.txt \
    -d @article_payload_nocategory.json)
  
  echo "$CREATE_RESPONSE"
  
  if echo "$CREATE_RESPONSE" | grep -q "success"; then
    ARTICLE_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo ""
    echo "✅ Article created successfully!"
    echo "📊 Article ID: $ARTICLE_ID"
    echo ""
    echo "🔗 URLs:"
    echo "   • Article page: ${PROD_URL}/article/threads-us-case-study-2026"
    echo "   • Homepage: ${PROD_URL}"
    echo "   • Admin: ${PROD_URL}/admin/articles"
  else
    echo "❌ Failed to create article"
    echo "Response: $CREATE_RESPONSE"
  fi
else
  echo "❌ Login failed"
  echo "Response: $LOGIN_RESPONSE"
fi

# Clean up
rm -f prod_cookies.txt
