# 登録者管理・通知機能ガイド

## 📋 実装済み機能

### 1. ✅ 登録者一覧機能（管理画面）

#### アクセス方法
1. 管理画面にアクセス: `https://akagami.net/admin`
2. パスワードでログイン: `TaylorAlisonSwift`
3. 「**登録者一覧**」ボタン（緑色）をクリック

#### 表示内容
登録者一覧モーダルには以下の情報が表示されます：
- **会員番号**: ユーザーID
- **名前**: 登録時に入力された名前
- **メールアドレス**: 登録メールアドレス
- **登録日時**: 日本時間での登録日時
- **最終ログイン**: 最後にログインした日時
- **認証方法**: 
  - パスワード認証
  - マジックリンク認証（パスワードレス）

#### 追加機能
- **CSVエクスポート**: 登録者データをCSVファイルとしてダウンロード可能
- **総登録者数表示**: モーダル上部に総数を表示
- **見やすいテーブル形式**: ゼブラストライプで読みやすい表示

### 2. ✅ 管理者メール通知機能

#### 通知の仕組み
新規会員が登録されると、**自動的に**管理者（あなた）にメール通知が送信されます。

#### 通知先
- **メールアドレス**: `akagami.syatyo@gmail.com`

#### 通知内容
```
件名: [Akagami Research] 新規会員登録: [登録者名]

内容:
- 会員番号: [ユーザーID]
- 名前: [登録者名]
- メールアドレス: [登録メールアドレス]
- 登録日時: [日本時間]
```

#### メールテンプレート
- **HTMLメール**: 美しいデザインのHTMLメール
- **プレーンテキスト**: メールクライアントのフォールバック用
- **カラー**: 緑色のヘッダー（新規登録を表す）

## 🔧 実装箇所

### バックエンド（`src/index.tsx`）

#### 登録APIエンドポイント
```typescript
// Line 153-226
app.post('/api/user/register', async (c) => {
  // ... ユーザー登録処理 ...
  
  // ウェルカムメール送信（ユーザーへ）
  await sendEmail({
    to: email,
    subject: 'Akagami Research へようこそ！',
    html: getWelcomeEmailHtml(name),
    text: `こんにちは、${name}さん。Akagami Research の会員登録が完了しました！`
  })
  
  // 管理者通知メール送信（あなたへ）
  await sendEmail({
    to: 'akagami.syatyo@gmail.com',
    subject: `[Akagami Research] 新規会員登録: ${name}`,
    html: getAdminNewUserNotificationHtml(name, email, userId, registrationDate),
    text: `新規会員が登録されました。\n\n会員番号: ${userId}\n名前: ${name}\nメールアドレス: ${email}\n登録日時: ${registrationDate}`
  })
})
```

#### 登録者一覧APIエンドポイント
```typescript
// Line 1158-1176
app.get('/api/analytics/users', requireAuth, async (c) => {
  const { results: users } = await c.env.DB.prepare(`
    SELECT 
      id,
      email,
      name,
      login_method,
      created_at,
      last_login
    FROM users
    ORDER BY created_at DESC
  `).all()
  
  return c.json(users)
})
```

### フロントエンド（`public/static/admin.js`）

#### 登録者一覧モーダル表示関数
```javascript
// Line 1319-1411
async function showUsersModal() {
  // ユーザーデータ取得
  const response = await fetch('/api/analytics/users', {
    credentials: 'include'
  })
  
  const users = await response.json()
  
  // モーダル表示
  // - テーブル形式
  // - CSVエクスポートボタン
  // - 総登録者数表示
}
```

#### CSVエクスポート関数
```javascript
// Line 1414-1440
function exportUsersToCSV() {
  const headers = ['会員番号', '名前', 'メールアドレス', '登録日', '最終ログイン', '認証方法']
  const rows = usersCache.map(user => [
    user.id,
    user.name,
    user.email,
    formatDate(user.created_at),
    user.last_login ? formatDate(user.last_login) : '未ログイン',
    user.login_method === 'password' ? 'パスワード' : 'マジックリンク'
  ])
  
  // CSVファイル生成とダウンロード
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  // ...
}
```

### メールテンプレート（`src/email.ts`）

#### 管理者通知メールテンプレート
```typescript
// Line 286-380
export function getAdminNewUserNotificationHtml(
  userName: string, 
  userEmail: string, 
  userId: number, 
  registrationDate: string
): string {
  return `
    <!-- 緑色ヘッダーの美しいHTMLメール -->
    <div class="header">
      <h1>🎉 新規会員登録通知</h1>
    </div>
    <div class="content">
      <p>Akagami Research に新しい会員が登録されました！</p>
      
      <div class="user-card">
        <h2>会員情報</h2>
        <div>会員番号: ${userId}</div>
        <div>名前: ${userName}</div>
        <div>メールアドレス: ${userEmail}</div>
        <div>登録日時: ${registrationDate}</div>
      </div>
      
      <a href="https://akagami.net/admin" class="button">
        管理画面で確認
      </a>
    </div>
  `
}
```

## 📱 使い方

### 登録者一覧の確認

1. **管理画面にアクセス**
   ```
   https://akagami.net/admin
   ```

2. **ログイン**
   - パスワード: `TaylorAlisonSwift`

3. **登録者一覧ボタンをクリック**
   - 緑色の「登録者一覧」ボタン

4. **データの確認**
   - すべての登録者情報がテーブル形式で表示されます
   - スクロールで全データを確認できます

5. **CSVエクスポート（オプション）**
   - モーダル下部の「CSVでエクスポート」ボタンをクリック
   - Excelで開ける形式でダウンロードされます

### メール通知の確認

