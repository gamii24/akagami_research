# 📧 Resendメール送信セットアップガイド

## 🎯 概要

Akagami Researchでメール送信を有効にするためのステップバイステップガイドです。

Resendを使用する理由：
- ✅ **無料プラン**: 月100通まで無料
- ✅ **簡単なAPI**: シンプルで使いやすい
- ✅ **高い到達率**: 優れたメール配信インフラ
- ✅ **開発者フレンドリー**: わかりやすいドキュメント

## 📝 ステップ1: Resendアカウント作成

### 1. Resendにアクセス
https://resend.com にアクセスします。

### 2. サインアップ
- 「Sign Up」ボタンをクリック
- メールアドレスを入力
- パスワードを設定
- 確認メールをチェック

### 3. ダッシュボードにアクセス
ログイン後、ダッシュボードが表示されます。

## 🔑 ステップ2: API Keyの取得

### 1. API Keysページにアクセス
- 左サイドバーから「API Keys」をクリック
- または https://resend.com/api-keys にアクセス

### 2. 新しいAPI Keyを作成
- 「Create API Key」ボタンをクリック
- 名前を入力（例: `Akagami Research Production`）
- 「Full Access」を選択（送信権限が必要）
- 「Create」ボタンをクリック

### 3. API Keyをコピー
⚠️ **重要**: API Keyは一度しか表示されません！
- 表示されたAPI Keyをコピー
- 安全な場所に保存（例: パスワードマネージャー）
- 形式: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🌐 ステップ3: ドメイン設定（重要）

### Resendでのドメイン認証

Resendから akagami.net ドメインでメールを送信するには、ドメイン認証が必要です。

#### 1. Domainsページにアクセス
- 左サイドバーから「Domains」をクリック
- または https://resend.com/domains にアクセス

#### 2. ドメインを追加
- 「Add Domain」ボタンをクリック
- ドメイン名を入力: `akagami.net`
- 「Add」ボタンをクリック

#### 3. DNS設定
Resendが3つのDNSレコードを表示します：

**SPF レコード（TXT）:**
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM レコード（TXT）:**
```
Name: resend._domainkey
Type: TXT
Value: [Resendが提供する値]
```

**DMARC レコード（TXT）:**
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@akagami.net
```

#### 4. Cloudflare DNSに追加

1. **Cloudflare ダッシュボードにアクセス**
   - https://dash.cloudflare.com
   - akagami.net ドメインを選択

2. **DNS設定を開く**
   - 左サイドバーから「DNS」→「Records」

3. **3つのレコードを追加**
   - 「Add record」をクリック
   - 上記の値をそれぞれ入力
   - 「Save」をクリック

#### 5. 認証を確認
- Resendのダッシュボードに戻る
- 「Verify」ボタンをクリック
- 認証が完了すると緑色のチェックマークが表示されます
- ⚠️ DNS伝播には最大24時間かかる場合があります

### ドメイン認証なしでテスト（オプション）

DNS設定前にテストしたい場合は、Resendの無料ドメインを使用できます：
- From: `noreply@resend.dev`
- 制限: Resendに登録したメールアドレスにのみ送信可能

## 💻 ステップ4: ローカル開発環境での設定

### 1. .dev.vars ファイルを編集

```bash
cd /home/user/webapp
nano .dev.vars
```

### 2. RESEND_API_KEY を設定

```bash
# JWT Secret Key (本番環境では強固なランダム文字列に変更してください)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Admin Password
ADMIN_PASSWORD=TaylorAlisonSwift

# Resend API Key for email sending
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx  # ← ここに実際のAPI Keyを貼り付け
```

### 3. ビルドとテスト

```bash
# ビルド
npm run build

# PM2で再起動
pm2 restart webapp

# テスト登録を実行
# 公開ページの「会員登録」から新規アカウントを作成
```

### 4. ログで確認

```bash
# メール送信のログを確認
pm2 logs webapp --nostream | grep -A 5 "Email"

# 成功時の出力例:
# ✅ Email sent successfully via Resend: {
#   id: 're_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
#   to: 'akagami.syatyo@gmail.com',
#   subject: '[Akagami Research] 新規会員登録: テストユーザー'
# }
```

## ☁️ ステップ5: 本番環境（Cloudflare Pages）での設定

### 方法1: Cloudflare Pages ダッシュボード（推奨）

1. **Cloudflare Pagesダッシュボードにアクセス**
   - https://dash.cloudflare.com
   - 「Workers & Pages」をクリック
   - `akagami-research` プロジェクトを選択

2. **環境変数を追加**
   - 「Settings」タブをクリック
   - 「Environment variables」セクションを探す
   - 「Add variable」ボタンをクリック

3. **RESEND_API_KEY を設定**
   - Variable name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Environment: `Production` と `Preview` 両方にチェック
   - 「Save」ボタンをクリック

4. **再デプロイ**
   環境変数を反映するには再デプロイが必要です：
   ```bash
   cd /home/user/webapp
   npm run build
   npx wrangler pages deploy dist --project-name akagami-research
   ```

### 方法2: Wrangler CLI

```bash
cd /home/user/webapp

