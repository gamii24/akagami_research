-- Safe User ID Renumbering Script
-- Changes user IDs from 10000+ to 2+ while keeping 1, 9998, 9999 unchanged
-- 
-- Strategy: Use a high temporary offset to avoid ID conflicts
-- Step 1: Move 10000+ to temporary range (20000+)
-- Step 2: Move temporary range to final range (2+)

-- ========================================
-- STEP 1: Move users to temporary range
-- ========================================

-- Move user_id 10000 -> 20000 (temporary)
UPDATE users SET id = 20000 WHERE id = 10000;
UPDATE magic_link_tokens SET user_id = 20000 WHERE user_id = 10000;
UPDATE user_downloads SET user_id = 20000 WHERE user_id = 10000;
UPDATE user_favorites SET user_id = 20000 WHERE user_id = 10000;
UPDATE user_notification_settings SET user_id = 20000 WHERE user_id = 10000;
UPDATE email_notifications SET user_id = 20000 WHERE user_id = 10000;
UPDATE pdf_reviews SET user_id = 20000 WHERE user_id = 10000;
UPDATE review_helpful SET user_id = 20000 WHERE user_id = 10000;
UPDATE news_likes SET user_id = 20000 WHERE user_id = 10000;

-- Move user_id 10001 -> 20001 (temporary)
UPDATE users SET id = 20001 WHERE id = 10001;
UPDATE magic_link_tokens SET user_id = 20001 WHERE user_id = 10001;
UPDATE user_downloads SET user_id = 20001 WHERE user_id = 10001;
UPDATE user_favorites SET user_id = 20001 WHERE user_id = 10001;
UPDATE user_notification_settings SET user_id = 20001 WHERE user_id = 10001;
UPDATE email_notifications SET user_id = 20001 WHERE user_id = 10001;
UPDATE pdf_reviews SET user_id = 20001 WHERE user_id = 10001;
UPDATE review_helpful SET user_id = 20001 WHERE user_id = 10001;
UPDATE news_likes SET user_id = 20001 WHERE user_id = 10001;

-- Move user_id 10002 -> 20002 (temporary)
UPDATE users SET id = 20002 WHERE id = 10002;
UPDATE magic_link_tokens SET user_id = 20002 WHERE user_id = 10002;
UPDATE user_downloads SET user_id = 20002 WHERE user_id = 10002;
UPDATE user_favorites SET user_id = 20002 WHERE user_id = 10002;
UPDATE user_notification_settings SET user_id = 20002 WHERE user_id = 10002;
UPDATE email_notifications SET user_id = 20002 WHERE user_id = 10002;
UPDATE pdf_reviews SET user_id = 20002 WHERE user_id = 10002;
UPDATE review_helpful SET user_id = 20002 WHERE user_id = 10002;
UPDATE news_likes SET user_id = 20002 WHERE user_id = 10002;

-- Continue for remaining users (10003-10117)
-- This pattern repeats for each user: 10003->20003, 10004->20004, etc.

-- ========================================
-- STEP 2: Move from temporary to final
-- ========================================

-- Move 20000 -> 2 (final)
UPDATE users SET id = 2 WHERE id = 20000;
UPDATE magic_link_tokens SET user_id = 2 WHERE user_id = 20000;
UPDATE user_downloads SET user_id = 2 WHERE user_id = 20000;
UPDATE user_favorites SET user_id = 2 WHERE user_id = 20000;
UPDATE user_notification_settings SET user_id = 2 WHERE user_id = 20000;
UPDATE email_notifications SET user_id = 2 WHERE user_id = 20000;
UPDATE pdf_reviews SET user_id = 2 WHERE user_id = 20000;
UPDATE review_helpful SET user_id = 2 WHERE user_id = 20000;
UPDATE news_likes SET user_id = 2 WHERE user_id = 20000;

-- Move 20001 -> 3 (final)
UPDATE users SET id = 3 WHERE id = 20001;
UPDATE magic_link_tokens SET user_id = 3 WHERE user_id = 20001;
UPDATE user_downloads SET user_id = 3 WHERE user_id = 20001;
UPDATE user_favorites SET user_id = 3 WHERE user_id = 20001;
UPDATE user_notification_settings SET user_id = 3 WHERE user_id = 20001;
UPDATE email_notifications SET user_id = 3 WHERE user_id = 20001;
UPDATE pdf_reviews SET user_id = 3 WHERE user_id = 20001;
UPDATE review_helpful SET user_id = 3 WHERE user_id = 20001;
UPDATE news_likes SET user_id = 3 WHERE user_id = 20001;

-- Move 20002 -> 4 (final)
UPDATE users SET id = 4 WHERE id = 20002;
UPDATE magic_link_tokens SET user_id = 4 WHERE user_id = 20002;
UPDATE user_downloads SET user_id = 4 WHERE user_id = 20002;
UPDATE user_favorites SET user_id = 4 WHERE user_id = 20002;
UPDATE user_notification_settings SET user_id = 4 WHERE user_id = 20002;
UPDATE email_notifications SET user_id = 4 WHERE user_id = 20002;
UPDATE pdf_reviews SET user_id = 4 WHERE user_id = 20002;
UPDATE review_helpful SET user_id = 4 WHERE user_id = 20002;
UPDATE news_likes SET user_id = 4 WHERE user_id = 20002;

-- Continue pattern for all 118 users (10003->3, 10004->4, etc.)
-- Final mapping: 10000->2, 10001->3, 10002->4, ..., 10117->119
-- Unchanged: 1, 9998, 9999
