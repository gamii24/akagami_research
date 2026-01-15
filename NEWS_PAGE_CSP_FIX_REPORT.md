# ニュースページ読み込みエラーの完全修正レポート

## 📅 日時
2026-01-15 03:00 (JST)

## 🔍 問題の症状
- ニュースページでカードが全く表示されない
- 「読み込み中...」のまま止まる
- コンソールに複数のエラーが表示される

## 🐛 発見されたエラー

### 1. CSPによるスクリプトブロック
```
Content Security Policy: The page's settings blocked the loading of a resource 
at https://static.cloudflareinsights.com/beacon.min.js/...
```

### 2. Tailwind CDN本番環境警告
```
cdn.tailwindcss.com should not be used in production
```

### 3. ローカル開発環境のDB問題
```
D1_ERROR: no such table: news_articles: SQLITE_ERROR
```

## 🔧 修正内容

### 1. CSP設定の拡張（src/index.tsx）

#### scriptSrc設定を拡張
```typescript
scriptSrc: [
  "'self'",
  "'unsafe-inline'",
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://static.cloudflareinsights.com", // ✅ 追加
  "https://cloudflareinsights.com"          // ✅ 追加（代替ドメイン）
]
```

#### connectSrc設定を拡張
```typescript
connectSrc: [
  "'self'",
  "https://www.google-analytics.com",
  "https://www.googletagmanager.com",
  "https://static.cloudflareinsights.com", // ✅ 追加
  "https://cloudflareinsights.com"          // ✅ 追加（代替ドメイン）
]
```

### 2. ローカルDB環境の復旧

#### クリーンビルド
```bash
pm2 delete webapp
rm -rf .wrangler
npm run build
```

#### マイグレーション適用
```bash
npx wrangler d1 migrations apply akagami-research-production --local
# 23個のマイグレーションを適用
```

#### テストデータ挿入
```bash
npx wrangler d1 execute akagami-research-production --local --file=./seed-news.sql
# 5件のニュース記事を挿入
```

#### PM2再起動
```bash
pm2 start ecosystem.config.cjs
```

## ✅ 修正結果

### 修正前
- ❌ CSP: Cloudflare Insightsスクリプトがブロック
- ❌ API: 500 Internal Server Error
- ❌ ローカルDB: テーブルなし（no such table）
- ❌ UI: 「読み込み中...」で停止

### 修正後
- ✅ CSP: エラーなし、すべてのスクリプトが正常に読み込み
- ✅ API: 200 OK、正しくデータ返却
- ✅ ローカルDB: 5件のテストデータ
- ✅ 本番DB: 21件の実データ
- ✅ UI: ニュースカードが正常に表示

## 🧪 検証結果

### ローカル環境
- URL: http://localhost:3000/news
- API: http://localhost:3000/api/news-with-likes
- 結果: ✅ 5件のニュース表示

### 本番環境
- URL: https://akagami.net/news
- API: https://akagami.net/api/news-with-likes
- デプロイURL: https://95a4152f.akagami-research.pages.dev/news
- 結果: ✅ 21件のニュース表示
- コンソールエラー: 🟡 Tailwind CDN警告のみ（機能に影響なし）

## 📊 API動作確認

### ローカル
```json
[
  {
    "id": 25,
    "title": "Pinterestが2026年の注目トレンドカラーを発表、5色を予測",
    "category": "SNS",
    "likes_count": 0,
    "user_liked": 0
  },
  // ... 他4件
]
```

### 本番
```json
[
  {
    "id": 25,
    "title": "Pinterestが2026年の注目トレンドカラーを発表、5色を予測",
    "category": "SNS",
    "likes_count": 0,
    "user_liked": 0
  },
  // ... 他20件
]
```

## 🎯 重要ポイント

### 1. CSP設定の重要性
- Cloudflare Insightsなどの外部スクリプトを使用する場合、CSPに明示的に追加する必要がある
- `scriptSrc`だけでなく、`connectSrc`にも追加が必要

### 2. ローカル開発環境の維持
- `.wrangler`フォルダをクリアした場合、マイグレーションの再適用が必須
- ローカルD1は本番とは別のSQLiteファイル（`.wrangler/state/v3/d1/`）
- テストデータは`seed-news.sql`で管理

### 3. デバッグのポイント
- ブラウザのコンソールエラーを徹底的に確認
- CSPエラーは見逃しやすいので注意
- APIは正常でもUIが表示されない場合、CSPやJavaScriptのエラーを疑う

## 🚀 次のステップ

### 推奨改善
1. **Tailwind CSS**: CDNから本番ビルドに移行
   - `npm install -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init -p`
   - PostCSS経由でビルド

2. **CSPの最適化**: 必要最小限のドメインに絞る

3. **エラーハンドリング強化**: 
   - API接続エラー時のリトライ機能
   - ユーザーフレンドリーなエラーメッセージ

## 📝 まとめ

**問題**: CSP設定の不足とローカルDB未初期化により、ニュースページが正常に動作しない

**解決**: CSP設定を拡張し、ローカルDBを完全に復旧

**結果**: ローカル・本番環境ともにニュースページが完全に復旧！ 🎉

---
**修正者**: AI Assistant  
**修正日時**: 2026-01-15 03:00 JST  
**確認URL**: https://akagami.net/news
