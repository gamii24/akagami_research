-- 会員番号の一括変更スクリプト
-- Step 1: 一時的に大きな番号に変更（衝突を避けるため）
UPDATE users SET id = id + 100000 WHERE id >= 10000;

-- Step 2: テストユーザーを特定の番号に変更
-- あかがみ (id: 1) → 999
UPDATE users SET id = 999 WHERE id = 1;

-- テストユーザー (id: 9998) → 998
UPDATE users SET id = 998 WHERE id = 9998;

-- 新規ユーザー (id: 9999) → 997
UPDATE users SET id = 997 WHERE id = 9999;

-- Step 3: 一般ユーザーを1から順番に振り直し
-- 10000 (performer.kazuma@gmail.com) → 1
UPDATE users SET id = 1 WHERE id = 110000;

-- 10001 (berrys.sweets@gmail.com) → 2
UPDATE users SET id = 2 WHERE id = 110001;

-- 10002 (oki.iku8118@gmail.com) → 3
UPDATE users SET id = 3 WHERE id = 110002;

-- 10003 (sp70011x@gmail.com) → 4
UPDATE users SET id = 4 WHERE id = 110003;

-- 10004 (lala_closet@yahoo.co.jp) → 5
UPDATE users SET id = 5 WHERE id = 110004;

-- 10005 (miyoko._3190@yahoo.co.jp) → 6
UPDATE users SET id = 6 WHERE id = 110005;

-- 10006 (shige_gc603@hotmail.com) → 7
UPDATE users SET id = 7 WHERE id = 110006;

-- 10007 (official.infinity8888@gmail.com) → 8
UPDATE users SET id = 8 WHERE id = 110007;

-- 10008 (rurihizuki@gmail.com) → 9
UPDATE users SET id = 9 WHERE id = 110008;

-- 10009 (bright_and_smile@yahoo.co.jp) → 10
UPDATE users SET id = 10 WHERE id = 110009;

-- 10010 (a.piacere0109@gmail.com) → 11
UPDATE users SET id = 11 WHERE id = 110010;

-- 10011 (snail.kiwifrut.22@gmail.com) → 12
UPDATE users SET id = 12 WHERE id = 110011;

-- 10012 (miiruka373@gmail.com) → 13
UPDATE users SET id = 13 WHERE id = 110012;

-- 10013 (endoubiyoushitsu@gmail.com) → 14
UPDATE users SET id = 14 WHERE id = 110013;

-- 10014 (yukko0317@gmail.com) → 15
UPDATE users SET id = 15 WHERE id = 110014;

-- 10015 (do3cochaaaan@yahoo.co.jp) → 16
UPDATE users SET id = 16 WHERE id = 110015;

-- 10016 (kankoro01494@gmail.com) → 17
UPDATE users SET id = 17 WHERE id = 110016;

-- 残りのユーザーも順番に変更（全ユーザー分）
