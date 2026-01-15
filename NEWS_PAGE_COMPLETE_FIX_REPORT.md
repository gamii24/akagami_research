# ニュースページ表示問題の完全解決レポート

## 🐛 報告された問題

ユーザーから「最新ニュースのページで、ニュースのカードが全く表示されない」との報告がありました。

### ブラウザコンソールのエラー
```
api/news-with-likes:1 Failed to load resource: the server responded with a status of 500 ()
news:57 Failed to load news: M
```

## 🔍 根本原因

**ローカル開発環境のD1データベースにマイグレーションとデータが適用されていなかった**

### 詳細な原因
1. `.wrangler`フォルダをクリアした後、マイグレーションが再適用されていなかった
2. テーブル構造が存在しないため、APIが500エラーを返していた
3. フロントエンドが永遠に「読み込み中...」状態になっていた

## ✅ 解決手順

### 1. 完全クリーンアップ
```bash
# PM2プロセスを完全削除
pm2 delete webapp

# キャッシュとビルドをクリア
rm -rf .wrangler

# クリーンビルド
npm run build
```

### 2. データベースマイグレーション適用
```bash
npx wrangler d1 migrations apply akagami-research-production --local
```

**結果**: 23個のマイグレーションを適用成功
- 0001_initial_schema.sql 〜 0023_add_news_likes.sql
- すべてのテーブルとインデックスを作成

### 3. シードデータ挿入
```bash
npx wrangler d1 execute akagami-research-production --local --file=./seed-news.sql
```

**seed-news.sql の内容**:
```sql
INSERT OR REPLACE INTO news_articles (id, title, summary, url, category, language, published_at, created_at, updated_at) VALUES
(1, 'InstagramがReelsの表示内容を手動で調整できる機能を公開', ...),
(12, 'Google、動画生成AI「Veo 3.1」を強化...', ...),
(15, '再生時間140年表示の謎動画がYouTubeに出現...', ...),
(23, 'Apple、動画・音楽制作アプリ使い放題の新サブスク開始...', ...),
(25, 'Pinterestが2026年の注目トレンドカラーを発表...', ...);
```

### 4. アプリケーション起動
```bash
pm2 start ecosystem.config.cjs
```

## 📊 修正前後の比較

### 修正前
```
問題:
- APIリクエスト → 500 Internal Server Error
- エラーメッセージ: "no such table: news_articles"
- UI: 永遠に「読み込み中...」スピナー表示
```

### 修正後
```
正常動作:
- APIリクエスト → 200 OK (5件のニュース記事返却)
- データベース: 正常なテーブル構造とデータ
- UI: ニュースカードが正常に表示 ✅
```

## 🔧 作成/修正したファイル

### 新規作成
1. **seed-news.sql**
   - ローカル開発用のテストデータ
   - 5件の実際のニュース記事

### 既存ファイル（変更なし）
- ecosystem.config.cjs
- src/index.tsx
- migrations/*.sql

## 🎯 検証結果

### ローカル環境 ✅
```bash
# API テスト
curl http://localhost:3000/api/news-with-likes
# ✅ 5件のニュース記事が正常に返却される

# データベーステスト
npx wrangler d1 execute akagami-research-production --local \
  --command="SELECT COUNT(*) FROM news_articles"
# ✅ count: 5
```

### 本番環境 ✅
```bash
# API テスト
curl https://akagami.net/api/news-with-likes
# ✅ 21件のニュース記事が正常に返却される（変更なし）

# ページテスト
curl https://akagami.net/news
# ✅ HTMLが正常に返される
```

## 📝 重要な学習ポイント

### Cloudflare D1 ローカル開発の注意点

1. **`.wrangler`フォルダをクリアした後は必ずマイグレーションを再実行**
   ```bash
   rm -rf .wrangler
   # ↓ この後必須！
   npx wrangler d1 migrations apply DB_NAME --local
   ```

2. **ローカル開発のデータベースは別環境**
   - ローカル: `.wrangler/state/v3/d1/` の SQLite ファイル
   - 本番: Cloudflare D1（クラウド）
   - **互いに独立**しており、データは共有されない

3. **マイグレーション管理のベストプラクティス**
   ```bash
   # ローカル開発
   npx wrangler d1 migrations apply DB_NAME --local
   npx wrangler d1 execute DB_NAME --local --file=./seed.sql
   
   # 本番デプロイ（新しいマイグレーションがある場合のみ）
   npx wrangler d1 migrations apply DB_NAME --remote
   npx wrangler pages deploy dist
   ```

## 🚨 トラブルシューティング手順

将来同じ問題が発生した場合の対処法：

1. **エラー確認**
   ```bash
   pm2 logs webapp --nostream --lines 50 | grep -i error
   ```

2. **データベース状態確認**
   ```bash
   npx wrangler d1 execute DB_NAME --local --command="SELECT COUNT(*) FROM news_articles"
   ```

3. **完全リセット（最終手段）**
   ```bash
   pm2 delete webapp
   rm -rf .wrangler
   npm run build
   npx wrangler d1 migrations apply DB_NAME --local
   npx wrangler d1 execute DB_NAME --local --file=./seed-news.sql
   pm2 start ecosystem.config.cjs
   ```

## ✅ 完了確認チェックリスト

- [x] ローカルデータベースにマイグレーション適用完了
- [x] ローカルデータベースにシードデータ挿入完了
- [x] ローカル環境でAPIが正常動作（200 OK）
- [x] ローカル環境でニュースページ表示確認
- [x] 本番環境が正常動作継続（影響なし）
- [x] seed-news.sql ファイル作成完了

## 🌐 確認URL

### ローカル環境
- **ニュースページ**: http://localhost:3000/news ✅
- **API**: http://localhost:3000/api/news-with-likes ✅

### 本番環境  
- **ニュースページ**: https://akagami.net/news ✅
- **API**: https://akagami.net/api/news-with-likes ✅

## 🎉 修正完了

ローカル開発環境でニュースページが正常に表示されるようになりました！

### 改善された点
✅ APIが正常に動作（500エラー解消）
✅ ニュースカードが表示される
✅ いいね機能が動作する
✅ 本番環境は影響なし（常に正常動作）

**本番環境に影響はなく、ユーザーは常に正常にニュースを閲覧できていました。**
