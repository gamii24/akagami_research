# ニュース一覧「いいね」機能実装レポート

## 📋 実装内容

### 機能概要
ニュース一覧ページに、各ニュース記事に対していいねできる機能を追加しました。

### 主な機能
1. **いいねボタン**: ハートアイコンで表示、クリックでいいね/いいね取り消し
2. **いいね数表示**: 各ニュースのいいね数をリアルタイムで表示
3. **認証チェック**: ログインユーザーのみいいね可能
4. **視覚的フィードバック**: いいね済みは赤いハート、未いいねはグレーのハート

## 🗄️ データベース構造

### 新規テーブル: `news_likes`

```sql
CREATE TABLE IF NOT EXISTS news_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  news_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (news_id) REFERENCES news_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(news_id, user_id)  -- 1ユーザー1ニュースに1いいねのみ
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_news_likes_news_id ON news_likes(news_id);
CREATE INDEX IF NOT EXISTS idx_news_likes_user_id ON news_likes(user_id);
```

**特徴:**
- `UNIQUE(news_id, user_id)`: 重複いいね防止
- `ON DELETE CASCADE`: ニュースやユーザー削除時に自動削除
- インデックス: 高速クエリのため

## 🔌 API エンドポイント

### 1. いいね数取得
```
GET /api/news/:id/likes
```
**レスポンス:**
```json
{
  "count": 5
}
```

### 2. ニュース一覧（いいね情報付き）
```
GET /api/news-with-likes?category=SNS
```
**レスポンス:**
```json
[
  {
    "id": 1,
    "title": "...",
    "summary": "...",
    "url": "...",
    "category": "SNS",
    "likes_count": 5,
    "user_liked": 1  // 1: いいね済み, 0: 未いいね
  }
]
```

**特徴:**
- ログインユーザーの場合、`user_liked`で自分がいいねしているか判定
- 未ログインユーザーの場合、`user_liked`は常に0
- いいね数は`likes_count`で取得

### 3. いいねトグル（ログイン必須）
```
POST /api/news/:id/like
```
**レスポンス:**
```json
{
  "liked": true,      // true: いいねした, false: いいね取り消し
  "message": "Liked"
}
```

**認証:**
- ログイン必須
- 未ログインの場合は401エラー
- Cookie認証を使用

## 🎨 UI/UX デザイン

### デスクトップ表示
```
┌─────────────────────────────────────────────────┐
│ [SNS] 2026年1月14日                    ❤️ 5    │
│ Instagram、Reels表示内容を手動調整可能に       │
│                                                 │
│ Instagram は、Reels に表示される...            │
│ [続きを読む ▼]                                  │
│                                                 │
│ [🔗 元記事を読む（外部サイト）]                │
└─────────────────────────────────────────────────┘
```

### モバイル表示
```
┌───────────────────────────────┐
│ [SNS] 2026/1/14       ❤️ 5   │
│                               │
│ Instagram、Reels表示内容を... │
│ (タップで詳細表示)            │
└───────────────────────────────┘
```

**いいねボタンの状態:**
- **未いいね**: 🤍 (グレーのハート + `far fa-heart`)
- **いいね済み**: ❤️ (赤いハート + `fas fa-heart`)
- **ホバー**: 未いいねボタンが赤く変化

## 💻 フロントエンド実装

### 主な関数

#### 1. 認証チェック
```javascript
async function checkAuth() {
  try {
    const response = await axios.get('/api/user/me', { withCredentials: true });
    isAuthenticated = response.data.authenticated;
  } catch (error) {
    isAuthenticated = false;
  }
}
```

#### 2. ニュース読み込み（いいね情報付き）
```javascript
async function loadNews() {
  try {
    const response = await axios.get('/api/news-with-likes', { withCredentials: true });
    newsData = response.data;
    renderNews();
  } catch (error) {
    // エラー処理
  }
}
```

#### 3. いいねトグル
```javascript
async function toggleLike(newsId, index) {
  if (!isAuthenticated) {
    showToast('いいねするにはログインが必要です', 'error');
    openAuthModal();
    return;
  }

  try {
    const response = await axios.post(`/api/news/${newsId}/like`, {}, { withCredentials: true });
    
    // ローカルデータ更新
    newsData[index].user_liked = response.data.liked ? 1 : 0;
    newsData[index].likes_count = response.data.liked 
      ? parseInt(newsData[index].likes_count) + 1 
      : parseInt(newsData[index].likes_count) - 1;
    
    // 再レンダリング
    renderNews();
    
    showToast(response.data.liked ? 'いいねしました！' : 'いいねを取り消しました', 'success');
  } catch (error) {
    showToast('エラーが発生しました', 'error');
  }
}
```

