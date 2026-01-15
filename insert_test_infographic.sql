-- Insert test infographic articles
INSERT INTO infographic_articles (title, slug, category_id, thumbnail_url, content, summary, published, created_at) VALUES
('Threadsのアメリカ企業運用事例', 'threads-us-cases', 2, '/placeholder-thumbnail.jpg', '<h2>Threadsアメリカ企業事例</h2><p>詳細なコンテンツ...</p>', 'アメリカ企業のThreads運用事例をまとめた記事', 1, datetime('now')),
('Threads運用の小手先テクニック', 'threads-tips-tricks', 2, '/placeholder-thumbnail.jpg', '<h2>Threads運用テクニック</h2><p>詳細なコンテンツ...</p>', 'Threads運用に役立つテクニック集', 1, datetime('now')),
('Threadsの日本国内企業運用事例', 'threads-japan-cases', 2, '/placeholder-thumbnail.jpg', '<h2>Threads日本企業事例</h2><p>詳細なコンテンツ...</p>', '日本企業のThreads運用事例をまとめた記事', 1, datetime('now'));
