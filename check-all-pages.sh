#!/bin/bash

echo "=== Akagami.net 全ページ調査 ==="
echo ""

PAGES=(
  "/"
  "/calendar/1"
  "/calendar/2"
  "/calendar/3"
  "/calendar/4"
  "/calendar/5"
  "/calendar/6"
  "/calendar/7"
  "/calendar/8"
  "/calendar/9"
  "/calendar/10"
  "/calendar/11"
  "/calendar/12"
  "/news"
  "/mypage"
  "/question-finder"
  "/sns-faq"
  "/admin"
  "/admin/news"
  "/admin/instagram-faq"
)

for page in "${PAGES[@]}"; do
  echo "Testing: https://akagami.net$page"
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://akagami.net$page")
  time=$(curl -s -o /dev/null -w "%{time_total}" "https://akagami.net$page")
  
  if [ "$status" = "200" ]; then
    echo "  ✅ HTTP $status - ${time}s"
  else
    echo "  ❌ HTTP $status - ${time}s"
  fi
done

echo ""
echo "=== JavaScript構文チェック ==="
for f in public/static/*.js; do
  filename=$(basename "$f")
  if node -c "$f" 2>&1 | grep -q "SyntaxError"; then
    echo "  ❌ $filename - 構文エラー"
    node -c "$f" 2>&1 | head -3
  else
    echo "  ✅ $filename"
  fi
done
