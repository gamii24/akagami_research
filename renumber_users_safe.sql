-- 会員番号変更スクリプト（安全な方法）
-- STEP 1: 新しいIDを格納する一時カラムを追加
ALTER TABLE users ADD COLUMN new_id INTEGER;

-- STEP 2: 新しいIDを設定
-- テストユーザーに特別な番号を割り当て
UPDATE users SET new_id = 999 WHERE email = 'akagami.syatyo@gmail.com';
UPDATE users SET new_id = 998 WHERE email = 'test-prod@example.com';
UPDATE users SET new_id = 997 WHERE email = 'newuser@example.com';

-- 一般ユーザーに1から順番に割り当て
UPDATE users SET new_id = 1 WHERE email = 'performer.kazuma@gmail.com';
UPDATE users SET new_id = 2 WHERE email = 'berrys.sweets@gmail.com';
UPDATE users SET new_id = 3 WHERE email = 'oki.iku8118@gmail.com';
UPDATE users SET new_id = 4 WHERE email = 'sp70011x@gmail.com';
UPDATE users SET new_id = 5 WHERE email = 'lala_closet@yahoo.co.jp';
UPDATE users SET new_id = 6 WHERE email = 'miyoko._3190@yahoo.co.jp';
UPDATE users SET new_id = 7 WHERE email = 'shige_gc603@hotmail.com';
UPDATE users SET new_id = 8 WHERE email = 'official.infinity8888@gmail.com';
UPDATE users SET new_id = 9 WHERE email = 'rurihizuki@gmail.com';
UPDATE users SET new_id = 10 WHERE email = 'bright_and_smile@yahoo.co.jp';
UPDATE users SET new_id = 11 WHERE email = 'a.piacere0109@gmail.com';
UPDATE users SET new_id = 12 WHERE email = 'snail.kiwifrut.22@gmail.com';
UPDATE users SET new_id = 13 WHERE email = 'miiruka373@gmail.com';
UPDATE users SET new_id = 14 WHERE email = 'endoubiyoushitsu@gmail.com';
UPDATE users SET new_id = 15 WHERE email = 'yukko0317@gmail.com';
UPDATE users SET new_id = 16 WHERE email = 'do3cochaaaan@yahoo.co.jp';
UPDATE users SET new_id = 17 WHERE email = 'kankoro01494@gmail.com';
UPDATE users SET new_id = 18 WHERE email = 'marvel@lares.dti.ne.jp';
UPDATE users SET new_id = 19 WHERE email = 'englisheyes758@gmail.com';
UPDATE users SET new_id = 20 WHERE email = 'risako108y@gmail.com';
UPDATE users SET new_id = 21 WHERE email = 'ri.non.ao822@icloud.com';
UPDATE users SET new_id = 22 WHERE email = 'sky9smile@yahoo.co.jp';
UPDATE users SET new_id = 23 WHERE email = 'msh05_wlatf12v@yahoo.co.jp';
UPDATE users SET new_id = 24 WHERE email = 'ms.crochet365@gmail.com';
UPDATE users SET new_id = 25 WHERE email = 'koshure.1.2.2.5@icloud.com';
UPDATE users SET new_id = 26 WHERE email = 'kteru0421@gmail.com';
UPDATE users SET new_id = 27 WHERE email = 'for_a_larkmild@yahoo.co.jp';
UPDATE users SET new_id = 28 WHERE email = 'croquette22y@gmail.com';
UPDATE users SET new_id = 29 WHERE email = 'kuriyama.bfrtraining@gmail.com';
UPDATE users SET new_id = 30 WHERE email = 'mitten1201@gmail.com';
UPDATE users SET new_id = 31 WHERE email = 'mayumi.kasahara5@gmail.com';
UPDATE users SET new_id = 32 WHERE email = 'chiokane.410@gmail.com';
UPDATE users SET new_id = 33 WHERE email = 'mew.love.t@gmail.com';
UPDATE users SET new_id = 34 WHERE email = 'etsuujo@gmail.com';
UPDATE users SET new_id = 35 WHERE email = 'happybasketcafe_mail-1@yahoo.co.jp';
UPDATE users SET new_id = 36 WHERE email = 'chiokane410@gmail.com';
UPDATE users SET new_id = 37 WHERE email = 'sukha.yogapilates@gmail.com';
UPDATE users SET new_id = 38 WHERE email = 'yukiiiinko0811@yahoo.co.jp';
UPDATE users SET new_id = 39 WHERE email = 'miyoko3190@gmail.com';
UPDATE users SET new_id = 40 WHERE email = 'nomadmiler@gmail.com';
UPDATE users SET new_id = 41 WHERE email = 'sam834526@gmail.com';
UPDATE users SET new_id = 42 WHERE email = '39touroku@gmail.com';
UPDATE users SET new_id = 43 WHERE email = '703.greenfield.coach@gmail.com';
UPDATE users SET new_id = 44 WHERE email = 'moririn0406@ymail.ne.jp';
UPDATE users SET new_id = 45 WHERE email = 'peco1228333@gmail.com';
UPDATE users SET new_id = 46 WHERE email = 'b.lavo.bill@gmail.com';
UPDATE users SET new_id = 47 WHERE email = 'hokushin.travel@gmail.com';
UPDATE users SET new_id = 48 WHERE email = 'miyu.princess.79@gmail.com';
UPDATE users SET new_id = 49 WHERE email = 'odagawa.masatoshi@sakedoko.jp';
UPDATE users SET new_id = 50 WHERE email = 'grareco.yukiko.nakajima@gmail.com';
UPDATE users SET new_id = 51 WHERE email = 'masaki19811215@gmail.com';
UPDATE users SET new_id = 52 WHERE email = 'hinokiooiwa@gmail.com';
UPDATE users SET new_id = 53 WHERE email = 'yorokobasegokko315@gmail.com';
UPDATE users SET new_id = 54 WHERE email = 'naomin76@gmail.com';
UPDATE users SET new_id = 55 WHERE email = 'hirokokiyonobu@me.com';
UPDATE users SET new_id = 56 WHERE email = 'nami.is.a.trumpeter@gmaol.com';
UPDATE users SET new_id = 57 WHERE email = 'rejoicer358@gmail.com';
UPDATE users SET new_id = 58 WHERE email = 's2.ring.s2@gmail.com';
UPDATE users SET new_id = 59 WHERE email = 'mabooon.88@gmail.com';
UPDATE users SET new_id = 60 WHERE email = 'nami.is.a.trumpeter@gmail.com';
UPDATE users SET new_id = 61 WHERE email = 'jasmin.lion406+inc@gmail.com';
UPDATE users SET new_id = 62 WHERE email = 'minmi2013@gmail.com';
UPDATE users SET new_id = 63 WHERE email = 'milk0u0xxx@gmail.com';
UPDATE users SET new_id = 64 WHERE email = 's_murai_0407@hotmail.co.jp';
UPDATE users SET new_id = 65 WHERE email = 'wonderful.love0208@gmail.com';
UPDATE users SET new_id = 66 WHERE email = 'korilakkuma714@gmail.com';
UPDATE users SET new_id = 67 WHERE email = 'inorganics102@gmail.com';
UPDATE users SET new_id = 68 WHERE email = 'otepan_peace_123@yahoo.co.jp';
UPDATE users SET new_id = 69 WHERE email = 'joellestudio.jp@gmail.com';
UPDATE users SET new_id = 70 WHERE email = 'nokochiko@gmail.com';
UPDATE users SET new_id = 71 WHERE email = 'nokochiko.0812@gmail.com';
UPDATE users SET new_id = 72 WHERE email = 'juntoto.2022-9022@docomo.ne.jp';
UPDATE users SET new_id = 73 WHERE email = 'yuzmrchild75@gmail.com';
UPDATE users SET new_id = 74 WHERE email = 'm_atomarin@yahoo.co.jp';
UPDATE users SET new_id = 75 WHERE email = 'debug@example.com';
UPDATE users SET new_id = 76 WHERE email = 'i.sing.for.you0523@gmail.com';
UPDATE users SET new_id = 77 WHERE email = 'edenjoy728@icloud.com';
UPDATE users SET new_id = 78 WHERE email = 'jun2020asa@gmail.com';
UPDATE users SET new_id = 79 WHERE email = 'n.mikami@lumiere-douce.com';
UPDATE users SET new_id = 80 WHERE email = 'raghunny@gmail.com';
UPDATE users SET new_id = 81 WHERE email = 'tobikirihappy@yahoo.co.jp';
UPDATE users SET new_id = 82 WHERE email = 'r.i.p.1969.go@gmail.com';
UPDATE users SET new_id = 83 WHERE email = 'hapihapicoin@gmail.com';
UPDATE users SET new_id = 84 WHERE email = 'test2@example.com';
UPDATE users SET new_id = 85 WHERE email = 'mayumi@coaching-mam.com';
UPDATE users SET new_id = 86 WHERE email = 'shirokuma2387@gmail.com';
UPDATE users SET new_id = 87 WHERE email = 'mokocosme9@gmail.com';
UPDATE users SET new_id = 88 WHERE email = 'mariakath63@gmail.com';
UPDATE users SET new_id = 89 WHERE email = 'iku.feel@gmail.com';
UPDATE users SET new_id = 90 WHERE email = 'kaminarimon.st@gmail.co';
UPDATE users SET new_id = 91 WHERE email = 'himaxxart@gmail.com';
UPDATE users SET new_id = 92 WHERE email = 'fenchchic1214@gmail.com';
UPDATE users SET new_id = 93 WHERE email = 'dragon.bird.3841@gmail.com';
UPDATE users SET new_id = 94 WHERE email = 'chica.hosoya@gmail.com';
UPDATE users SET new_id = 95 WHERE email = 'kana0208xxx@yahoo.co.jp';
UPDATE users SET new_id = 96 WHERE email = 'yes1aroma@yahoo.co.jp';
UPDATE users SET new_id = 97 WHERE email = 'yuumi.s9@gmail.com';
UPDATE users SET new_id = 98 WHERE email = 'nail_riccorocco@yahoo.co.jp';
UPDATE users SET new_id = 99 WHERE email = 'kuwakuwa01@gmail.com';
UPDATE users SET new_id = 100 WHERE email = 'relaxiameister@gmail.com';
UPDATE users SET new_id = 101 WHERE email = 'a.s.judo32@gmail.com';
UPDATE users SET new_id = 102 WHERE email = 'arasaki1114@gmail.com';
UPDATE users SET new_id = 103 WHERE email = 'hidukibook@gmail.com';
UPDATE users SET new_id = 104 WHERE email = 'ehonserap@kobe.eeyo.jp';
UPDATE users SET new_id = 105 WHERE email = 'nakaayu.artmake@gmail.com';
UPDATE users SET new_id = 106 WHERE email = 'hiloki_tanaka34@ezweb.ne.jp';
UPDATE users SET new_id = 107 WHERE email = 'kakure.momojili@gmail.com';
UPDATE users SET new_id = 108 WHERE email = 'yamanesun120330@gmail.com';
UPDATE users SET new_id = 109 WHERE email = 'm0523t@gmail.com';
UPDATE users SET new_id = 110 WHERE email = 'c_h_357-gram@yahoo.co.jp';

-- STEP 3: 関連テーブルのuser_idを更新
UPDATE magic_link_tokens SET user_id = (SELECT new_id FROM users WHERE users.id = magic_link_tokens.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE user_downloads SET user_id = (SELECT new_id FROM users WHERE users.id = user_downloads.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE user_favorites SET user_id = (SELECT new_id FROM users WHERE users.id = user_favorites.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE user_notification_settings SET user_id = (SELECT new_id FROM users WHERE users.id = user_notification_settings.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE email_notifications SET user_id = (SELECT new_id FROM users WHERE users.id = email_notifications.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE pdf_reviews SET user_id = (SELECT new_id FROM users WHERE users.id = pdf_reviews.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE review_helpful SET user_id = (SELECT new_id FROM users WHERE users.id = review_helpful.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);
UPDATE news_likes SET user_id = (SELECT new_id FROM users WHERE users.id = news_likes.user_id) WHERE user_id IN (SELECT id FROM users WHERE new_id IS NOT NULL);

-- STEP 4: usersテーブルのidを更新
UPDATE users SET id = new_id WHERE new_id IS NOT NULL;

-- STEP 5: 一時カラムを削除
ALTER TABLE users DROP COLUMN new_id;

SELECT 'User ID renumbering completed successfully!' as message;
