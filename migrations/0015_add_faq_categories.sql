-- Add SNS category to FAQ table
ALTER TABLE instagram_faq ADD COLUMN sns_category TEXT DEFAULT 'instagram';

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_faq_category ON instagram_faq(sns_category, is_published, sort_order);

-- Update existing data to Instagram category
UPDATE instagram_faq SET sns_category = 'instagram' WHERE sns_category IS NULL;