1. **新規登録が発生すると自動送信**
   - ユーザーが会員登録フォームを送信
   - システムが自動的に2通のメールを送信:
     - ユーザーへ: ウェルカムメール
     - あなたへ: 登録通知メール

2. **メールを確認**
   - 件名: `[Akagami Research] 新規会員登録: [名前]`
   - `akagami.syatyo@gmail.com` で受信

3. **管理画面リンク**
   - メール内の「管理画面で確認」ボタンをクリック
   - 直接管理画面の登録者一覧にアクセス可能

## ⚙️ メール送信の設定

### 現在の状態
現在、メール送信機能はログ出力のみで、**実際のメール送信は行われていません**。

```typescript
// src/email.ts Line 12-30
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // 開発環境ではコンソールログのみ
  console.log('📧 Email would be sent:', {
    to: options.to,
    subject: options.subject,
    preview: options.text?.substring(0, 100)
  })
  
  return true  // 常に成功を返す
}
```

### 本番環境での設定方法

#### オプション1: Cloudflare Email Workers（無料）

1. **Cloudflare Email Routing 設定**
   ```bash
   # Cloudflare Dashboard で設定
   1. Email → Email Routing
   2. ドメイン akagami.net を追加
   3. DNS レコードを自動設定
   ```

2. **コード修正**
   ```typescript
   // src/email.ts
   export async function sendEmail(options: EmailOptions): Promise<boolean> {
     const response = await fetch('https://api.cloudflare.com/client/v4/accounts/{account_id}/email/routing/rules', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         from: 'noreply@akagami.net',
         to: options.to,
         subject: options.subject,
         html: options.html
       })
     })
     
     return response.ok
   }
   ```

#### オプション2: SendGrid（有料・無料プランあり）

1. **SendGrid API Key 取得**
   - SendGrid にサインアップ
   - API Key を作成

2. **環境変数設定**
   ```bash
   npx wrangler pages secret put SENDGRID_API_KEY --project-name akagami-research
   ```

3. **コード修正**
   ```typescript
   // src/email.ts
   export async function sendEmail(options: EmailOptions, env: any): Promise<boolean> {
     const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         personalizations: [{
           to: [{ email: options.to }]
         }],
         from: { email: 'noreply@akagami.net', name: 'Akagami Research' },
         subject: options.subject,
         content: [{
           type: 'text/html',
           value: options.html
         }]
       })
     })
     
     return response.ok
   }
   ```

#### オプション3: Resend（推奨・無料プランあり）

1. **Resend API Key 取得**
   - https://resend.com にサインアップ
   - API Key を作成

2. **環境変数設定**
   ```bash
   npx wrangler pages secret put RESEND_API_KEY --project-name akagami-research
   ```

3. **コード修正**
   ```typescript
   // src/email.ts
   export async function sendEmail(options: EmailOptions, env: any): Promise<boolean> {
     const response = await fetch('https://api.resend.com/emails', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${env.RESEND_API_KEY}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         from: 'Akagami Research <noreply@akagami.net>',
         to: options.to,
         subject: options.subject,
         html: options.html
       })
     })
     
     return response.ok
   }
   ```

## 🎯 テスト方法

### 登録者一覧機能のテスト

1. **開発環境でアクセス**
   ```
   https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai/admin
   ```

2. **ログイン**
   - パスワード: `TaylorAlisonSwift`

3. **登録者一覧をクリック**
   - 現在登録されているユーザーが表示されます

4. **CSVエクスポートをテスト**
   - 「CSVでエクスポート」ボタンをクリック
   - ダウンロードされたCSVファイルを確認

### メール通知のテスト

#### 現在（ログ出力のみ）
```bash
# サーバーログを確認
pm2 logs webapp --nostream

# 出力例:
# 📧 Email would be sent: {
#   to: 'akagami.syatyo@gmail.com',
#   subject: '[Akagami Research] 新規会員登録: テストユーザー',
#   preview: '新規会員が登録されました。\n\n会員番号: 123\n名前: テストユーザー\nメールアドレス: test@example.com\n登録日時: 2026-01-13 ...'
# }
```

#### 本番環境（メールサービス設定後）
1. テストアカウントを作成
2. `akagami.syatyo@gmail.com` でメールを確認
3. HTMLメールの表示を確認

## 📊 データベーススキーマ

### users テーブル
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  login_method TEXT DEFAULT 'password',  -- 'password' or 'magic_link'
  
  -- SNS情報
  youtube_url TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  twitter_handle TEXT,
  
  -- プロフィール
  profile_photo_url TEXT,
  
  -- タイムスタンプ
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

## 🔒 セキュリティ

### 管理画面のアクセス制御
- **認証必須**: JWT トークンベースの認証
- **パスワード保護**: 管理者パスワードでログイン
- **セッション管理**: 30日間の自動ログイン

### メール通知のセキュリティ
- **送信先固定**: `akagami.syatyo@gmail.com` にハードコード
- **個人情報保護**: HTTPSで暗号化された通信
- **スパム防止**: 登録時のみ送信（自動送信を防止）

## 📝 まとめ

### ✅ 実装済み
- 管理画面の登録者一覧表示
- CSVエクスポート機能
- 新規登録時の管理者メール通知（コード実装済み）
- 美しいHTMLメールテンプレート

### ⚠️ 設定が必要
- メール送信サービスの設定（SendGrid/Resend/Cloudflare Email Workers）
- 本番環境でのメール送信テスト

### 🎯 次のステップ
1. メール送信サービスを選択（Resend推奨）
2. API Key を取得
3. コードを修正して実装
4. テスト送信で確認
5. 本番環境にデプロイ

---

**開発環境URL**: https://3000-iwpfj0eebl4qd7e2klphb-5c13a017.sandbox.novita.ai
**本番環境URL**: https://akagami.net
**管理画面**: https://akagami.net/admin
