# 🚨 緊急: Cloudflare D1バインディング設定が必要です

## 問題の原因
**ニュースページが開かない原因は、Cloudflare PagesプロジェクトにD1データベースバインディングが設定されていないためです。**

APIエラーメッセージ:
```
Database not configured. Please add D1 binding in Cloudflare Dashboard.
```

## 📊 確認済み事項
- ✅ D1データベース `akagami-research-production` は存在する
- ✅ データベースには21件のニュース記事が保存されている
- ✅ ローカル環境では正常に動作している
- ❌ **本番環境のPagesプロジェクトにバインディングが設定されていない**

## 🔧 修正手順（5分で完了）

### ステップ1: Cloudflare Dashboardにアクセス
1. ブラウザで https://dash.cloudflare.com を開く
2. Cloudflareアカウントにログイン

### ステップ2: Pagesプロジェクトを選択
1. 左サイドバーから **Workers & Pages** をクリック
2. **akagami-research** プロジェクトをクリック

### ステップ3: Settings画面を開く
1. 上部のタブから **Settings** をクリック
2. 下にスクロールして **Functions** セクションを見つける

### ステップ4: D1バインディングを追加
1. **D1 database bindings** セクションを見つける
2. **Add binding** ボタンをクリック
3. 以下の情報を入力：
   - **Variable name (required)**: `DB` （大文字で正確に入力）
   - **D1 database**: ドロップダウンから `akagami-research-production` を選択
4. **Save** ボタンをクリック

### ステップ5: 自動再デプロイを待つ
- 保存後、Cloudflareが自動的にプロジェクトを再デプロイします
- 約30秒～1分待ちます

### ステップ6: 動作確認
1. ブラウザで https://akagami.net/news を開く
2. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete または Cmd+Shift+Delete）
3. ページをリロード
4. **21件のニュース記事が表示されるはずです！**

## 📸 参考スクリーンショット（設定画面）

Settings → Functions → D1 database bindings:
```
┌─────────────────────────────────────────┐
│ D1 database bindings                    │
├─────────────────────────────────────────┤
│ Variable name: DB                       │
│ D1 database: akagami-research-production│
│                                         │
│ [Add binding]                           │
└─────────────────────────────────────────┘
```

## 🎯 正しい設定値

| 項目 | 値 |
|------|-----|
| Variable name | `DB` |
| D1 database | `akagami-research-production` |
| Database ID | `c5d4dce7-e94e-489a-880f-36e6056f74c6` |

## ⚠️ 重要な注意事項

1. **Variable nameは必ず大文字の`DB`にしてください**
   - `db`や`Db`ではなく、正確に`DB`と入力
   
2. **データベース名を間違えないでください**
   - 正: `akagami-research-production`
   - 誤: `webapp-production`や`akagami-production`

3. **Production環境とPreview環境の両方に設定**
   - Production環境: 上記の手順で設定
   - Preview環境: 同じ画面で **Preview** タブをクリックして同様に設定

## 🔍 トラブルシューティング

### 設定後もエラーが出る場合
1. **ブラウザのハードリフレッシュ**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Cloudflareキャッシュをパージ**:
   - Dashboard → Cache → Purge Everything

3. **再デプロイを手動実行**:
   ```bash
   cd /home/user/webapp
   npx wrangler pages deploy dist --project-name akagami-research
   ```

### バインディングが表示されない場合
- Dashboardで **D1 database bindings** セクションが見つからない場合:
  1. **Functions** セクション全体が表示されているか確認
  2. ページを下までスクロール
  3. ブラウザをリロード

## 📝 なぜこの問題が発生したか

Cloudflare Pagesのバインディング設定は、以下の方法で設定できます：
1. **Dashboard UI**（最も確実）← 今回の推奨方法
2. `wrangler.toml`ファイル（Workersのみ）
3. `wrangler pages project create`コマンド（初回のみ）

今回は`wrangler pages deploy`コマンドでデプロイしているため、`wrangler.jsonc`の設定が反映されていませんでした。

## ✅ 設定完了後の確認

設定が正しく完了すると、以下が表示されるはずです：

**ニュースページ（https://akagami.net/news）:**
- ✅ 21件のニュース記事が一覧表示
- ✅ 各記事にタイトル、要約、URL、カテゴリが表示
- ✅ 「いいね」ボタンが機能
- ✅ JavaScriptエラーなし

---

## 🚀 設定手順の要約

1. https://dash.cloudflare.com にアクセス
2. Workers & Pages → akagami-research
3. Settings → Functions
4. D1 database bindings → Add binding
5. Variable name: `DB`, D1 database: `akagami-research-production`
6. Save
7. 30秒待つ
8. https://akagami.net/news を開く

**この設定は一度だけ行えば、今後は永続的に有効です。**

---

設定完了後、必ずお知らせください。正常に動作しているか確認します。
