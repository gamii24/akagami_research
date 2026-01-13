# 🚀 Akagami Research - クイックリファレンス

---

## 🔗 重要なURL

| 項目 | URL |
|------|-----|
| **公開サイト** | https://akagami.net/ |
| **管理画面** | https://akagami.net/admin |
| **Google Analytics** | https://analytics.google.com/analytics/web/#/p13287130556/reports/intelligenthome |
| **Cloudflare Dashboard** | https://dash.cloudflare.com/ |

---

## 🔐 ログイン情報

### 管理画面
```
URL: https://akagami.net/admin
パスワード: akagami-admin-2024
セッション: 30日間自動ログイン
```

### Google Analytics
```
測定ID: G-JPMZ82RMGG
プロパティID: 13287130556
```

### Cloudflare D1
```
データベース名: akagami-research-production
データベースID: c5d4dce7-e94e-489a-880f-36e6056f74c6
```

---

## 📋 管理画面でできること

1. ✅ **PDF追加・編集・削除**
2. ✅ **テキスト一括アップロード**（コピペで複数PDF登録）
3. ✅ **カテゴリ管理**（追加・編集・削除・並び替え）
4. ✅ **タグ管理**（追加・編集・削除）
5. ✅ **除外タグ管理**（表示したくないタグを非表示）
6. ✅ **アクセス解析**（人気PDFトップ10、カテゴリ別統計）

---

## 📊 カテゴリID一覧

| ID | カテゴリ名 | ID | カテゴリ名 |
|----|----------|----|---------| 
| 1 | YouTube | 7 | X |
| 2 | Threads | 8 | マーケティング |
| 3 | Podcast | 9 | その他 |
| 4 | LINE公式 | 10 | 生成AI |
| 5 | Instagram | 11 | 画像&動画生成 |
| 6 | TikTok | 19 | note |
|   |          | 20 | ブログ |
|   |          | 22 | AEO対策 |

---

## 🎯 よく使うコマンド

### デプロイ
```bash
npm run build
npx wrangler pages deploy dist --project-name akagami-research
```

### データベース確認
```bash
# ローカル
npx wrangler d1 execute akagami-research-production --local --command="SELECT * FROM pdfs LIMIT 10"

# 本番
npx wrangler d1 execute akagami-research-production --command="SELECT COUNT(*) FROM pdfs"
```

### 環境変数設定
```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name akagami-research
npx wrangler pages secret put JWT_SECRET --project-name akagami-research
```

---

## 🔍 トラブルシューティング

| 問題 | 解決方法 |
|------|---------|
| ログインできない | パスワード確認: `akagami-admin-2024` |
| PDFが表示されない | D1接続確認、ブラウザキャッシュクリア |
| デプロイ失敗 | `npm run build` でビルド確認 |
| GA4データが見えない | 測定ID確認、広告ブロッカー無効化 |

---

## 📞 SNSアカウント

| SNS | ユーザー名 | URL |
|-----|----------|-----|
| Instagram | @akagami_sns | https://www.instagram.com/akagami_sns/ |
| X (Twitter) | @akagami0124 | https://twitter.com/akagami0124 |
| YouTube | @akagami_sns | https://www.youtube.com/@akagami_sns |
| Threads | @akagami0124 | https://www.threads.com/@akagami0124 |
| note | akagami_sns | https://note.com/akagami_sns |

---

## 🛡️ セキュリティスコア

| 項目 | スコア |
|------|--------|
| Mozilla Observatory | A+ |
| Security Headers | A+ |
| WCAG 2.1 | Level AA |

---

## 📈 実装済み機能

- ✅ PDF管理（追加・編集・削除・一括アップロード）
- ✅ カテゴリ・タグ管理
- ✅ 検索・フィルター（カテゴリ、タグ、キーワード）
- ✅ ソート（新着順、古い順、人気順）
- ✅ お気に入り機能
- ✅ ダウンロード履歴
- ✅ ダークモード
- ✅ Google Analytics統合（8種類のカスタムイベント）
- ✅ セキュリティヘッダー完全実装
- ✅ 構造化データ（リッチスニペット対応）
- ✅ カテゴリ別SEO最適化
- ✅ PWA対応（manifest.json強化）
- ✅ アクセシビリティ対応（ARIA属性）

---

## 📝 お問い合わせ

**Instagram DM**: [@akagami_sns](https://www.instagram.com/akagami_sns/)

---

**詳細ドキュメント**: `INTERNAL_DOCUMENTATION.md` を参照  
**最終更新**: 2026年1月13日
