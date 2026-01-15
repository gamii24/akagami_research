#!/bin/bash

echo "=== 最適化後の読み込み検証 ==="
echo ""

echo "【よくある質問ページ】"
echo "読み込まれるJSファイル:"
curl -s http://localhost:3000/sns-faq | grep -o '<script src="[^"]*"' | sed 's/<script src="/  - /' | sed 's/"$//'
echo ""
total=$(curl -s http://localhost:3000/sns-faq | grep -o '<script src="/static/[^"]*"' | wc -l)
echo "静的JSファイル数: $total"
echo ""

echo "【キーワードチェックページ】"
echo "読み込まれるJSファイル:"
curl -s http://localhost:3000/question-finder | grep -o '<script src="[^"]*"' | sed 's/<script src="/  - /' | sed 's/"$//'
echo ""
total=$(curl -s http://localhost:3000/question-finder | grep -o '<script src="/static/[^"]*"' | wc -l)
echo "静的JSファイル数: $total"
echo ""

echo "【最新ニュースページ（比較用）】"
echo "読み込まれるJSファイル:"
curl -s http://localhost:3000/news | grep -o '<script src="[^"]*"' | sed 's/<script src="/  - /' | sed 's/"$//'
echo ""
total=$(curl -s http://localhost:3000/news | grep -o '<script src="/static/[^"]*"' | wc -l)
echo "静的JSファイル数: $total"
