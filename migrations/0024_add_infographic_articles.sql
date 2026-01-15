-- Add Infographic Articles Table
CREATE TABLE IF NOT EXISTS infographic_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id INTEGER,
  thumbnail_url TEXT,
  content TEXT NOT NULL,
  summary TEXT,
  published BOOLEAN DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_infographic_published ON infographic_articles(published);
CREATE INDEX IF NOT EXISTS idx_infographic_category ON infographic_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_infographic_slug ON infographic_articles(slug);
CREATE INDEX IF NOT EXISTS idx_infographic_sort_order ON infographic_articles(sort_order);
