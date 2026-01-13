# 🚀 Resendメール送信 - クイックスタートガイド

## ✅ 実装完了！

メール送信機能が完全に実装されました。あとはResend API Keyを設定するだけです。

## 📝 3ステップでメール送信を有効化

### ステップ1: Resend API Keyを取得（5分）

1. **Resendにアクセス**: https://resend.com
2. **無料アカウント作成**: 「Sign Up」から登録
3. **API Keyを作成**: 
   - ダッシュボード → 「API Keys」
   - 「Create API Key」ボタン
   - 名前: `Akagami Research`
   - Full Accessを選択
   - API Keyをコピー（`re_xxxxxx...`の形式）

### ステップ2: ローカル環境で設定（1分）

`.dev.vars` ファイルにAPI Keyを追加：

```bash
# /home/user/webapp/.dev.vars
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx  # ← ここにAPI Keyを貼り付け
```

サーバーを再起動：
```bash
cd /home/user/webapp
pm2 restart webapp
```

### ステップ3: テスト（1分）

1. 開発環境で会員登録してみる
2. `akagami.syatyo@gmail.com` でメールを確認
3. ログで送信成功を確認：
   ```bash
   pm2 logs webapp --nostream | grep "Email sent"
   ```

## 🎯 送信されるメール

### 1. 新規会員登録時（2通）

#### ユーザーへ: ウェルカムメール
- 件名: `Akagami Research へようこそ！`
- 内容: 会員登録完了の通知

#### 管理者へ: 登録通知メール
- 件名: `[Akagami Research] 新規会員登録: [名前]`
- 送信先: `akagami.syatyo@gmail.com`
- 内容:
  - 会員番号
  - 名前
  - メールアドレス
  - 登録日時（日本時間）

### 2. マジックリンクログイン時

- 件名: `Akagami Research ログインリンク`
- 内容: パスワードレスログイン用のリンク（15分有効）

### 3. 新着PDF通知（カテゴリ登録者へ）

- 件名: `[Akagami Research] [カテゴリ名]カテゴリに新しい資料が追加されました`
- 内容: 新しいPDFの情報

## ⚠️ 重要: ドメイン認証（本番環境用）

**Resendから akagami.net ドメインでメールを送信するには、DNS設定が必要です。**

### クイック設定（Cloudflare DNS）

Resendダッシュボードで提供される3つのDNSレコードをCloudflare DNSに追加：

1. **SPF レコード**
   ```
   Name: @
   Type: TXT
   Value: v=spf1 include:_spf.resend.com ~all
   ```

2. **DKIM レコード**
   ```
   Name: resend._domainkey
   Type: TXT
   Value: [Resendが提供する値]
   ```

3. **DMARC レコード**
   ```
   Name: _dmarc
   Type: TXT
   Value: v=DMARC1; p=none; rua=mailto:dmarc@akagami.net
   ```

詳細は `RESEND_SETUP_GUIDE.md` の「ステップ3: ドメイン設定」を参照。

## 🌐 本番環境での設定

### Cloudflare Pagesで環境変数を設定

```bash
# 方法1: Wrangler CLI
npx wrangler pages secret put RESEND_API_KEY --project-name akagami-research

# 方法2: Cloudflare Dashboard
# https://dash.cloudflare.com → Workers & Pages → akagami-research
# → Settings → Environment variables → Add variable
```

設定後、再デプロイ：
```bash
npm run build
npx wrangler pages deploy dist --project-name akagami-research
```

## 📊 動作確認

### ローカル環境

```bash
# ログを監視
pm2 logs webapp --lines 50

# メール送信のログを確認
pm2 logs webapp --nostream | grep -A 5 "Email"
```

### 成功時のログ例

```
✅ Email sent successfully via Resend: {
  id: 're_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  to: 'akagami.syatyo@gmail.com',
  subject: '[Akagami Research] 新規会員登録: テストユーザー'
}
```

### API Key未設定時のログ例

```
⚠️  RESEND_API_KEY not configured. Email not sent.
📧 Email would be sent: {
  to: 'akagami.syatyo@gmail.com',
  subject: '[Akagami Research] 新規会員登録: テストユーザー',
  preview: '新規会員が登録されました。...'
}
```

## 💰 料金プラン

### Resend 無料プラン
- ✅ **月100通まで無料**
- ✅ 無制限の受信者
- ✅ 1ドメイン認証
- ✅ 基本的な配信レポート

### 有料プランが必要な場合
- 月100通以上のメール送信
- 複数ドメインからの送信
- 高度な分析機能

## 🆘 トラブルシューティング

### メールが送信されない

1. **API Keyを確認**
   ```bash
   cat /home/user/webapp/.dev.vars | grep RESEND_API_KEY
   ```

2. **ログでエラーを確認**
   ```bash
   pm2 logs webapp --nostream | grep -i "error\|failed"
   ```

3. **よくあるエラー**
   - `401 Unauthorized`: API Keyが無効
   - `403 Forbidden`: ドメイン認証未完了
   - `from address must use a verified domain`: DNS設定が必要

### メールが届かない

1. **スパムフォルダを確認**
2. **Resendダッシュボードで配信ステータスを確認**
   - https://resend.com/emails
3. **ドメイン認証を完了**（本番環境の場合）

## 📚 詳細ドキュメント

- **完全セットアップガイド**: `RESEND_SETUP_GUIDE.md`
- **登録者管理ガイド**: `REGISTRATION_NOTIFICATION_GUIDE.md`
- **プロジェクトREADME**: `README.md`

## 🎉 次のステップ

1. ✅ Resend API Keyを取得
2. ✅ `.dev.vars` に設定
3. ✅ テスト登録を実行
4. ✅ メールを確認
5. ✅ 本番環境に設定
6. ✅ ドメイン認証を完了

---

**質問があればお気軽にお知らせください！** 🚀
