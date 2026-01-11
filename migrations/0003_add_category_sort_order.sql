-- Add sort_order column to categories table
ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Update existing categories with sort_order based on their current order
UPDATE categories SET sort_order = id * 10;
