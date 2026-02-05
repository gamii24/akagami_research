# ✅ Microsoft Clarity 導入完了チェックリスト

## 🎉 導入ステータス

### ✅ 完了済み

1. **Clarityスクリプト追加**
   - ✅ `src/renderer.tsx` にClarityスクリプトを追加
   - ✅ Google Analyticsの後に配置
   - ✅ 本番環境にデプロイ済み

2. **CSP設定**
   - ✅ `scriptSrc` に `https://www.clarity.ms` 追加
   - ✅ `connectSrc` に `https://www.clarity.ms` と `https://*.clarity.ms` 追加
   - ✅ セキュリティヘッダー設定完了

3. **ドキュメント作成**
   - ✅ `CLARITY_SETUP.md` - 詳細なセットアップガイド
   - ✅ `README.md` - Clarity導入セクション追加
   - ✅ このチェックリスト

4. **デプロイ**
   - ✅ コミット: `9272671 - Add Microsoft Clarity heatmap integration`
   - ✅ デプロイURL: https://690c449d.akagami-net.pages.dev
   - ✅ 本番環境: https://akagami.net （反映済み）
   - ✅ GitHubプッシュ: 完了

### ⚠️ 未完了（ユーザー作業必要）

1. **Clarityアカウント作成**
   - ❌ https://clarity.microsoft.com/ でアカウント作成
   - ❌ 新規プロジェクト作成
   - ❌ Project ID取得

2. **Project ID設定**
   - ❌ `src/renderer.tsx` の167行目付近
   - ❌ `CLARITY_PROJECT_ID` を実際のIDに置換
   - ❌ 再ビルド・デプロイ

---

## 📋 次のステップ

### ステップ1: Clarityアカウント作成（5分）

1. **Clarityにアクセス**
   ```
   https://clarity.microsoft.com/
   ```

2. **Microsoftアカウントでログイン**
   - 既存のMicrosoftアカウントを使用
   - または無料で新規作成

3. **新しいプロジェクト作成**
   - ボタン: 「New Project」
   - プロジェクト名: `Akagami.net`
   - ウェブサイトURL: `https://akagami.net`
   - 業界: `Education` または `Business`
   - 「Create」をクリック

4. **Project IDをコピー**
   - プロジェクト作成後、**Project ID**が表示される
   - 例: `abc123xyz`（8-10文字の英数字）
   - このIDを次のステップで使用

### ステップ2: コードに設定（3分）

1. **ファイルを編集**
   ```bash
   cd /home/user/webapp
   nano src/renderer.tsx
   ```

2. **167行目付近を検索**
   - `Ctrl+W` で検索
   - キーワード: `CLARITY_PROJECT_ID`

3. **Project IDを置換**
   ```typescript
   // 変更前
   })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
   
   // 変更後（ステップ1で取得したIDを使用）
   })(window, document, "clarity", "script", "abc123xyz");
   ```

4. **保存**
   - `Ctrl+X` → `Y` → `Enter`

### ステップ3: デプロイ（2分）

```bash
# コミット
cd /home/user/webapp
git add -A
git commit -m "Configure Microsoft Clarity Project ID"

# ビルド
npm run build

# デプロイ
npx wrangler pages deploy dist --project-name akagami-net

# GitHubにプッシュ
git push origin main
```

### ステップ4: 動作確認（10-15分）

1. **サイトにアクセス**
   ```
   https://akagami.net/
   ```
   - いくつかのページを開く
   - PDFをクリックする
   - カテゴリを切り替える

2. **Clarityダッシュボード確認**
   ```
   https://clarity.microsoft.com/
   ```
   - プロジェクトをクリック
   - 「Recordings」タブを開く
   - **最初のデータ表示まで5-15分かかります**

3. **データが表示されたら成功！**
   - セッションリプレイが再生できる
   - ヒートマップが見える（30セッション以上必要）

---

## 🔍 トラブルシューティング

### データが表示されない場合

1. **ブラウザの開発者ツールで確認**
   - F12キーで開発者ツールを開く
   - 「Console」タブでエラーを確認
   - Clarityスクリプトが読み込まれているか確認

2. **Project IDを再確認**
   ```bash
   cd /home/user/webapp
   grep "CLARITY_PROJECT_ID" src/renderer.tsx
   ```
   - 出力: `CLARITY_PROJECT_ID` → まだ未設定
   - 出力: `abc123xyz` → 設定済み

3. **Clarityダッシュボードで確認**
   - Settings → Project ID が正しいか確認
   - Project Status が「Active」になっているか確認

4. **広告ブロッカーを無効化**
   - 一部の広告ブロッカーがClarityをブロックする場合がある
   - テスト時は一時的に無効化

---

## 📊 Clarityで確認できること

### 1. ヒートマップ

- **クリックマップ**: どのボタンやリンクが押されているか
- **スクロールマップ**: ページのどこまでスクロールされているか
- **ムーブメントマップ**: マウスの動きを可視化

### 2. セッションリプレイ

- **ユーザーの実際の操作**: クリック、スクロール、入力
- **ページ遷移**: どのページからどのページへ移動したか
- **エラー検出**: JavaScriptエラーやフラストレーション

### 3. インサイト

- **人気ページ**: 最もアクセスされているページ
- **離脱ポイント**: ユーザーがどこで離脱しているか
- **デバイス別**: モバイル vs PC の行動の違い

---

## 🎯 改善のヒント

### 問題発見 → 改善 のサイクル

1. **Clarityで問題を発見**
   - 例: 「PDFカードのダウンロードボタンがクリックされていない」

2. **改善を実施**
   - 例: 「カード全体をクリック可能に変更」

3. **効果を測定**
   - 例: 「クリック率が2倍に増加」

4. **さらなる改善**
   - 継続的に最適化

---

## 📚 参考資料

- **セットアップガイド**: `CLARITY_SETUP.md`
- **README**: `README.md` のClarityセクション
- **公式ドキュメント**: https://docs.microsoft.com/ja-jp/clarity/
- **ダッシュボード**: https://clarity.microsoft.com/

---

## ✅ 完了確認

セットアップが完了したら、以下を確認してください：

- [ ] Clarityアカウント作成完了
- [ ] Project ID取得完了
- [ ] `src/renderer.tsx` に Project ID 設定完了
- [ ] ビルド・デプロイ完了
- [ ] GitHubプッシュ完了
- [ ] サイトにアクセスしてテスト完了
- [ ] Clarityダッシュボードでデータ確認完了

**全てチェックできたら、Clarity導入は完了です！** 🎉

---

## 💡 次のステップ

Clarity導入後は、以下の改善を検討してください：

1. **メタタグ・OGP最適化**（SEO・SNSシェア向上）
2. **検索機能強化**（複数タグ選択、検索履歴）
3. **ユーザー体験の向上**（無限スクロール、アニメーション改善）
4. **A/Bテスト**（Clarityのデータを活用）

質問があれば、いつでもお気軽にお知らせください！
