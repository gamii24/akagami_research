-- Insert new categories with sort order
INSERT OR IGNORE INTO categories (name, description, sort_order) VALUES 
  ('YouTube', 'YouTube関連の資料', 10),
  ('Threads', 'Threads関連の資料', 20),
  ('Podcast', 'Podcast関連の資料', 30),
  ('LINE公式', 'LINE公式関連の資料', 40),
  ('Instagram', 'Instagram関連の資料', 50),
  ('TikTok', 'TikTok関連の資料', 60),
  ('X', 'X（旧Twitter）関連の資料', 70),
  ('note', 'note関連の資料', 80),
  ('ブログ', 'ブログ関連の資料', 90),
  ('マーケティング', 'マーケティング関連の資料', 100),
  ('AEO対策', 'AEO対策関連の資料', 110),
  ('生成AI', '生成AI関連の資料', 120),
  ('画像&動画生成', '画像&動画生成関連の資料', 130),
  ('その他', 'その他の資料', 140);
