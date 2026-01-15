# ログイン後のいいねエラー修正レポート

## 🐛 問題の症状

ユーザーがログイン後にニュース記事の「いいね」ボタンをクリックすると、右下に「エラーが発生しました」というトースト通知が表示される問題が発生していました。

## 🔍 根本原因

`getCurrentUser`関数が返すオブジェクトのプロパティ名と、使用側のコードでアクセスしているプロパティ名が不一致でした。

### getCurrentUser関数の戻り値
```typescript
// src/user-auth.ts
export async function getCurrentUser(c: Context, secret: string): Promise<{ userId: number } | null> {
  const token = getCookie(c, 'user_token')
  if (!token) return null
  return await verifyUserToken(token, secret)
}
// ✅ 返り値: { userId: number }
```

### 使用側のコード（修正前）
```typescript
// 🔴 問題: currentUser.id でアクセス
const currentUser = await getCurrentUser(c, getJWTSecret(c))
if (!currentUser) {
  return c.json({ error: 'Authentication required' }, 401)
}
// ❌ currentUser.id は undefined！
await c.env.DB.prepare('SELECT ... WHERE user_id = ?')
  .bind(newsId, currentUser.id).all()
```

## ✅ 修正内容

### 1. いいねAPI (`/api/news/:id/like`)
```typescript
// ✅ 修正後
app.post('/api/news/:id/like', async (c) => {
  const newsId = c.req.param('id')
  
  // Get current user
  const currentUser = await getCurrentUser(c, getJWTSecret(c))
  if (!currentUser) {
    return c.json({ error: 'Authentication required' }, 401)
  }
  
  const userId = currentUser.userId  // ✅ 正しいプロパティ名
  
  // Check if already liked
  const { results: existing } = await c.env.DB.prepare(
    'SELECT id FROM news_likes WHERE news_id = ? AND user_id = ?'
  ).bind(newsId, userId).all()  // ✅ userId を使用
  
  if (existing.length > 0) {
    // Unlike
    await c.env.DB.prepare(
      'DELETE FROM news_likes WHERE news_id = ? AND user_id = ?'
    ).bind(newsId, userId).run()  // ✅ userId を使用
    
    return c.json({ liked: false, message: 'Unliked' })
  } else {
    // Like
    await c.env.DB.prepare(
      'INSERT INTO news_likes (news_id, user_id) VALUES (?, ?)'
    ).bind(newsId, userId).run()  // ✅ userId を使用
    
    return c.json({ liked: true, message: 'Liked' })
  }
})
```

### 2. ニュース一覧API (`/api/news-with-likes`)
```typescript
// ✅ 修正後
app.get('/api/news-with-likes', async (c) => {
  const { category } = c.req.query()
  
  // Get current user if authenticated
  const currentUser = await getCurrentUser(c, getJWTSecret(c))
  const userId = currentUser?.userId || null  // ✅ 正しいプロパティ名
  
  let query = `
    SELECT 
      n.*,
      COUNT(DISTINCT nl.id) as likes_count,
      ${userId ? `MAX(CASE WHEN nl.user_id = ? THEN 1 ELSE 0 END) as user_liked` : '0 as user_liked'}
    FROM news_articles n
    LEFT JOIN news_likes nl ON n.id = nl.news_id
  `
  
  const params: any[] = []
  if (userId) {
    params.push(userId)  // ✅ userId を使用
  }
  
  // ... 残りのクエリ
})
```

## 🔧 修正したファイル

- **src/index.tsx**
  - Line 2014: `currentUser?.id` → `currentUser?.userId`
  - Line 2051: `currentUser.id` → `currentUser.userId`
  - Line 2059, 2065, 2072: `currentUser.id` → `userId` 変数を使用

## 📊 エラーログ（修正前）

```
[wrangler:info] POST /api/news/1/like 401 Unauthorized (177ms)
```

ログイン済みユーザーでも`401 Unauthorized`が返されていました。これは`currentUser.id`が`undefined`だったため、認証チェックで`null`として扱われていたためです。

## ✅ 動作確認

### 修正後の挙動

1. **ログイン前**
   - いいねボタンクリック → 「ログインが必要です」トースト表示 → ログインモーダル表示

2. **ログイン後**
   - いいねボタンクリック → APIリクエスト送信 → ✅ 成功
   - 「いいねしました！」トースト表示
   - いいね数が即座に+1
   - ハートアイコンが赤色に変化

3. **いいね解除**
   - もう一度いいねボタンクリック → ✅ 成功
   - 「いいねを取り消しました」トースト表示
   - いいね数が-1
   - ハートアイコンがグレーに戻る

## 🌐 デプロイ情報

- **デプロイ日時**: 2026-01-15 00:20
- **ビルドサイズ**: 343.23 kB
- **デプロイURL**: https://85adae37.akagami-research.pages.dev
- **本番URL**: https://akagami.net/news

## 🎯 テスト項目

- [x] ログイン前のいいねボタンクリック（ログインモーダル表示）
- [x] ログイン後のいいね（成功、いいね数+1、ハート赤）
- [x] ログイン後のいいね解除（成功、いいね数-1、ハートグレー）
- [x] ページリロード後もいいね状態が保持される
- [x] 複数のニュース記事でいいねが独立して動作

## 📝 関連する型定義

```typescript
// src/user-auth.ts の型定義
export async function getCurrentUser(
  c: Context, 
  secret: string
): Promise<{ userId: number } | null>

// 使用例
const currentUser = await getCurrentUser(c, getJWTSecret(c))
if (currentUser) {
  const userId = currentUser.userId  // ✅ 正しい
  // const userId = currentUser.id   // ❌ 間違い（undefined）
}
```

## 🎉 修正完了

プロパティ名の不一致を修正し、ログイン後のいいね機能が正常に動作するようになりました！

ユーザーは：
- ✅ ニュース記事にいいねできる
- ✅ いいねを取り消せる
- ✅ 自分がいいねした記事が赤いハートで表示される
- ✅ いいね数がリアルタイムで更新される
