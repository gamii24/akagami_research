-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PDFs table (stores Google Drive link instead of file)
CREATE TABLE IF NOT EXISTS pdfs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  google_drive_url TEXT NOT NULL,
  category_id INTEGER,
  thumbnail_url TEXT,
  file_size TEXT,
  page_count INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- PDF-Tag relationship table (many-to-many)
CREATE TABLE IF NOT EXISTS pdf_tags (
  pdf_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (pdf_id, tag_id),
  FOREIGN KEY (pdf_id) REFERENCES pdfs(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pdfs_category_id ON pdfs(category_id);
CREATE INDEX IF NOT EXISTS idx_pdfs_created_at ON pdfs(created_at);
CREATE INDEX IF NOT EXISTS idx_pdf_tags_pdf_id ON pdf_tags(pdf_id);
CREATE INDEX IF NOT EXISTS idx_pdf_tags_tag_id ON pdf_tags(tag_id);
