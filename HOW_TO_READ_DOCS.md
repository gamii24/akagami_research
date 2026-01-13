# 📚 ドキュメントの見方

Akagami Researchプロジェクトのドキュメントは、以下の方法でアクセスできます。

---

## 🌐 方法1: ブラウザで直接開く（推奨）

### GitHubリポジトリで見る
GitHubにプッシュしている場合、ブラウザで見やすく表示されます：

```
https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/QUICK_REFERENCE.md
https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/INTERNAL_DOCUMENTATION.md
```

---

## 📁 方法2: ローカルで開く

### A. VS Codeで開く（推奨）
1. VS Codeでプロジェクトフォルダを開く
2. 以下のファイルをクリック：
   - `QUICK_REFERENCE.md` - クイックリファレンス
   - `INTERNAL_DOCUMENTATION.md` - 完全版マニュアル
   - `SEO_CHECKLIST.md` - SEOチェックリスト
3. **Ctrl+Shift+V** (Windows) または **Cmd+Shift+V** (Mac) でプレビュー表示

### B. ブラウザで開く
1. プロジェクトフォルダに移動：
   ```bash
   cd /home/user/webapp
   ```

2. Markdownをブラウザで見る：
   - Chromeの拡張機能「Markdown Preview Plus」をインストール
   - ファイルをブラウザにドラッグ&ドロップ

### C. ターミナルで見る（簡易）
```bash
cd /home/user/webapp
cat QUICK_REFERENCE.md
# または
less QUICK_REFERENCE.md
```

---

## 📄 ドキュメント一覧

| ファイル名 | 説明 | パス |
|-----------|------|------|
| **QUICK_REFERENCE.md** | 1ページ完結のクイックリファレンス<br>（URL、パスワード、よく使うコマンド） | `/home/user/webapp/QUICK_REFERENCE.md` |
| **INTERNAL_DOCUMENTATION.md** | 完全版の社内共有マニュアル<br>（全機能の詳細説明、8,500文字以上） | `/home/user/webapp/INTERNAL_DOCUMENTATION.md` |
| **README.md** | プロジェクト概要と技術説明 | `/home/user/webapp/README.md` |
| **SEO_CHECKLIST.md** | SEO対策チェックリスト | `/home/user/webapp/SEO_CHECKLIST.md` |
| **STRUCTURED_DATA_TEST.md** | 構造化データのテスト方法 | `/home/user/webapp/STRUCTURED_DATA_TEST.md` |

---

## 🔗 重要な情報だけ知りたい場合

### 管理画面
```
URL: https://akagami.net/admin
パスワード: akagami-admin-2024
```

### Google Analytics
```
測定ID: G-JPMZ82RMGG
ダッシュボード: https://analytics.google.com/analytics/web/#/p13287130556/reports/intelligenthome
```

### カテゴリID（よく使う）
| ID | カテゴリ | ID | カテゴリ |
|----|---------|----|---------| 
| 1 | YouTube | 6 | TikTok |
| 2 | Threads | 10 | 生成AI |
| 5 | Instagram | 8 | マーケティング |

---

## 💡 Tips

### ドキュメントを印刷する
1. VS Codeでファイルを開く
2. プレビュー表示（Ctrl+Shift+V）
3. ブラウザで開く → 印刷（Ctrl+P）

### ドキュメントをPDFにする
1. VS Codeでプレビュー表示
2. 「Markdown PDF」拡張機能をインストール
3. 右クリック → "Markdown PDF: Export (pdf)"

### 検索する
```bash
# 特定のキーワードを検索
grep -n "パスワード" /home/user/webapp/INTERNAL_DOCUMENTATION.md

# すべてのMarkdownファイルから検索
grep -r "Google Analytics" /home/user/webapp/*.md
```

---

## 🆘 困ったときは

- **ファイルが見つからない**: `/home/user/webapp/` フォルダにあるか確認
- **文字化けする**: UTF-8でファイルを開く
- **見にくい**: VS Codeのプレビュー機能を使う

---

**作成日**: 2026年1月13日  
**最終更新**: 2026年1月13日
