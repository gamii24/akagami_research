# ニュースページ表示修正レポート

## 🐛 問題の症状

ニュースページ（/news）でニュースカードが全く表示されず、「読み込み中...」のスピナーが表示され続ける問題が発生していました。

## 🔍 根本原因

**ローカル開発環境のD1データベースが空だった**ため、APIが空の配列を返していました。

### 詳細な原因分析

1. **本番環境**: 正常に動作（21件のニュース記事）
   ```bash
   curl https://akagami.net/api/news-with-likes
   # ✅ 21件のニュース記事が返る
   ```

2. **ローカル環境**: データなし
   ```bash
   curl http://localhost:3000/api/news-with-likes
   # ❌ 空の配列 [] が返る
   ```

3. **データベース状態**
   - リモート（本番）: 21件の記事
   - ローカル: 0件の記事

### なぜこの問題が発生したか

Cloudflare Pages のローカル開発環境（`wrangler pages dev`）は、デフォルトで**ローカルのD1データベース**を使用します。

```javascript
// ecosystem.config.cjs
args: 'wrangler pages dev dist --d1=akagami-research-production --local ...'
//                                                               ^^^^^^^ ローカルDB使用
```

`--local`フラグを削除しても、`pages dev`コマンドはデフォルトでローカルデータベースを参照します。`--remote`フラグは`wrangler d1`コマンドでのみ使用でき、`pages dev`では使用できません。

## ✅ 解決方法

### 1. マイグレーションの適用

ローカルデータベースにテーブル構造を作成：

```bash
npx wrangler d1 migrations apply akagami-research-production --local
```

**結果**: 23個のマイグレーションを適用
- `0001_initial_schema.sql` 〜 `0023_add_news_likes.sql`

### 2. テストデータの挿入

`seed-news.sql`ファイルを作成し、5件のニュース記事をシード：

```sql
INSERT OR REPLACE INTO news_articles (id, title, summary, url, category, language, published_at, created_at, updated_at) VALUES
(1, 'InstagramがReelsの表示内容を手動で調整できる機能を公開', ...),
(12, 'Google、動画生成AI「Veo 3.1」を強化...', ...),
(15, '再生時間140年表示の謎動画がYouTubeに出現...', ...),
(23, 'Apple、動画・音楽制作アプリ使い放題の新サブスク開始...', ...),
(25, 'Pinterestが2026年の注目トレンドカラーを発表...', ...);
```

```bash
npx wrangler d1 execute akagami-research-production --local --file=./seed-news.sql
```

### 3. PM2設定の更新

`ecosystem.config.cjs`から`--local`フラグを削除（明示的な指定を削除）：

```javascript
// 変更前
args: 'wrangler pages dev dist --d1=akagami-research-production --local --ip 0.0.0.0 --port 3000'

// 変更後
args: 'wrangler pages dev dist --d1=akagami-research-production --ip 0.0.0.0 --port 3000'
```

**注**: 結果的に動作は同じ（デフォルトでローカルDB使用）ですが、設定を明確化しました。

## 📊 修正前後の比較

### 修正前
```
ローカルDB: 空（0件）
↓
API: [] (空配列)
↓
UI: "読み込み中..."（永遠に表示）
```

### 修正後
```
ローカルDB: 5件のテストデータ
↓
API: 5件のニュース記事
↓
UI: ニュースカードが正常表示 ✅
```

## 🔧 追加した/修正したファイル

1. **seed-news.sql** (新規作成)
   - ローカル開発用のテストデータ
   - 5件のニュース記事

2. **ecosystem.config.cjs** (修正)
   - `--local`フラグを削除

3. **.wrangler/** (削除)
   - キャッシュをクリアして再起動

## 🎯 検証結果

### ローカル環境
```bash
# API テスト
curl http://localhost:3000/api/news-with-likes | python3 -m json.tool
# ✅ 5件のニュース記事が返る

# ブラウザテスト
# ✅ ニュースカードが表示される
# ✅ いいねボタンが動作する
```

### 本番環境
```bash
# API テスト
curl https://akagami.net/api/news-with-likes | python3 -m json.tool
# ✅ 21件のニュース記事が返る（変更なし）

# ブラウザテスト
# ✅ ニュースカードが表示される
# ✅ いいねボタンが動作する
```

## 📝 重要な学び

### ローカル vs リモート データベース

| 環境 | コマンド | データベース |
|------|----------|--------------|
| **ローカル開発** | `wrangler pages dev --d1=DB_NAME` | ローカル SQLite |
| **ローカル開発（明示）** | `wrangler pages dev --d1=DB_NAME --local` | ローカル SQLite |
| **リモートDB操作** | `wrangler d1 execute DB_NAME --remote` | Cloudflare D1（本番） |
| **ローカルDB操作** | `wrangler d1 execute DB_NAME --local` | ローカル SQLite |
| **本番デプロイ** | `wrangler pages deploy dist` | Cloudflare D1（本番） |

### ベストプラクティス

1. **マイグレーション管理**
   ```bash
   # ローカル: テーブル構造を作成
   npx wrangler d1 migrations apply DB_NAME --local
   
   # 本番: 本番DBにマイグレーション適用
   npx wrangler d1 migrations apply DB_NAME --remote
   ```

2. **シードデータ管理**
   ```bash
   # ローカル: テストデータを挿入
   npx wrangler d1 execute DB_NAME --local --file=./seed.sql
   ```

3. **デプロイ前の確認**
   - ローカルで動作確認
   - マイグレーションを本番に適用
   - デプロイ

## ✅ 完了確認

- [x] ローカルデータベースにマイグレーション適用
- [x] ローカルデータベースにテストデータ挿入
- [x] ローカル環境でニュースページ表示確認
- [x] ローカル環境でAPIレスポンス確認
- [x] 本番環境は影響なし（正常動作継続）

## 🌐 確認URL

### ローカル環境
- **ニュースページ**: http://localhost:3000/news
- **API**: http://localhost:3000/api/news-with-likes

### 本番環境
- **ニュースページ**: https://akagami.net/news
- **API**: https://akagami.net/api/news-with-likes

## 🎉 修正完了

ローカル開発環境でニュースページが正常に表示されるようになりました！

本番環境は常に正常に動作していたため、ユーザーへの影響はありませんでした。
