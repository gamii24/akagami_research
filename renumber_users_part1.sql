-- 会員番号の一括変更スクリプト（本番環境）
-- 実行前に必ずバックアップを取得してください

-- Step 1: 一時的に大きな番号に変更（衝突を避けるため）
UPDATE users SET id = id + 100000 WHERE id >= 10000;

-- Step 2: テストユーザーを特定の番号に変更
-- あかがみ (id: 1) → 999
UPDATE users SET id = 999 WHERE email = 'akagami.syatyo@gmail.com';

-- テストユーザー (id: 9998) → 998  
UPDATE users SET id = 998 WHERE email = 'test-prod@example.com';

-- 新規ユーザー (id: 9999) → 997
UPDATE users SET id = 997 WHERE email = 'newuser@example.com';

-- Step 3: 一般ユーザーを1から順番に振り直し
UPDATE users SET id = 1 WHERE email = 'performer.kazuma@gmail.com';
UPDATE users SET id = 2 WHERE email = 'berrys.sweets@gmail.com';
UPDATE users SET id = 3 WHERE email = 'oki.iku8118@gmail.com';
UPDATE users SET id = 4 WHERE email = 'sp70011x@gmail.com';
UPDATE users SET id = 5 WHERE email = 'lala_closet@yahoo.co.jp';
UPDATE users SET id = 6 WHERE email = 'miyoko._3190@yahoo.co.jp';
UPDATE users SET id = 7 WHERE email = 'shige_gc603@hotmail.com';
UPDATE users SET id = 8 WHERE email = 'official.infinity8888@gmail.com';
UPDATE users SET id = 9 WHERE email = 'rurihizuki@gmail.com';
UPDATE users SET id = 10 WHERE email = 'bright_and_smile@yahoo.co.jp';
UPDATE users SET id = 11 WHERE email = 'a.piacere0109@gmail.com';
UPDATE users SET id = 12 WHERE email = 'snail.kiwifrut.22@gmail.com';
UPDATE users SET id = 13 WHERE email = 'miiruka373@gmail.com';
UPDATE users SET id = 14 WHERE email = 'endoubiyoushitsu@gmail.com';
UPDATE users SET id = 15 WHERE email = 'yukko0317@gmail.com';
UPDATE users SET id = 16 WHERE email = 'do3cochaaaan@yahoo.co.jp';
UPDATE users SET id = 17 WHERE email = 'kankoro01494@gmail.com';
UPDATE users SET id = 18 WHERE email = 'marvel@lares.dti.ne.jp';
UPDATE users SET id = 19 WHERE email = 'englisheyes758@gmail.com';
UPDATE users SET id = 20 WHERE email = 'risako108y@gmail.com';
UPDATE users SET id = 21 WHERE email = 'ri.non.ao822@icloud.com';
UPDATE users SET id = 22 WHERE email = 'sky9smile@yahoo.co.jp';
UPDATE users SET id = 23 WHERE email = 'msh05_wlatf12v@yahoo.co.jp';
UPDATE users SET id = 24 WHERE email = 'ms.crochet365@gmail.com';
UPDATE users SET id = 25 WHERE email = 'koshure.1.2.2.5@icloud.com';
UPDATE users SET id = 26 WHERE email = 'kteru0421@gmail.com';
UPDATE users SET id = 27 WHERE email = 'for_a_larkmild@yahoo.co.jp';
UPDATE users SET id = 28 WHERE email = 'croquette22y@gmail.com';
UPDATE users SET id = 29 WHERE email = 'kuriyama.bfrtraining@gmail.com';
UPDATE users SET id = 30 WHERE email = 'mitten1201@gmail.com';
UPDATE users SET id = 31 WHERE email = 'mayumi.kasahara5@gmail.com';
UPDATE users SET id = 32 WHERE email = 'chiokane.410@gmail.com';
UPDATE users SET id = 33 WHERE email = 'mew.love.t@gmail.com';
UPDATE users SET id = 34 WHERE email = 'etsuujo@gmail.com';
UPDATE users SET id = 35 WHERE email = 'happybasketcafe_mail-1@yahoo.co.jp';
UPDATE users SET id = 36 WHERE email = 'chiokane410@gmail.com';
UPDATE users SET id = 37 WHERE email = 'sukha.yogapilates@gmail.com';
UPDATE users SET id = 38 WHERE email = 'yukiiiinko0811@yahoo.co.jp';
UPDATE users SET id = 39 WHERE email = 'miyoko3190@gmail.com';
UPDATE users SET id = 40 WHERE email = 'nomadmiler@gmail.com';
UPDATE users SET id = 41 WHERE email = 'sam834526@gmail.com';
UPDATE users SET id = 42 WHERE email = '39touroku@gmail.com';
UPDATE users SET id = 43 WHERE email = '703.greenfield.coach@gmail.com';
UPDATE users SET id = 44 WHERE email = 'moririn0406@ymail.ne.jp';
UPDATE users SET id = 45 WHERE email = 'peco1228333@gmail.com';
UPDATE users SET id = 46 WHERE email = 'b.lavo.bill@gmail.com';
UPDATE users SET id = 47 WHERE email = 'hokushin.travel@gmail.com';
UPDATE users SET id = 48 WHERE email = 'miyu.princess.79@gmail.com';
UPDATE users SET id = 49 WHERE email = 'odagawa.masatoshi@sakedoko.jp';
UPDATE users SET id = 50 WHERE email = 'grareco.yukiko.nakajima@gmail.com';
