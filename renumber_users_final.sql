-- 会員番号の一括変更スクリプト（本番環境）
-- 外部キー制約を考慮したバージョン

-- Step 0: 外部キー制約を一時的に無効化
PRAGMA foreign_keys = OFF;

-- Step 1: 一時的に大きな番号に変更（衝突を避けるため）
UPDATE users SET id = id + 100000 WHERE id >= 10000;

-- Step 2: テストユーザーを特定の番号に変更
UPDATE users SET id = 999 WHERE email = 'akagami.syatyo@gmail.com';
UPDATE users SET id = 998 WHERE email = 'test-prod@example.com';
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
UPDATE users SET id = 51 WHERE email = 'masaki19811215@gmail.com';
UPDATE users SET id = 52 WHERE email = 'hinokiooiwa@gmail.com';
UPDATE users SET id = 53 WHERE email = 'yorokobasegokko315@gmail.com';
UPDATE users SET id = 54 WHERE email = 'naomin76@gmail.com';
UPDATE users SET id = 55 WHERE email = 'hirokokiyonobu@me.com';
UPDATE users SET id = 56 WHERE email = 'nami.is.a.trumpeter@gmaol.com';
UPDATE users SET id = 57 WHERE email = 'rejoicer358@gmail.com';
UPDATE users SET id = 58 WHERE email = 's2.ring.s2@gmail.com';
UPDATE users SET id = 59 WHERE email = 'mabooon.88@gmail.com';
UPDATE users SET id = 60 WHERE email = 'nami.is.a.trumpeter@gmail.com';
UPDATE users SET id = 61 WHERE email = 'jasmin.lion406+inc@gmail.com';
UPDATE users SET id = 62 WHERE email = 'minmi2013@gmail.com';
UPDATE users SET id = 63 WHERE email = 'milk0u0xxx@gmail.com';
UPDATE users SET id = 64 WHERE email = 's_murai_0407@hotmail.co.jp';
UPDATE users SET id = 65 WHERE email = 'wonderful.love0208@gmail.com';
UPDATE users SET id = 66 WHERE email = 'korilakkuma714@gmail.com';
UPDATE users SET id = 67 WHERE email = 'inorganics102@gmail.com';
UPDATE users SET id = 68 WHERE email = 'otepan_peace_123@yahoo.co.jp';
UPDATE users SET id = 69 WHERE email = 'joellestudio.jp@gmail.com';
UPDATE users SET id = 70 WHERE email = 'nokochiko@gmail.com';
UPDATE users SET id = 71 WHERE email = 'nokochiko.0812@gmail.com';
UPDATE users SET id = 72 WHERE email = 'juntoto.2022-9022@docomo.ne.jp';
UPDATE users SET id = 73 WHERE email = 'yuzmrchild75@gmail.com';
UPDATE users SET id = 74 WHERE email = 'm_atomarin@yahoo.co.jp';
UPDATE users SET id = 75 WHERE email = 'debug@example.com';
UPDATE users SET id = 76 WHERE email = 'i.sing.for.you0523@gmail.com';
UPDATE users SET id = 77 WHERE email = 'edenjoy728@icloud.com';
UPDATE users SET id = 78 WHERE email = 'jun2020asa@gmail.com';
UPDATE users SET id = 79 WHERE email = 'n.mikami@lumiere-douce.com';
UPDATE users SET id = 80 WHERE email = 'raghunny@gmail.com';
UPDATE users SET id = 81 WHERE email = 'tobikirihappy@yahoo.co.jp';
UPDATE users SET id = 82 WHERE email = 'r.i.p.1969.go@gmail.com';
UPDATE users SET id = 83 WHERE email = 'hapihapicoin@gmail.com';
UPDATE users SET id = 84 WHERE email = 'test2@example.com';
UPDATE users SET id = 85 WHERE email = 'mayumi@coaching-mam.com';
UPDATE users SET id = 86 WHERE email = 'shirokuma2387@gmail.com';
UPDATE users SET id = 87 WHERE email = 'mokocosme9@gmail.com';
UPDATE users SET id = 88 WHERE email = 'mariakath63@gmail.com';
UPDATE users SET id = 89 WHERE email = 'iku.feel@gmail.com';
UPDATE users SET id = 90 WHERE email = 'kaminarimon.st@gmail.co';
UPDATE users SET id = 91 WHERE email = 'himaxxart@gmail.com';
UPDATE users SET id = 92 WHERE email = 'fenchchic1214@gmail.com';
UPDATE users SET id = 93 WHERE email = 'dragon.bird.3841@gmail.com';
UPDATE users SET id = 94 WHERE email = 'chica.hosoya@gmail.com';
UPDATE users SET id = 95 WHERE email = 'kana0208xxx@yahoo.co.jp';
UPDATE users SET id = 96 WHERE email = 'yes1aroma@yahoo.co.jp';
UPDATE users SET id = 97 WHERE email = 'yuumi.s9@gmail.com';
UPDATE users SET id = 98 WHERE email = 'nail_riccorocco@yahoo.co.jp';
UPDATE users SET id = 99 WHERE email = 'kuwakuwa01@gmail.com';
UPDATE users SET id = 100 WHERE email = 'relaxiameister@gmail.com';
UPDATE users SET id = 101 WHERE email = 'a.s.judo32@gmail.com';
UPDATE users SET id = 102 WHERE email = 'arasaki1114@gmail.com';
UPDATE users SET id = 103 WHERE email = 'hidukibook@gmail.com';
UPDATE users SET id = 104 WHERE email = 'ehonserap@kobe.eeyo.jp';
UPDATE users SET id = 105 WHERE email = 'nakaayu.artmake@gmail.com';
UPDATE users SET id = 106 WHERE email = 'hiloki_tanaka34@ezweb.ne.jp';
UPDATE users SET id = 107 WHERE email = 'kakure.momojili@gmail.com';
UPDATE users SET id = 108 WHERE email = 'yamanesun120330@gmail.com';
UPDATE users SET id = 109 WHERE email = 'm0523t@gmail.com';
UPDATE users SET id = 110 WHERE email = 'c_h_357-gram@yahoo.co.jp';

-- Step 4: 外部キー制約を再度有効化
PRAGMA foreign_keys = ON;

SELECT 'User ID renumbering completed!' as message;
