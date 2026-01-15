# カテゴリ一覧ページ 並び順改善レポート

## 📋 実施内容

### 要件
カテゴリ一覧ページのカードを、資料数が多い順に自動で並び替える。

### 変更内容

#### 変更前
```sql
ORDER BY c.sort_order ASC, c.name ASC
```
- `sort_order`（手動設定の順序）が優先
- 同じ`sort_order`の場合は名前順

#### 変更後
```sql
ORDER BY pdf_count DESC, c.name ASC
```
- **資料数（pdf_count）の多い順が優先**
- 同じ資料数の場合は名前順（五十音順）

## 📊 並び順の変化

### 変更前（sort_order順）
管理画面で設定した順序に従う（手動管理が必要）

### 変更後（資料数順）
```
1. Instagram (10件)      ← 最も資料が多い
2. TikTok (9件)
3. その他 (8件)
4. ブログ (5件)
5. Threads (4件)
6. テックの偉人 (3件)
7. 画像&動画生成 (2件)
8. AEO対策 (0件)        ← 資料数が同じ場合は
9. LINE公式 (0件)          名前順（五十音順）
10. Podcast (0件)
11. X (0件)
12. YouTube (0件)
13. note (0件)
14. マーケティング (0件)
15. 生成AI (0件)
```

## 💻 技術的変更

### SQL クエリの修正
```sql
-- 変更前
SELECT 
  c.id,
  c.name,
  c.description,
  c.download_url,
  c.sort_order,
  COUNT(p.id) as pdf_count
FROM categories c
LEFT JOIN pdfs p ON c.id = p.category_id
GROUP BY c.id, c.name, c.description, c.download_url, c.sort_order
ORDER BY c.sort_order ASC, c.name ASC  -- ❌ 手動順序

-- 変更後
SELECT 
  c.id,
  c.name,
  c.description,
  c.download_url,
  c.sort_order,
  COUNT(p.id) as pdf_count
FROM categories c
LEFT JOIN pdfs p ON c.id = p.category_id
GROUP BY c.id, c.name, c.description, c.download_url, c.sort_order
ORDER BY pdf_count DESC, c.name ASC  -- ✅ 資料数順 → 名前順
```

### コードの変更箇所
- **ファイル**: `src/index.tsx`
- **行数**: 5400行目
- **変更内容**: `ORDER BY` 句の変更のみ

## ✅ テスト結果

### データベース確認
```bash
# 本番データベースで並び順を確認
SELECT c.name, COUNT(p.id) as pdf_count 
FROM categories c 
LEFT JOIN pdfs p ON c.id = p.category_id 
GROUP BY c.id, c.name 
ORDER BY pdf_count DESC, c.name ASC
```

**結果:**
| 順位 | カテゴリ名 | 資料数 |
|------|------------|--------|
| 1 | Instagram | 10件 |
| 2 | TikTok | 9件 |
| 3 | その他 | 8件 |
| 4 | ブログ | 5件 |
| 5 | Threads | 4件 |
| 6 | テックの偉人 | 3件 |
| 7 | 画像&動画生成 | 2件 |
| 8-15 | その他（0件のカテゴリ） | 0件 |

### 本番環境確認
```bash
# カテゴリページのHTML確認
curl https://akagami.net/categories | grep -o '<h3.*>.*</h3>'
```

**結果:**
- ✅ Instagram (10件) が最初に表示
- ✅ TikTok (9件) が2番目に表示
- ✅ その他 (8件) が3番目に表示
- ✅ 資料数の多い順に正しく並んでいる
- ✅ 資料数が同じ（0件）のカテゴリは名前順

## 🎯 改善効果

### ユーザビリティ向上
1. **直感的な並び順**: 資料が多い = 人気/充実したカテゴリが上位に
2. **発見しやすさ**: ユーザーがすぐに充実したカテゴリを見つけられる
3. **自動更新**: 新しい資料が追加されると自動的に順位が変わる

### メンテナンス性向上
1. **手動管理不要**: `sort_order`の手動設定が不要になった
2. **動的な順序**: 資料数の変化に自動的に対応
3. **管理負担軽減**: カテゴリの順序を都度更新する必要がない

## 📱 表示例

### デスクトップ表示
```
┌──────────┬──────────┬──────────┐
│ Instagram│ TikTok   │ その他   │
│   10件   │   9件    │   8件    │
└──────────┴──────────┴──────────┘
┌──────────┬──────────┬──────────┐
│ ブログ   │ Threads  │テックの.. │
│   5件    │   4件    │   3件    │
└──────────┴──────────┴──────────┘
```

### モバイル表示
```
┌──────────┬──────────┐
│ Instagram│ TikTok   │
│   10件   │   9件    │
├──────────┼──────────┤
│ その他   │ ブログ   │
│   8件    │   5件    │
└──────────┴──────────┘
```

## 🚀 デプロイ情報

- **本番URL**: https://akagami.net/categories
- **最新デプロイ**: https://b3910339.akagami-research.pages.dev
- **ビルドサイズ**: 343.06 KB (変更なし)
- **ビルド時間**: 1.27秒
- **デプロイ状態**: ✅ 成功

## 📝 修正ファイル

### 変更ファイル
- `src/index.tsx`: カテゴリ一覧ページのSQLクエリ変更（1行のみ）

### 影響範囲
- カテゴリ一覧ページ（/categories）のみ
- トップページのカテゴリ表示は変更なし（sort_order順を維持）

## 🎨 並び順のロジック

### 第1優先: 資料数（降順）
```sql
ORDER BY pdf_count DESC
```
- 資料数が多いカテゴリが上位に表示
- 10件 > 9件 > 8件 > ... > 0件

### 第2優先: カテゴリ名（昇順）
```sql
, c.name ASC
```
- 資料数が同じ場合は名前順（五十音順/アルファベット順）
- AEO対策 < LINE公式 < Podcast < X < YouTube...

## 🔄 動的な更新

### 資料追加時
```
変更前: YouTube (0件) → 下の方に表示
↓ 新しい資料を3件追加
変更後: YouTube (3件) → テックの偉人と同じ位置に自動移動
```

### 自動ソート
- 資料が追加されると、次回ページ読み込み時に自動的に順位が変わる
- 手動でのカテゴリ並び替え作業が不要
- リアルタイムで人気/充実度が反映される

## 📊 データ整合性

### COUNT() 関数の精度
```sql
COUNT(p.id) as pdf_count
```
- NULL値は自動的に除外される
- LEFT JOINで資料がないカテゴリも正しく0件としてカウント
- グループ化により各カテゴリごとに正確にカウント

### ソートの安定性
```sql
ORDER BY pdf_count DESC, c.name ASC
```
- 第1キー: 数値（pdf_count）で確実にソート
- 第2キー: 文字列（name）で同点時の順序を保証
- データベースレベルでソートされるため高速

## 🎯 今後の改善案

### ソートオプション追加
1. **ユーザー選択式**: 資料数順 / 名前順 / 更新日順を選択可能に
2. **フィルタリング**: 資料数1件以上のカテゴリのみ表示
3. **検索機能**: カテゴリ名で絞り込み

### 表示の工夫
1. **人気バッジ**: 資料数10件以上に「人気」バッジ表示
2. **新着バッジ**: 最近追加されたカテゴリにマーク
3. **進捗バー**: 各カテゴリの充実度を視覚化

---

**作成日**: 2026-01-15  
**ステータス**: ✅ 完了  
**確認URL**: https://akagami.net/categories
