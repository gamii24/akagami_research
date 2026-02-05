-- Add thumbnail_url column back to pdfs table
ALTER TABLE pdfs ADD COLUMN thumbnail_url TEXT;

-- Add description column back for better SEO
ALTER TABLE pdfs ADD COLUMN description TEXT;
