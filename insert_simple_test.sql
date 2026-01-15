-- Insert test PDFs
INSERT INTO pdfs (title, google_drive_url, category_id, created_at) VALUES
('YouTube完全攻略ガイド 2024年版', 'https://drive.google.com/file/d/SAMPLE1', 1, datetime('now')),
('Instagram運用マニュアル', 'https://drive.google.com/file/d/SAMPLE2', 2, datetime('now')),
('TikTokバズる動画の作り方', 'https://drive.google.com/file/d/SAMPLE3', 3, datetime('now')),
('生成AI活用術 完全版', 'https://drive.google.com/file/d/SAMPLE4', 4, datetime('now')),
('SNSマーケティング基礎講座', 'https://drive.google.com/file/d/SAMPLE5', 1, datetime('now')),
('YouTubeショート動画攻略法', 'https://drive.google.com/file/d/SAMPLE6', 1, datetime('now')),
('Instagramリール完全ガイド', 'https://drive.google.com/file/d/SAMPLE7', 2, datetime('now')),
('AI画像生成ツール活用法', 'https://drive.google.com/file/d/SAMPLE8', 4, datetime('now'));

-- Link PDFs with tags
INSERT INTO pdf_tags (pdf_id, tag_id) VALUES
(1, 1), (1, 5), (1, 7),
(2, 2), (2, 5), (2, 6),
(3, 3), (3, 5),
(4, 4), (4, 5),
(5, 1), (5, 2), (5, 3), (5, 5),
(6, 1), (6, 8),
(7, 2), (7, 8),
(8, 4), (8, 5);
