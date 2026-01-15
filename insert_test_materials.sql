-- Insert test categories
INSERT OR IGNORE INTO categories (id, name, description) VALUES
(1, 'YouTube運用', 'YouTubeチャンネル運営に関する資料'),
(2, 'Instagram運用', 'Instagram運用に関する資料'),
(3, 'TikTok運用', 'TikTok運用に関する資料'),
(4, '生成AI活用', '生成AI・AIツールに関する資料');

-- Insert test tags
INSERT OR IGNORE INTO tags (id, name) VALUES
(1, 'YouTube'),
(2, 'Instagram'),
(3, 'TikTok'),
(4, '生成AI'),
(5, 'マーケティング'),
(6, 'SNS運用'),
(7, '収益化'),
(8, '動画編集');

-- Insert test PDFs
INSERT INTO pdfs (title, description, google_drive_url, category_id, thumbnail_url, created_at) VALUES
('YouTube完全攻略ガイド 2024年版', 'YouTubeでチャンネルを成長させるための最新戦略とテクニックを網羅した完全ガイド。登録者を増やす方法から収益化まで徹底解説。', 'https://drive.google.com/file/d/SAMPLE1', 1, '/placeholder-thumbnail.jpg', datetime('now')),
('Instagram運用マニュアル', 'Instagramでフォロワーを増やし、エンゲージメントを高めるための実践的なノウハウをまとめた資料。', 'https://drive.google.com/file/d/SAMPLE2', 2, '/placeholder-thumbnail.jpg', datetime('now')),
('TikTokバズる動画の作り方', 'TikTokでバズる動画を作るためのコツとテクニック。アルゴリズムを理解して効果的に活用する方法。', 'https://drive.google.com/file/d/SAMPLE3', 3, '/placeholder-thumbnail.jpg', datetime('now')),
('生成AI活用術 完全版', 'ChatGPTやMidjourneyなどの生成AIツールをビジネスに活用するための実践ガイド。', 'https://drive.google.com/file/d/SAMPLE4', 4, '/placeholder-thumbnail.jpg', datetime('now')),
('SNSマーケティング基礎講座', 'YouTube、Instagram、TikTokを活用したSNSマーケティングの基礎を学べる入門資料。', 'https://drive.google.com/file/d/SAMPLE5', 1, '/placeholder-thumbnail.jpg', datetime('now')),
('YouTubeショート動画攻略法', 'YouTubeショート動画で再生回数を伸ばすためのテクニックと戦略をまとめた資料。', 'https://drive.google.com/file/d/SAMPLE6', 1, '/placeholder-thumbnail.jpg', datetime('now')),
('Instagramリール完全ガイド', 'Instagramリールを使ってフォロワーを増やすための実践的なノウハウ集。', 'https://drive.google.com/file/d/SAMPLE7', 2, '/placeholder-thumbnail.jpg', datetime('now')),
('AI画像生成ツール活用法', 'Midjourney、Stable Diffusion、DALLEなどのAI画像生成ツールの使い方とビジネス活用法。', 'https://drive.google.com/file/d/SAMPLE8', 4, '/placeholder-thumbnail.jpg', datetime('now'));

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
