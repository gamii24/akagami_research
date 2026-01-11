-- Add pdf_file_data column to store PDF files as base64
ALTER TABLE pdfs ADD COLUMN pdf_file_data TEXT;

-- Add file_name column to store original filename
ALTER TABLE pdfs ADD COLUMN file_name TEXT;

-- Make google_drive_url optional (can be NULL if pdf_file_data is provided)
-- Note: SQLite doesn't support ALTER COLUMN, so we'll just allow NULL values