### レンダリング
```javascript
// いいねボタンのHTML生成
const likesCount = parseInt(news.likes_count) || 0;
const userLiked = news.user_liked === 1;
const likeButtonClass = userLiked 
  ? 'text-red-500 hover:text-red-600' 
  : 'text-gray-400 hover:text-red-500';
const likeIconClass = userLiked ? 'fas fa-heart' : 'far fa-heart';

// ボタン
<button 
  onclick="toggleLike(${news.id}, ${index})"
  class="${likeButtonClass} transition-colors flex items-center gap-2 text-lg"
  title="${userLiked ? 'いいねを取り消す' : 'いいね'}"
>
  <i class="${likeIconClass}"></i>
  <span class="text-sm">${likesCount}</span>
</button>
```

## ✅ テスト結果

### ローカル環境
```bash
# APIテスト
curl http://localhost:3000/api/news-with-likes
# ✅ 正常動作

# いいねボタン表示確認
curl http://localhost:3000/news | grep 'toggleLike'
# ✅ いいねボタン表示
```

### 本番環境
```bash
# APIテスト
curl https://akagami.net/api/news-with-likes
# ✅ 21件のニュース取得
# ✅ likes_count: 0
# ✅ user_liked: 0

# HTMLテスト
curl https://akagami.net/news | grep 'toggleLike'
# ✅ いいねボタン表示
```

### データベース
```sql
-- ローカル
✅ news_likes テーブル作成完了
✅ インデックス作成完了

-- 本番
✅ マイグレーション適用完了 (0023_add_news_likes.sql)
✅ テーブル作成確認済み
```

## 🚀 デプロイ情報

- **本番URL**: https://akagami.net/news
- **最新デプロイ**: https://24a033f7.akagami-research.pages.dev
- **ビルドサイズ**: 344.25 KB (+6KB)
- **ビルド時間**: 1.35秒
- **デプロイ状態**: ✅ 成功

## 📊 機能フロー

### いいねする（ログイン済み）
```
1. ユーザーがハートボタンをクリック
2. toggleLike() 実行
3. POST /api/news/:id/like
4. DB に news_likes レコード挿入
5. レスポンス: { liked: true }
6. フロントエンド: ハートを赤く変更、いいね数+1
7. トースト表示: 「いいねしました！」
```

### いいね取り消し（ログイン済み）
```
1. ユーザーが赤いハートボタンをクリック
2. toggleLike() 実行
3. POST /api/news/:id/like
4. DB から news_likes レコード削除
5. レスポンス: { liked: false }
6. フロントエンド: ハートをグレーに変更、いいね数-1
7. トースト表示: 「いいねを取り消しました」
```

### いいねしようとする（未ログイン）
```
1. ユーザーがハートボタンをクリック
2. toggleLike() 実行
3. isAuthenticated チェック → false
4. トースト表示: 「いいねするにはログインが必要です」
5. ログインモーダルを自動表示
```

## 🎯 今後の改善案

### 追加機能案
1. **いいねランキング**: 人気のニュースTOP10表示
2. **マイページ統合**: いいねしたニュース一覧表示
3. **通知機能**: 自分の投稿にいいねがついたら通知（管理者向け）
4. **アニメーション**: いいねボタンのアニメーション追加
5. **統計情報**: 管理画面でいいね数グラフ表示

### パフォーマンス最適化
1. **キャッシュ**: いいね数をキャッシュして負荷軽減
2. **ページネーション**: ニュース一覧のページネーション実装
3. **リアルタイム更新**: WebSocketでリアルタイムいいね数更新

## 📝 技術的詳細

### マイグレーションファイル
- **ファイル**: `migrations/0023_add_news_likes.sql`
- **適用日**: 2026-01-14
- **環境**: ローカル ✅, 本番 ✅

### 修正ファイル
- `src/index.tsx`: API エンドポイント追加、ニュースページUI更新
- `migrations/0023_add_news_likes.sql`: データベーススキーマ

### 依存パッケージ
- 新規追加なし（既存のaxiosとFont Awesomeを使用）

## 🔧 トラブルシューティング

### 問題1: `getJwtSecret is not defined`
**原因**: 関数名のタイポ（`getJwtSecret` → 正しくは `getJWTSecret`）  
**解決**: 関数名を修正して再ビルド

### 問題2: ローカルにニュースデータがない
**原因**: ローカルデータベースが空  
**解決**: 本番環境でテスト（本番には21件のニュースあり）

---

**作成日**: 2026-01-14  
**ステータス**: ✅ 完了  
**確認URL**: https://akagami.net/news
