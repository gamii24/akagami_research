#!/bin/bash

echo "=== API エンドポイントテスト ==="
echo ""

# Test public endpoints
echo "1. カテゴリ取得 (/api/categories)"
curl -s https://akagami.net/api/categories | jq -r 'if type=="array" then "✅ OK: \(length) categories" else "❌ ERROR" end'

echo ""
echo "2. ニュース取得 (/api/news)"
curl -s https://akagami.net/api/news | jq -r 'if type=="array" then "✅ OK: \(length) news articles" else "❌ ERROR" end'

echo ""
echo "3. FAQ取得 (/api/instagram-faq)"
curl -s "https://akagami.net/api/instagram-faq?category=instagram" | jq -r 'if type=="array" then "✅ OK: \(length) FAQs" else "❌ ERROR" end'

echo ""
echo "4. Google検索API (/api/google-search)"
result=$(curl -s -X POST https://akagami.net/api/google-search \
  -H "Content-Type: application/json" \
  -d '{"keyword":"Instagram"}' | jq -r '.error // "✅ OK"')
echo "$result"

echo ""
echo "=== テスト完了 ==="
