-- Step 1: Create a temporary table to store the mapping
CREATE TEMP TABLE user_id_mapping (
  old_id INTEGER,
  new_id INTEGER
);

-- Step 2: Insert the mapping for users with id >= 10000
-- They will be renumbered starting from 2
INSERT INTO user_id_mapping (old_id, new_id)
SELECT id, ROW_NUMBER() OVER (ORDER BY id) + 1 as new_id
FROM users
WHERE id >= 10000
ORDER BY id;

-- Step 3: Show the mapping for verification
SELECT 
  u.id as current_id,
  u.email,
  m.new_id as new_id
FROM users u
INNER JOIN user_id_mapping m ON u.id = m.old_id
ORDER BY m.new_id
LIMIT 20;

-- Note: The actual UPDATE would require handling foreign key constraints
-- We need to update this carefully to avoid constraint violations
