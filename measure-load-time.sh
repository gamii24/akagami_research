#!/bin/bash

echo "=== ページ読み込み速度測定 ==="
echo ""

measure_page() {
  local url=$1
  local name=$2
  
  echo "測定中: $name"
  
  # HTML取得時間
  html_time=$(curl -w "%{time_total}" -o /dev/null -s "$url")
  
  # HTMLサイズ
  html_size=$(curl -s "$url" | wc -c)
  
  # 読み込まれるJSファイル数
  js_count=$(curl -s "$url" | grep -o '<script src="[^"]*"' | wc -l)
  
  # 外部JSファイル一覧
  js_files=$(curl -s "$url" | grep -o '<script src="[^"]*"' | sed 's/<script src="//' | sed 's/"$//')
  
  echo "  HTML読み込み: ${html_time}秒"
  echo "  HTMLサイズ: $((html_size / 1024))KB"
  echo "  JSファイル数: $js_count"
  echo "  JSファイル:"
  echo "$js_files" | while read file; do
    if [[ $file == http* ]]; then
      echo "    - $file (CDN)"
    else
      size=$(curl -s "https://akagami.net$file" | wc -c)
      echo "    - $file ($((size / 1024))KB)"
    fi
  done
  echo ""
}

measure_page "https://akagami.net/news" "最新ニュース"
measure_page "https://akagami.net/sns-faq" "よくある質問"
measure_page "https://akagami.net/question-finder" "キーワードチェック"

echo "=== 測定完了 ==="
