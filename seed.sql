-- Insert default categories
INSERT OR IGNORE INTO categories (name, description) VALUES 
  ('技術資料', '技術関連のPDF資料'),
  ('ビジネス', 'ビジネス・経営関連の資料'),
  ('学術論文', '学術論文・研究資料'),
  ('マニュアル', '各種マニュアル・ガイド'),
  ('その他', 'その他の資料');

-- Insert common tags
INSERT OR IGNORE INTO tags (name) VALUES 
  ('重要'),
  ('参照頻度高'),
  ('最新'),
  ('アーカイブ'),
  ('要確認');
