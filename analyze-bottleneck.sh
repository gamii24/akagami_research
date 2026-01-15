#!/bin/bash

echo "=== ボトルネック分析 ==="
echo ""

echo "【1. JavaScriptファイルサイズ】"
for f in public/static/*.js; do
  name=$(basename "$f")
  size=$(wc -c < "$f")
  lines=$(wc -l < "$f")
  printf "  %-25s %6d KB  %5d lines\n" "$name" $((size / 1024)) "$lines"
done | sort -k2 -rn

echo ""
echo "【2. auth.jsの依存関係】"
echo "  checkAuthStatus関数の処理:"
grep -A20 "async function checkAuthStatus" public/static/auth.js | head -21

echo ""
echo "【3. CDN読み込み】"
echo "  Tailwind CSS: ~100KB (解析・実行に時間がかかる)"
echo "  Axios: ~14KB"

echo ""
echo "=== 分析完了 ==="
