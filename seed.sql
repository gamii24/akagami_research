-- Delete existing categories
DELETE FROM categories;

-- Insert new categories
INSERT INTO categories (name, description) VALUES 
  ('YouTube', 'YouTube関連の資料'),
  ('Threads', 'Threads関連の資料'),
  ('Podcast', 'Podcast関連の資料'),
  ('LINE公式', 'LINE公式アカウント関連の資料'),
  ('Instagram', 'Instagram関連の資料'),
  ('TikTok', 'TikTok関連の資料'),
  ('X', 'X (旧Twitter)関連の資料'),
  ('マーケティング', 'マーケティング全般の資料'),
  ('その他', 'その他の資料'),
  ('生成AI', '生成AI関連の資料'),
  ('画像&動画生成', '画像・動画生成関連の資料');

-- Keep existing tags
