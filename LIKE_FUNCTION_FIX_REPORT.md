# いいね機能エラー修正レポート

## 🐛 問題の原因

ニュースページの「いいね」ボタンをクリックするとエラーが発生していました。

### 根本原因
JavaScript関数のスコープの問題でした。`toggleLike`、`showNewsDetail`、`closeNewsDetail`、`toggleSummary`の各関数が、スクリプト内のローカルスコープで定義されていたため、HTML要素の`onclick`属性から直接呼び出すことができませんでした。

```javascript
// 🔴 問題のあるコード（ローカルスコープ）
async function toggleLike(newsId, index) {
  // ...
}

// HTML内
<button onclick="toggleLike(1, 0)">いいね</button>  // ❌ 関数が見つからない
```

## ✅ 修正内容

すべての関数を`window`オブジェクトに明示的に割り当て、グローバルスコープからアクセス可能にしました。

### 1. toggleLike関数
```javascript
// ✅ 修正後（グローバルスコープ）
window.toggleLike = async function(newsId, index) {
  if (!isAuthenticated) {
    showToast('いいねするにはログインが必要です', 'error');
    openAuthModal();
    return;
  }

  try {
    const response = await axios.post(`/api/news/${newsId}/like`, {}, { withCredentials: true });
    
    // Update local data
    newsData[index].user_liked = response.data.liked ? 1 : 0;
    newsData[index].likes_count = response.data.liked 
      ? parseInt(newsData[index].likes_count) + 1 
      : parseInt(newsData[index].likes_count) - 1;
    
    // Re-render
    renderNews();
    
    showToast(response.data.liked ? 'いいねしました！' : 'いいねを取り消しました', 'success');
  } catch (error) {
    console.error('Failed to toggle like:', error);
    showToast('エラーが発生しました', 'error');
  }
};
```

### 2. showNewsDetail関数
```javascript
window.showNewsDetail = function(index) {
  // モーバイルでニュース詳細モーダルを表示
  // ...
};
```

### 3. closeNewsDetail関数
```javascript
window.closeNewsDetail = function() {
  // ニュース詳細モーダルを閉じる
  // ...
};
```

### 4. toggleSummary関数
```javascript
window.toggleSummary = function(index) {
  // デスクトップで要約の展開/折りたたみ
  // ...
};
```

## 🔧 修正したファイル

- **src/index.tsx** - ニュースページのスクリプト部分

## 🎯 動作確認

### ローカル環境
```bash
# グローバル関数の確認
curl -s http://localhost:3000/news | grep "window.toggleLike"
# ✅ 出力: window.toggleLike
```

### 本番環境
- **URL**: https://akagami.net/news
- **最新デプロイ**: https://e128d9e1.akagami-research.pages.dev/news

## 📱 機能の動作フロー

### 1. 未ログイン時
```
ユーザーがいいねボタンをクリック
↓
「いいねするにはログインが必要です」トースト表示
↓
ログインモーダルを自動表示
```

### 2. ログイン済み時
```
ユーザーがいいねボタンをクリック
↓
POST /api/news/:id/like リクエスト送信
↓
サーバー側でいいね/いいね解除を実行
↓
レスポンスを受け取る（{ liked: true/false, message: ... }）
↓
ローカルデータを更新（likes_count、user_liked）
↓
ニュースリストを再レンダリング
↓
成功トースト表示（「いいねしました！」または「いいねを取り消しました」）
```

## 🎨 UI/UX

### デスクトップ
- 各ニュース記事の右上にハートアイコンといいね数
- 未いいね: グレーのアウトラインハート + グレーテキスト
- いいね済み: 赤いソリッドハート + 赤テキスト
- ホバー時: 色が濃くなる

### モバイル
- タイトル横にハートアイコンといいね数
- 同じカラースキーム
- タップで即座にいいね/いいね解除

## ✅ 完了確認

- [x] toggleLike関数をグローバル化
- [x] showNewsDetail関数をグローバル化
- [x] closeNewsDetail関数をグローバル化
- [x] toggleSummary関数をグローバル化
- [x] ローカル環境でビルド成功
- [x] ローカル環境で動作確認
- [x] 本番環境へデプロイ

## 🌐 デプロイ情報

- **デプロイ日時**: 2026-01-15 00:10
- **ビルドサイズ**: 343.22 kB
- **デプロイURL**: https://e128d9e1.akagami-research.pages.dev
- **本番URL**: https://akagami.net/news

## 🎉 修正完了

いいね機能が正常に動作するようになりました！
ログイン済みユーザーは、ニュース記事にいいねを付けたり外したりできます。
未ログインユーザーには、ログインを促すモーダルが表示されます。
