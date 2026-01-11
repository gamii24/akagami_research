-- Remove unused columns from pdfs table
-- Since SQLite doesn't support DROP COLUMN directly, we need to recreate the table

-- Step 1: Create new table without unused columns
CREATE TABLE pdfs_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  google_drive_url TEXT NOT NULL,
  category_id INTEGER,
  download_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Step 2: Copy data from old table to new table
INSERT INTO pdfs_new (id, title, google_drive_url, category_id, download_count, created_at)
SELECT id, title, google_drive_url, category_id, download_count, created_at
FROM pdfs;

-- Step 3: Drop old table
DROP TABLE pdfs;

-- Step 4: Rename new table to original name
ALTER TABLE pdfs_new RENAME TO pdfs;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_pdfs_category_id ON pdfs(category_id);
CREATE INDEX IF NOT EXISTS idx_pdfs_created_at ON pdfs(created_at);
