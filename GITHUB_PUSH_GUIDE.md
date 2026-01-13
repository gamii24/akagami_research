# GitHubへのプッシュ手順

## 前提条件
✅ GitHubアカウントを持っている
✅ GitHubで新しいリポジトリを作成済み

---

## 手順

### 1. GitHubで新しいリポジトリを作成
- Repository name: `akagami-research` (例)
- Public/Privateを選択
- ⚠️ 「Add a README file」などは**チェックを外す**

### 2. リポジトリURLをコピー
作成後に表示されるHTTPS URLをコピー:
```
https://github.com/YOUR_USERNAME/akagami-research.git
```

### 3. コマンドを実行

#### A. リモートリポジトリを追加
```bash
cd /home/user/webapp
git remote add origin https://github.com/YOUR_USERNAME/akagami-research.git
```

#### B. ブランチ名を確認
```bash
git branch
# * main が表示されればOK
```

#### C. プッシュ
```bash
# 初回プッシュ（-u でデフォルトブランチを設定）
git push -u origin main

# 2回目以降は単に
git push
```

---

## 📝 プッシュ時の注意点

### 認証について
GitHubへのプッシュには認証が必要です：

#### 方法1: Personal Access Token（推奨）
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」をクリック
3. スコープで「repo」にチェック
4. トークンを生成してコピー
5. プッシュ時にパスワードの代わりにトークンを入力

#### 方法2: GitHub CLI（gh コマンド）
```bash
# GitHub CLIでログイン
gh auth login

# プッシュ
git push -u origin main
```

---

## 🔐 認証情報の保存（オプション）

毎回認証情報を入力したくない場合：

```bash
# 認証情報をキャッシュに保存（15分間）
git config --global credential.helper cache

# 認証情報を永続的に保存（慎重に使用）
git config --global credential.helper store
```

---

## ✅ 成功後の確認

プッシュが成功すると：
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
...
To https://github.com/YOUR_USERNAME/akagami-research.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

GitHubのリポジトリページをリロードすると、すべてのファイルが表示されます！

---

## 📚 プッシュ後に確認できるドキュメント

GitHubで以下のファイルがMarkdown形式で見やすく表示されます：

- **README.md** - プロジェクト概要
- **QUICK_REFERENCE.md** - クイックリファレンス
- **INTERNAL_DOCUMENTATION.md** - 完全版マニュアル
- **SEO_CHECKLIST.md** - SEOチェックリスト
- **STRUCTURED_DATA_TEST.md** - 構造化データテスト

例:
```
https://github.com/YOUR_USERNAME/akagami-research/blob/main/README.md
https://github.com/YOUR_USERNAME/akagami-research/blob/main/QUICK_REFERENCE.md
```

---

## 🔄 今後の更新方法

ファイルを変更した後：

```bash
cd /home/user/webapp

# 変更を確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "Update: 変更内容の説明"

# プッシュ
git push
```

---

## 🆘 トラブルシューティング

### エラー: "fatal: remote origin already exists"
```bash
# リモートを削除して再追加
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/akagami-research.git
```

### エラー: "Updates were rejected because the remote contains work"
```bash
# 強制プッシュ（初回のみ）
git push -u origin main --force
```

### 認証エラー
- Personal Access Tokenを使用する
- または `gh auth login` でGitHub CLIでログイン

---

## 📞 サポート

- GitHub公式ドキュメント: https://docs.github.com/
- Personal Access Token作成: https://github.com/settings/tokens

**最終更新**: 2026年1月13日
