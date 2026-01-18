#!/usr/bin/env python3
"""
Generate SQL script to renumber users from 10000+ to 2+
With PRAGMA foreign_keys = OFF for safe execution
"""

# Tables that reference user_id
tables_with_user_id = [
    'users',
    'magic_link_tokens',
    'user_downloads',
    'user_favorites',
    'user_notification_settings',
    'email_notifications',
    'pdf_reviews',
    'review_helpful',
    'news_likes'
]

# User ID range
start_old_id = 10000
end_old_id = 10117  # 118 users total
start_new_id = 2
temp_offset = 10000  # Use 20000+ as temporary range

print("-- Safe User ID Renumbering Script")
print("-- Changes user IDs from 10000+ to 2+ while keeping 1, 9998, 9999 unchanged")
print()

# Disable foreign key constraints temporarily
print("PRAGMA foreign_keys = OFF;")
print()

# STEP 1: Move to temporary range
print("-- ========================================")
print("-- STEP 1: Move users to temporary range")
print("-- ========================================")
print()

for old_id in range(start_old_id, end_old_id + 1):
    temp_id = old_id + temp_offset
    
    for table in tables_with_user_id:
        if table == 'users':
            print(f"UPDATE users SET id = {temp_id} WHERE id = {old_id};")
        else:
            print(f"UPDATE {table} SET user_id = {temp_id} WHERE user_id = {old_id};")

print()

# STEP 2: Move from temporary to final
print("-- ========================================")
print("-- STEP 2: Move from temporary to final")
print("-- ========================================")
print()

for i, old_id in enumerate(range(start_old_id, end_old_id + 1)):
    temp_id = old_id + temp_offset
    new_id = start_new_id + i
    
    for table in tables_with_user_id:
        if table == 'users':
            print(f"UPDATE users SET id = {new_id} WHERE id = {temp_id};")
        else:
            print(f"UPDATE {table} SET user_id = {new_id} WHERE user_id = {temp_id};")

print()

# Re-enable foreign key constraints
print("PRAGMA foreign_keys = ON;")
print()

print("-- Verification query")
print("SELECT id, name, email FROM users WHERE id >= 1 AND id < 200 ORDER BY id;")
