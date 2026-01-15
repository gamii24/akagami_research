#!/bin/bash

echo "=== Akagami.net 最終チェック ==="
echo ""

echo "📋 全ページHTTPステータス"
for page in "/" "/calendar/1" "/news" "/mypage" "/question-finder" "/sns-faq" "/admin"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://akagami.net$page")
  if [ "$status" = "200" ]; then
    echo "  ✅ $page - HTTP $status"
  else
    echo "  ❌ $page - HTTP $status"
  fi
done

echo ""
echo "🔍 JavaScript構文チェック"
for f in public/static/*.js; do
  filename=$(basename "$f")
  if node -c "$f" 2>&1 | grep -q "SyntaxError"; then
    echo "  ❌ $filename"
  else
    echo "  ✅ $filename"
  fi
done

echo ""
echo "📊 データベース統計"
echo "  Users: $(npx wrangler d1 execute akagami-research-production --remote --command="SELECT COUNT(*) as count FROM users" 2>/dev/null | grep -o '"count":[0-9]*' | grep -o '[0-9]*')"
echo "  News: $(npx wrangler d1 execute akagami-research-production --remote --command="SELECT COUNT(*) as count FROM news_articles" 2>/dev/null | grep -o '"count":[0-9]*' | grep -o '[0-9]*')"
echo "  FAQs: $(npx wrangler d1 execute akagami-research-production --remote --command="SELECT COUNT(*) as count FROM instagram_faq" 2>/dev/null | grep -o '"count":[0-9]*' | grep -o '[0-9]*')"

echo ""
echo "🚀 デプロイ情報"
echo "  本番URL: https://akagami.net"
echo "  最新デプロイ: https://8a881d04.akagami-research.pages.dev"
echo "  ビルドサイズ: $(ls -lh dist/_worker.js | awk '{print $5}')"

echo ""
echo "=== チェック完了 ==="
