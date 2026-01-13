-- Add PDF reviews and ratings system

-- Reviews table
CREATE TABLE IF NOT EXISTS pdf_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pdf_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pdf_id, user_id),
  FOREIGN KEY (pdf_id) REFERENCES pdfs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Review helpful votes table (like "Was this helpful?")
CREATE TABLE IF NOT EXISTS review_helpful (
  review_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (review_id, user_id),
  FOREIGN KEY (review_id) REFERENCES pdf_reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pdf_reviews_pdf_id ON pdf_reviews(pdf_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reviews_user_id ON pdf_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reviews_rating ON pdf_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON review_helpful(review_id);

-- Add average rating and review count to PDFs table
ALTER TABLE pdfs ADD COLUMN average_rating REAL DEFAULT 0;
ALTER TABLE pdfs ADD COLUMN review_count INTEGER DEFAULT 0;

-- Create index for sorting by rating
CREATE INDEX IF NOT EXISTS idx_pdfs_average_rating ON pdfs(average_rating);