# 本番環境用
npx wrangler pages secret put RESEND_API_KEY --project-name akagami-research
# プロンプトでAPI Keyを入力

# プレビュー環境用（オプション）
npx wrangler pages secret put RESEND_API_KEY --project-name akagami-research --env preview
```

## 🧪 ステップ6: テスト

### テスト1: ローカル開発環境

1. **開発サーバーを起動**
   ```bash
   pm2 restart webapp
   ```

2. **テストユーザーを登録**
   - ブラウザで開発環境にアクセス
   - 「会員登録」をクリック
   - テスト情報を入力して登録

3. **メールを確認**
   - あなたのメール（akagami.syatyo@gmail.com）をチェック
   - 件名: `[Akagami Research] 新規会員登録: [名前]`

4. **ログを確認**
   ```bash
   pm2 logs webapp --nostream | grep -A 5 "Email"
   ```

### テスト2: 本番環境

1. **本番環境にアクセス**
   ```
   https://akagami.net
   ```

2. **テストユーザーを登録**
   - 実際のメールアドレスを使用
   - 登録を完了

3. **2通のメールを確認**
   - ユーザーへ: ウェルカムメール
   - 管理者へ: 新規登録通知メール

## 📊 メール送信のモニタリング

### Resendダッシュボード

1. **Emailsページにアクセス**
   - https://resend.com/emails
   - 送信されたすべてのメールが表示されます

2. **メールの詳細を確認**
   - ステータス: Delivered, Bounced, Complained など
   - 送信日時
   - 受信者
   - 件名

3. **エラーの確認**
   - 送信失敗の場合、理由が表示されます
   - バウンス、スパム報告などを追跡

## 🔒 セキュリティのベストプラクティス

### API Keyの管理

1. **絶対にコミットしない**
   - `.dev.vars` は `.gitignore` に含まれています
   - API Keyをコードに直接書かない

2. **定期的にローテーション**
   - 3-6ヶ月ごとにAPI Keyを再生成
   - 古いキーは削除

3. **アクセス制限**
   - 必要最小限の権限のみ付与
   - 本番環境とテスト環境で別のキーを使用

### メール送信の制限

Resend無料プランの制限：
- **送信数**: 月100通まで
- **受信者**: 無制限
- **ドメイン**: 1つまで

有料プランが必要になる目安：
- 月100通以上のメール送信
- 複数ドメインからの送信
- 高度な分析機能が必要

## 🆘 トラブルシューティング

### メールが送信されない

#### 1. API Keyを確認
```bash
# ローカル環境
cat .dev.vars | grep RESEND_API_KEY

# 本番環境
npx wrangler pages secret list --project-name akagami-research
```

#### 2. ログを確認
```bash
pm2 logs webapp --nostream | grep -i "email\|resend"
```

#### 3. Resend APIのレスポンスを確認
エラーメッセージの例：
- `401 Unauthorized`: API Keyが無効
- `403 Forbidden`: ドメイン認証が未完了
- `422 Unprocessable Entity`: リクエスト形式が不正

### メールが届かない

#### 1. スパムフォルダを確認
- Gmailのスパムフォルダをチェック
- 「迷惑メールではない」をクリック

#### 2. ドメイン認証を確認
- Resendダッシュボードで認証ステータスを確認
- DNS設定が正しいか確認

#### 3. Resendダッシュボードで配信ステータスを確認
- https://resend.com/emails
- メールが送信されているか確認
- バウンスやエラーがないか確認

### よくあるエラー

#### Error: `from` address must use a verified domain

**原因**: ドメイン認証が未完了

**解決方法**:
1. Resendダッシュボードで akagami.net の認証を完了
2. DNS設定を確認
3. または、テスト用に `noreply@resend.dev` を使用

#### Error: API key is invalid

**原因**: API Keyが正しく設定されていない

**解決方法**:
1. Resendで新しいAPI Keyを作成
2. `.dev.vars` または環境変数を更新
3. サーバーを再起動

## 📈 次のステップ

### メールテンプレートのカスタマイズ

メールのデザインをカスタマイズするには：
```typescript
// src/email.ts
export function getWelcomeEmailHtml(name: string): string {
  return `
    <!-- ここでHTMLをカスタマイズ -->
  `
}
```

### 送信レート制限の追加

大量登録を防ぐために：
```typescript
// レート制限ミドルウェアを追加
// 例: 1時間に10通まで
```

### メール配信の追跡

Resendのウェブフックを設定：
```typescript
// 開封、クリック、バウンスなどを追跡
```

## 📚 参考リンク

- **Resend公式ドキュメント**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference
- **価格プラン**: https://resend.com/pricing
- **サポート**: https://resend.com/support

---

**サポートが必要な場合は、お気軽にお知らせください！** 🎉
