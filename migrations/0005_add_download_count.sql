-- Add download_count column to pdfs table
ALTER TABLE pdfs ADD COLUMN download_count INTEGER DEFAULT 0;

-- Create index for download_count for sorting
CREATE INDEX IF NOT EXISTS idx_pdfs_download_count ON pdfs(download_count);
