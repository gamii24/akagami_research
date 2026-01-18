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

-- Move user_id 10003 -> 20003 (temporary)
UPDATE users SET id = 20003 WHERE id = 10003;
UPDATE magic_link_tokens SET user_id = 20003 WHERE user_id = 10003;
UPDATE user_downloads SET user_id = 20003 WHERE user_id = 10003;
UPDATE user_favorites SET user_id = 20003 WHERE user_id = 10003;
UPDATE user_notification_settings SET user_id = 20003 WHERE user_id = 10003;
UPDATE email_notifications SET user_id = 20003 WHERE user_id = 10003;
UPDATE pdf_reviews SET user_id = 20003 WHERE user_id = 10003;
UPDATE review_helpful SET user_id = 20003 WHERE user_id = 10003;
UPDATE news_likes SET user_id = 20003 WHERE user_id = 10003;

-- Move user_id 10004 -> 20004 (temporary)
UPDATE users SET id = 20004 WHERE id = 10004;
UPDATE magic_link_tokens SET user_id = 20004 WHERE user_id = 10004;
UPDATE user_downloads SET user_id = 20004 WHERE user_id = 10004;
UPDATE user_favorites SET user_id = 20004 WHERE user_id = 10004;
UPDATE user_notification_settings SET user_id = 20004 WHERE user_id = 10004;
UPDATE email_notifications SET user_id = 20004 WHERE user_id = 10004;
UPDATE pdf_reviews SET user_id = 20004 WHERE user_id = 10004;
UPDATE review_helpful SET user_id = 20004 WHERE user_id = 10004;
UPDATE news_likes SET user_id = 20004 WHERE user_id = 10004;

-- Move user_id 10005 -> 20005 (temporary)
UPDATE users SET id = 20005 WHERE id = 10005;
UPDATE magic_link_tokens SET user_id = 20005 WHERE user_id = 10005;
UPDATE user_downloads SET user_id = 20005 WHERE user_id = 10005;
UPDATE user_favorites SET user_id = 20005 WHERE user_id = 10005;
UPDATE user_notification_settings SET user_id = 20005 WHERE user_id = 10005;
UPDATE email_notifications SET user_id = 20005 WHERE user_id = 10005;
UPDATE pdf_reviews SET user_id = 20005 WHERE user_id = 10005;
UPDATE review_helpful SET user_id = 20005 WHERE user_id = 10005;
UPDATE news_likes SET user_id = 20005 WHERE user_id = 10005;

-- Move user_id 10006 -> 20006 (temporary)
UPDATE users SET id = 20006 WHERE id = 10006;
UPDATE magic_link_tokens SET user_id = 20006 WHERE user_id = 10006;
UPDATE user_downloads SET user_id = 20006 WHERE user_id = 10006;
UPDATE user_favorites SET user_id = 20006 WHERE user_id = 10006;
UPDATE user_notification_settings SET user_id = 20006 WHERE user_id = 10006;
UPDATE email_notifications SET user_id = 20006 WHERE user_id = 10006;
UPDATE pdf_reviews SET user_id = 20006 WHERE user_id = 10006;
UPDATE review_helpful SET user_id = 20006 WHERE user_id = 10006;
UPDATE news_likes SET user_id = 20006 WHERE user_id = 10006;

-- Move user_id 10007 -> 20007 (temporary)
UPDATE users SET id = 20007 WHERE id = 10007;
UPDATE magic_link_tokens SET user_id = 20007 WHERE user_id = 10007;
UPDATE user_downloads SET user_id = 20007 WHERE user_id = 10007;
UPDATE user_favorites SET user_id = 20007 WHERE user_id = 10007;
UPDATE user_notification_settings SET user_id = 20007 WHERE user_id = 10007;
UPDATE email_notifications SET user_id = 20007 WHERE user_id = 10007;
UPDATE pdf_reviews SET user_id = 20007 WHERE user_id = 10007;
UPDATE review_helpful SET user_id = 20007 WHERE user_id = 10007;
UPDATE news_likes SET user_id = 20007 WHERE user_id = 10007;

-- Move user_id 10008 -> 20008 (temporary)
UPDATE users SET id = 20008 WHERE id = 10008;
UPDATE magic_link_tokens SET user_id = 20008 WHERE user_id = 10008;
UPDATE user_downloads SET user_id = 20008 WHERE user_id = 10008;
UPDATE user_favorites SET user_id = 20008 WHERE user_id = 10008;
UPDATE user_notification_settings SET user_id = 20008 WHERE user_id = 10008;
UPDATE email_notifications SET user_id = 20008 WHERE user_id = 10008;
UPDATE pdf_reviews SET user_id = 20008 WHERE user_id = 10008;
UPDATE review_helpful SET user_id = 20008 WHERE user_id = 10008;
UPDATE news_likes SET user_id = 20008 WHERE user_id = 10008;

-- Move user_id 10009 -> 20009 (temporary)
UPDATE users SET id = 20009 WHERE id = 10009;
UPDATE magic_link_tokens SET user_id = 20009 WHERE user_id = 10009;
UPDATE user_downloads SET user_id = 20009 WHERE user_id = 10009;
UPDATE user_favorites SET user_id = 20009 WHERE user_id = 10009;
UPDATE user_notification_settings SET user_id = 20009 WHERE user_id = 10009;
UPDATE email_notifications SET user_id = 20009 WHERE user_id = 10009;
UPDATE pdf_reviews SET user_id = 20009 WHERE user_id = 10009;
UPDATE review_helpful SET user_id = 20009 WHERE user_id = 10009;
UPDATE news_likes SET user_id = 20009 WHERE user_id = 10009;

-- Move user_id 10010 -> 20010 (temporary)
UPDATE users SET id = 20010 WHERE id = 10010;
UPDATE magic_link_tokens SET user_id = 20010 WHERE user_id = 10010;
UPDATE user_downloads SET user_id = 20010 WHERE user_id = 10010;
UPDATE user_favorites SET user_id = 20010 WHERE user_id = 10010;
UPDATE user_notification_settings SET user_id = 20010 WHERE user_id = 10010;
UPDATE email_notifications SET user_id = 20010 WHERE user_id = 10010;
UPDATE pdf_reviews SET user_id = 20010 WHERE user_id = 10010;
UPDATE review_helpful SET user_id = 20010 WHERE user_id = 10010;
UPDATE news_likes SET user_id = 20010 WHERE user_id = 10010;

-- Move user_id 10011 -> 20011 (temporary)
UPDATE users SET id = 20011 WHERE id = 10011;
UPDATE magic_link_tokens SET user_id = 20011 WHERE user_id = 10011;
UPDATE user_downloads SET user_id = 20011 WHERE user_id = 10011;
UPDATE user_favorites SET user_id = 20011 WHERE user_id = 10011;
UPDATE user_notification_settings SET user_id = 20011 WHERE user_id = 10011;
UPDATE email_notifications SET user_id = 20011 WHERE user_id = 10011;
UPDATE pdf_reviews SET user_id = 20011 WHERE user_id = 10011;
UPDATE review_helpful SET user_id = 20011 WHERE user_id = 10011;
UPDATE news_likes SET user_id = 20011 WHERE user_id = 10011;

-- Move user_id 10012 -> 20012 (temporary)
UPDATE users SET id = 20012 WHERE id = 10012;
UPDATE magic_link_tokens SET user_id = 20012 WHERE user_id = 10012;
UPDATE user_downloads SET user_id = 20012 WHERE user_id = 10012;
UPDATE user_favorites SET user_id = 20012 WHERE user_id = 10012;
UPDATE user_notification_settings SET user_id = 20012 WHERE user_id = 10012;
UPDATE email_notifications SET user_id = 20012 WHERE user_id = 10012;
UPDATE pdf_reviews SET user_id = 20012 WHERE user_id = 10012;
UPDATE review_helpful SET user_id = 20012 WHERE user_id = 10012;
UPDATE news_likes SET user_id = 20012 WHERE user_id = 10012;

-- Move user_id 10013 -> 20013 (temporary)
UPDATE users SET id = 20013 WHERE id = 10013;
UPDATE magic_link_tokens SET user_id = 20013 WHERE user_id = 10013;
UPDATE user_downloads SET user_id = 20013 WHERE user_id = 10013;
UPDATE user_favorites SET user_id = 20013 WHERE user_id = 10013;
UPDATE user_notification_settings SET user_id = 20013 WHERE user_id = 10013;
UPDATE email_notifications SET user_id = 20013 WHERE user_id = 10013;
UPDATE pdf_reviews SET user_id = 20013 WHERE user_id = 10013;
UPDATE review_helpful SET user_id = 20013 WHERE user_id = 10013;
UPDATE news_likes SET user_id = 20013 WHERE user_id = 10013;

-- Move user_id 10014 -> 20014 (temporary)
UPDATE users SET id = 20014 WHERE id = 10014;
UPDATE magic_link_tokens SET user_id = 20014 WHERE user_id = 10014;
UPDATE user_downloads SET user_id = 20014 WHERE user_id = 10014;
UPDATE user_favorites SET user_id = 20014 WHERE user_id = 10014;
UPDATE user_notification_settings SET user_id = 20014 WHERE user_id = 10014;
UPDATE email_notifications SET user_id = 20014 WHERE user_id = 10014;
UPDATE pdf_reviews SET user_id = 20014 WHERE user_id = 10014;
UPDATE review_helpful SET user_id = 20014 WHERE user_id = 10014;
UPDATE news_likes SET user_id = 20014 WHERE user_id = 10014;

-- Move user_id 10015 -> 20015 (temporary)
UPDATE users SET id = 20015 WHERE id = 10015;
UPDATE magic_link_tokens SET user_id = 20015 WHERE user_id = 10015;
UPDATE user_downloads SET user_id = 20015 WHERE user_id = 10015;
UPDATE user_favorites SET user_id = 20015 WHERE user_id = 10015;
UPDATE user_notification_settings SET user_id = 20015 WHERE user_id = 10015;
UPDATE email_notifications SET user_id = 20015 WHERE user_id = 10015;
UPDATE pdf_reviews SET user_id = 20015 WHERE user_id = 10015;
UPDATE review_helpful SET user_id = 20015 WHERE user_id = 10015;
UPDATE news_likes SET user_id = 20015 WHERE user_id = 10015;

-- Move user_id 10016 -> 20016 (temporary)
UPDATE users SET id = 20016 WHERE id = 10016;
UPDATE magic_link_tokens SET user_id = 20016 WHERE user_id = 10016;
UPDATE user_downloads SET user_id = 20016 WHERE user_id = 10016;
UPDATE user_favorites SET user_id = 20016 WHERE user_id = 10016;
UPDATE user_notification_settings SET user_id = 20016 WHERE user_id = 10016;
UPDATE email_notifications SET user_id = 20016 WHERE user_id = 10016;
UPDATE pdf_reviews SET user_id = 20016 WHERE user_id = 10016;
UPDATE review_helpful SET user_id = 20016 WHERE user_id = 10016;
UPDATE news_likes SET user_id = 20016 WHERE user_id = 10016;

-- Move user_id 10017 -> 20017 (temporary)
UPDATE users SET id = 20017 WHERE id = 10017;
UPDATE magic_link_tokens SET user_id = 20017 WHERE user_id = 10017;
UPDATE user_downloads SET user_id = 20017 WHERE user_id = 10017;
UPDATE user_favorites SET user_id = 20017 WHERE user_id = 10017;
UPDATE user_notification_settings SET user_id = 20017 WHERE user_id = 10017;
UPDATE email_notifications SET user_id = 20017 WHERE user_id = 10017;
UPDATE pdf_reviews SET user_id = 20017 WHERE user_id = 10017;
UPDATE review_helpful SET user_id = 20017 WHERE user_id = 10017;
UPDATE news_likes SET user_id = 20017 WHERE user_id = 10017;

-- Move user_id 10018 -> 20018 (temporary)
UPDATE users SET id = 20018 WHERE id = 10018;
UPDATE magic_link_tokens SET user_id = 20018 WHERE user_id = 10018;
UPDATE user_downloads SET user_id = 20018 WHERE user_id = 10018;
UPDATE user_favorites SET user_id = 20018 WHERE user_id = 10018;
UPDATE user_notification_settings SET user_id = 20018 WHERE user_id = 10018;
UPDATE email_notifications SET user_id = 20018 WHERE user_id = 10018;
UPDATE pdf_reviews SET user_id = 20018 WHERE user_id = 10018;
UPDATE review_helpful SET user_id = 20018 WHERE user_id = 10018;
UPDATE news_likes SET user_id = 20018 WHERE user_id = 10018;

-- Move user_id 10019 -> 20019 (temporary)
UPDATE users SET id = 20019 WHERE id = 10019;
UPDATE magic_link_tokens SET user_id = 20019 WHERE user_id = 10019;
UPDATE user_downloads SET user_id = 20019 WHERE user_id = 10019;
UPDATE user_favorites SET user_id = 20019 WHERE user_id = 10019;
UPDATE user_notification_settings SET user_id = 20019 WHERE user_id = 10019;
UPDATE email_notifications SET user_id = 20019 WHERE user_id = 10019;
UPDATE pdf_reviews SET user_id = 20019 WHERE user_id = 10019;
UPDATE review_helpful SET user_id = 20019 WHERE user_id = 10019;
UPDATE news_likes SET user_id = 20019 WHERE user_id = 10019;

-- Move user_id 10020 -> 20020 (temporary)
UPDATE users SET id = 20020 WHERE id = 10020;
UPDATE magic_link_tokens SET user_id = 20020 WHERE user_id = 10020;
UPDATE user_downloads SET user_id = 20020 WHERE user_id = 10020;
UPDATE user_favorites SET user_id = 20020 WHERE user_id = 10020;
UPDATE user_notification_settings SET user_id = 20020 WHERE user_id = 10020;
UPDATE email_notifications SET user_id = 20020 WHERE user_id = 10020;
UPDATE pdf_reviews SET user_id = 20020 WHERE user_id = 10020;
UPDATE review_helpful SET user_id = 20020 WHERE user_id = 10020;
UPDATE news_likes SET user_id = 20020 WHERE user_id = 10020;

-- Move user_id 10021 -> 20021 (temporary)
UPDATE users SET id = 20021 WHERE id = 10021;
UPDATE magic_link_tokens SET user_id = 20021 WHERE user_id = 10021;
UPDATE user_downloads SET user_id = 20021 WHERE user_id = 10021;
UPDATE user_favorites SET user_id = 20021 WHERE user_id = 10021;
UPDATE user_notification_settings SET user_id = 20021 WHERE user_id = 10021;
UPDATE email_notifications SET user_id = 20021 WHERE user_id = 10021;
UPDATE pdf_reviews SET user_id = 20021 WHERE user_id = 10021;
UPDATE review_helpful SET user_id = 20021 WHERE user_id = 10021;
UPDATE news_likes SET user_id = 20021 WHERE user_id = 10021;

-- Move user_id 10022 -> 20022 (temporary)
UPDATE users SET id = 20022 WHERE id = 10022;
UPDATE magic_link_tokens SET user_id = 20022 WHERE user_id = 10022;
UPDATE user_downloads SET user_id = 20022 WHERE user_id = 10022;
UPDATE user_favorites SET user_id = 20022 WHERE user_id = 10022;
UPDATE user_notification_settings SET user_id = 20022 WHERE user_id = 10022;
UPDATE email_notifications SET user_id = 20022 WHERE user_id = 10022;
UPDATE pdf_reviews SET user_id = 20022 WHERE user_id = 10022;
UPDATE review_helpful SET user_id = 20022 WHERE user_id = 10022;
UPDATE news_likes SET user_id = 20022 WHERE user_id = 10022;

-- Move user_id 10023 -> 20023 (temporary)
UPDATE users SET id = 20023 WHERE id = 10023;
UPDATE magic_link_tokens SET user_id = 20023 WHERE user_id = 10023;
UPDATE user_downloads SET user_id = 20023 WHERE user_id = 10023;
UPDATE user_favorites SET user_id = 20023 WHERE user_id = 10023;
UPDATE user_notification_settings SET user_id = 20023 WHERE user_id = 10023;
UPDATE email_notifications SET user_id = 20023 WHERE user_id = 10023;
UPDATE pdf_reviews SET user_id = 20023 WHERE user_id = 10023;
UPDATE review_helpful SET user_id = 20023 WHERE user_id = 10023;
UPDATE news_likes SET user_id = 20023 WHERE user_id = 10023;

-- Move user_id 10024 -> 20024 (temporary)
UPDATE users SET id = 20024 WHERE id = 10024;
UPDATE magic_link_tokens SET user_id = 20024 WHERE user_id = 10024;
UPDATE user_downloads SET user_id = 20024 WHERE user_id = 10024;
UPDATE user_favorites SET user_id = 20024 WHERE user_id = 10024;
UPDATE user_notification_settings SET user_id = 20024 WHERE user_id = 10024;
UPDATE email_notifications SET user_id = 20024 WHERE user_id = 10024;
UPDATE pdf_reviews SET user_id = 20024 WHERE user_id = 10024;
UPDATE review_helpful SET user_id = 20024 WHERE user_id = 10024;
UPDATE news_likes SET user_id = 20024 WHERE user_id = 10024;

-- Move user_id 10025 -> 20025 (temporary)
UPDATE users SET id = 20025 WHERE id = 10025;
UPDATE magic_link_tokens SET user_id = 20025 WHERE user_id = 10025;
UPDATE user_downloads SET user_id = 20025 WHERE user_id = 10025;
UPDATE user_favorites SET user_id = 20025 WHERE user_id = 10025;
UPDATE user_notification_settings SET user_id = 20025 WHERE user_id = 10025;
UPDATE email_notifications SET user_id = 20025 WHERE user_id = 10025;
UPDATE pdf_reviews SET user_id = 20025 WHERE user_id = 10025;
UPDATE review_helpful SET user_id = 20025 WHERE user_id = 10025;
UPDATE news_likes SET user_id = 20025 WHERE user_id = 10025;

-- Move user_id 10026 -> 20026 (temporary)
UPDATE users SET id = 20026 WHERE id = 10026;
UPDATE magic_link_tokens SET user_id = 20026 WHERE user_id = 10026;
UPDATE user_downloads SET user_id = 20026 WHERE user_id = 10026;
UPDATE user_favorites SET user_id = 20026 WHERE user_id = 10026;
UPDATE user_notification_settings SET user_id = 20026 WHERE user_id = 10026;
UPDATE email_notifications SET user_id = 20026 WHERE user_id = 10026;
UPDATE pdf_reviews SET user_id = 20026 WHERE user_id = 10026;
UPDATE review_helpful SET user_id = 20026 WHERE user_id = 10026;
UPDATE news_likes SET user_id = 20026 WHERE user_id = 10026;

-- Move user_id 10027 -> 20027 (temporary)
UPDATE users SET id = 20027 WHERE id = 10027;
UPDATE magic_link_tokens SET user_id = 20027 WHERE user_id = 10027;
UPDATE user_downloads SET user_id = 20027 WHERE user_id = 10027;
UPDATE user_favorites SET user_id = 20027 WHERE user_id = 10027;
UPDATE user_notification_settings SET user_id = 20027 WHERE user_id = 10027;
UPDATE email_notifications SET user_id = 20027 WHERE user_id = 10027;
UPDATE pdf_reviews SET user_id = 20027 WHERE user_id = 10027;
UPDATE review_helpful SET user_id = 20027 WHERE user_id = 10027;
UPDATE news_likes SET user_id = 20027 WHERE user_id = 10027;

-- Move user_id 10028 -> 20028 (temporary)
UPDATE users SET id = 20028 WHERE id = 10028;
UPDATE magic_link_tokens SET user_id = 20028 WHERE user_id = 10028;
UPDATE user_downloads SET user_id = 20028 WHERE user_id = 10028;
UPDATE user_favorites SET user_id = 20028 WHERE user_id = 10028;
UPDATE user_notification_settings SET user_id = 20028 WHERE user_id = 10028;
UPDATE email_notifications SET user_id = 20028 WHERE user_id = 10028;
UPDATE pdf_reviews SET user_id = 20028 WHERE user_id = 10028;
UPDATE review_helpful SET user_id = 20028 WHERE user_id = 10028;
UPDATE news_likes SET user_id = 20028 WHERE user_id = 10028;

-- Move user_id 10029 -> 20029 (temporary)
UPDATE users SET id = 20029 WHERE id = 10029;
UPDATE magic_link_tokens SET user_id = 20029 WHERE user_id = 10029;
UPDATE user_downloads SET user_id = 20029 WHERE user_id = 10029;
UPDATE user_favorites SET user_id = 20029 WHERE user_id = 10029;
UPDATE user_notification_settings SET user_id = 20029 WHERE user_id = 10029;
UPDATE email_notifications SET user_id = 20029 WHERE user_id = 10029;
UPDATE pdf_reviews SET user_id = 20029 WHERE user_id = 10029;
UPDATE review_helpful SET user_id = 20029 WHERE user_id = 10029;
UPDATE news_likes SET user_id = 20029 WHERE user_id = 10029;

-- Move user_id 10030 -> 20030 (temporary)
UPDATE users SET id = 20030 WHERE id = 10030;
UPDATE magic_link_tokens SET user_id = 20030 WHERE user_id = 10030;
UPDATE user_downloads SET user_id = 20030 WHERE user_id = 10030;
UPDATE user_favorites SET user_id = 20030 WHERE user_id = 10030;
UPDATE user_notification_settings SET user_id = 20030 WHERE user_id = 10030;
UPDATE email_notifications SET user_id = 20030 WHERE user_id = 10030;
UPDATE pdf_reviews SET user_id = 20030 WHERE user_id = 10030;
UPDATE review_helpful SET user_id = 20030 WHERE user_id = 10030;
UPDATE news_likes SET user_id = 20030 WHERE user_id = 10030;

-- Move user_id 10031 -> 20031 (temporary)
UPDATE users SET id = 20031 WHERE id = 10031;
UPDATE magic_link_tokens SET user_id = 20031 WHERE user_id = 10031;
UPDATE user_downloads SET user_id = 20031 WHERE user_id = 10031;
UPDATE user_favorites SET user_id = 20031 WHERE user_id = 10031;
UPDATE user_notification_settings SET user_id = 20031 WHERE user_id = 10031;
UPDATE email_notifications SET user_id = 20031 WHERE user_id = 10031;
UPDATE pdf_reviews SET user_id = 20031 WHERE user_id = 10031;
UPDATE review_helpful SET user_id = 20031 WHERE user_id = 10031;
UPDATE news_likes SET user_id = 20031 WHERE user_id = 10031;

-- Move user_id 10032 -> 20032 (temporary)
UPDATE users SET id = 20032 WHERE id = 10032;
UPDATE magic_link_tokens SET user_id = 20032 WHERE user_id = 10032;
UPDATE user_downloads SET user_id = 20032 WHERE user_id = 10032;
UPDATE user_favorites SET user_id = 20032 WHERE user_id = 10032;
UPDATE user_notification_settings SET user_id = 20032 WHERE user_id = 10032;
UPDATE email_notifications SET user_id = 20032 WHERE user_id = 10032;
UPDATE pdf_reviews SET user_id = 20032 WHERE user_id = 10032;
UPDATE review_helpful SET user_id = 20032 WHERE user_id = 10032;
UPDATE news_likes SET user_id = 20032 WHERE user_id = 10032;

-- Move user_id 10033 -> 20033 (temporary)
UPDATE users SET id = 20033 WHERE id = 10033;
UPDATE magic_link_tokens SET user_id = 20033 WHERE user_id = 10033;
UPDATE user_downloads SET user_id = 20033 WHERE user_id = 10033;
UPDATE user_favorites SET user_id = 20033 WHERE user_id = 10033;
UPDATE user_notification_settings SET user_id = 20033 WHERE user_id = 10033;
UPDATE email_notifications SET user_id = 20033 WHERE user_id = 10033;
UPDATE pdf_reviews SET user_id = 20033 WHERE user_id = 10033;
UPDATE review_helpful SET user_id = 20033 WHERE user_id = 10033;
UPDATE news_likes SET user_id = 20033 WHERE user_id = 10033;

-- Move user_id 10034 -> 20034 (temporary)
UPDATE users SET id = 20034 WHERE id = 10034;
UPDATE magic_link_tokens SET user_id = 20034 WHERE user_id = 10034;
UPDATE user_downloads SET user_id = 20034 WHERE user_id = 10034;
UPDATE user_favorites SET user_id = 20034 WHERE user_id = 10034;
UPDATE user_notification_settings SET user_id = 20034 WHERE user_id = 10034;
UPDATE email_notifications SET user_id = 20034 WHERE user_id = 10034;
UPDATE pdf_reviews SET user_id = 20034 WHERE user_id = 10034;
UPDATE review_helpful SET user_id = 20034 WHERE user_id = 10034;
UPDATE news_likes SET user_id = 20034 WHERE user_id = 10034;

-- Move user_id 10035 -> 20035 (temporary)
UPDATE users SET id = 20035 WHERE id = 10035;
UPDATE magic_link_tokens SET user_id = 20035 WHERE user_id = 10035;
UPDATE user_downloads SET user_id = 20035 WHERE user_id = 10035;
UPDATE user_favorites SET user_id = 20035 WHERE user_id = 10035;
UPDATE user_notification_settings SET user_id = 20035 WHERE user_id = 10035;
UPDATE email_notifications SET user_id = 20035 WHERE user_id = 10035;
UPDATE pdf_reviews SET user_id = 20035 WHERE user_id = 10035;
UPDATE review_helpful SET user_id = 20035 WHERE user_id = 10035;
UPDATE news_likes SET user_id = 20035 WHERE user_id = 10035;

-- Move user_id 10036 -> 20036 (temporary)
UPDATE users SET id = 20036 WHERE id = 10036;
UPDATE magic_link_tokens SET user_id = 20036 WHERE user_id = 10036;
UPDATE user_downloads SET user_id = 20036 WHERE user_id = 10036;
UPDATE user_favorites SET user_id = 20036 WHERE user_id = 10036;
UPDATE user_notification_settings SET user_id = 20036 WHERE user_id = 10036;
UPDATE email_notifications SET user_id = 20036 WHERE user_id = 10036;
UPDATE pdf_reviews SET user_id = 20036 WHERE user_id = 10036;
UPDATE review_helpful SET user_id = 20036 WHERE user_id = 10036;
UPDATE news_likes SET user_id = 20036 WHERE user_id = 10036;

-- Move user_id 10037 -> 20037 (temporary)
UPDATE users SET id = 20037 WHERE id = 10037;
UPDATE magic_link_tokens SET user_id = 20037 WHERE user_id = 10037;
UPDATE user_downloads SET user_id = 20037 WHERE user_id = 10037;
UPDATE user_favorites SET user_id = 20037 WHERE user_id = 10037;
UPDATE user_notification_settings SET user_id = 20037 WHERE user_id = 10037;
UPDATE email_notifications SET user_id = 20037 WHERE user_id = 10037;
UPDATE pdf_reviews SET user_id = 20037 WHERE user_id = 10037;
UPDATE review_helpful SET user_id = 20037 WHERE user_id = 10037;
UPDATE news_likes SET user_id = 20037 WHERE user_id = 10037;

-- Move user_id 10038 -> 20038 (temporary)
UPDATE users SET id = 20038 WHERE id = 10038;
UPDATE magic_link_tokens SET user_id = 20038 WHERE user_id = 10038;
UPDATE user_downloads SET user_id = 20038 WHERE user_id = 10038;
UPDATE user_favorites SET user_id = 20038 WHERE user_id = 10038;
UPDATE user_notification_settings SET user_id = 20038 WHERE user_id = 10038;
UPDATE email_notifications SET user_id = 20038 WHERE user_id = 10038;
UPDATE pdf_reviews SET user_id = 20038 WHERE user_id = 10038;
UPDATE review_helpful SET user_id = 20038 WHERE user_id = 10038;
UPDATE news_likes SET user_id = 20038 WHERE user_id = 10038;

-- Move user_id 10039 -> 20039 (temporary)
UPDATE users SET id = 20039 WHERE id = 10039;
UPDATE magic_link_tokens SET user_id = 20039 WHERE user_id = 10039;
UPDATE user_downloads SET user_id = 20039 WHERE user_id = 10039;
UPDATE user_favorites SET user_id = 20039 WHERE user_id = 10039;
UPDATE user_notification_settings SET user_id = 20039 WHERE user_id = 10039;
UPDATE email_notifications SET user_id = 20039 WHERE user_id = 10039;
UPDATE pdf_reviews SET user_id = 20039 WHERE user_id = 10039;
UPDATE review_helpful SET user_id = 20039 WHERE user_id = 10039;
UPDATE news_likes SET user_id = 20039 WHERE user_id = 10039;

-- Move user_id 10040 -> 20040 (temporary)
UPDATE users SET id = 20040 WHERE id = 10040;
UPDATE magic_link_tokens SET user_id = 20040 WHERE user_id = 10040;
UPDATE user_downloads SET user_id = 20040 WHERE user_id = 10040;
UPDATE user_favorites SET user_id = 20040 WHERE user_id = 10040;
UPDATE user_notification_settings SET user_id = 20040 WHERE user_id = 10040;
UPDATE email_notifications SET user_id = 20040 WHERE user_id = 10040;
UPDATE pdf_reviews SET user_id = 20040 WHERE user_id = 10040;
UPDATE review_helpful SET user_id = 20040 WHERE user_id = 10040;
UPDATE news_likes SET user_id = 20040 WHERE user_id = 10040;

-- Move user_id 10041 -> 20041 (temporary)
UPDATE users SET id = 20041 WHERE id = 10041;
UPDATE magic_link_tokens SET user_id = 20041 WHERE user_id = 10041;
UPDATE user_downloads SET user_id = 20041 WHERE user_id = 10041;
UPDATE user_favorites SET user_id = 20041 WHERE user_id = 10041;
UPDATE user_notification_settings SET user_id = 20041 WHERE user_id = 10041;
UPDATE email_notifications SET user_id = 20041 WHERE user_id = 10041;
UPDATE pdf_reviews SET user_id = 20041 WHERE user_id = 10041;
UPDATE review_helpful SET user_id = 20041 WHERE user_id = 10041;
UPDATE news_likes SET user_id = 20041 WHERE user_id = 10041;

-- Move user_id 10042 -> 20042 (temporary)
UPDATE users SET id = 20042 WHERE id = 10042;
UPDATE magic_link_tokens SET user_id = 20042 WHERE user_id = 10042;
UPDATE user_downloads SET user_id = 20042 WHERE user_id = 10042;
UPDATE user_favorites SET user_id = 20042 WHERE user_id = 10042;
UPDATE user_notification_settings SET user_id = 20042 WHERE user_id = 10042;
UPDATE email_notifications SET user_id = 20042 WHERE user_id = 10042;
UPDATE pdf_reviews SET user_id = 20042 WHERE user_id = 10042;
UPDATE review_helpful SET user_id = 20042 WHERE user_id = 10042;
UPDATE news_likes SET user_id = 20042 WHERE user_id = 10042;

-- Move user_id 10043 -> 20043 (temporary)
UPDATE users SET id = 20043 WHERE id = 10043;
UPDATE magic_link_tokens SET user_id = 20043 WHERE user_id = 10043;
UPDATE user_downloads SET user_id = 20043 WHERE user_id = 10043;
UPDATE user_favorites SET user_id = 20043 WHERE user_id = 10043;
UPDATE user_notification_settings SET user_id = 20043 WHERE user_id = 10043;
UPDATE email_notifications SET user_id = 20043 WHERE user_id = 10043;
UPDATE pdf_reviews SET user_id = 20043 WHERE user_id = 10043;
UPDATE review_helpful SET user_id = 20043 WHERE user_id = 10043;
UPDATE news_likes SET user_id = 20043 WHERE user_id = 10043;

-- Move user_id 10044 -> 20044 (temporary)
UPDATE users SET id = 20044 WHERE id = 10044;
UPDATE magic_link_tokens SET user_id = 20044 WHERE user_id = 10044;
UPDATE user_downloads SET user_id = 20044 WHERE user_id = 10044;
UPDATE user_favorites SET user_id = 20044 WHERE user_id = 10044;
UPDATE user_notification_settings SET user_id = 20044 WHERE user_id = 10044;
UPDATE email_notifications SET user_id = 20044 WHERE user_id = 10044;
UPDATE pdf_reviews SET user_id = 20044 WHERE user_id = 10044;
UPDATE review_helpful SET user_id = 20044 WHERE user_id = 10044;
UPDATE news_likes SET user_id = 20044 WHERE user_id = 10044;

-- Move user_id 10045 -> 20045 (temporary)
UPDATE users SET id = 20045 WHERE id = 10045;
UPDATE magic_link_tokens SET user_id = 20045 WHERE user_id = 10045;
UPDATE user_downloads SET user_id = 20045 WHERE user_id = 10045;
UPDATE user_favorites SET user_id = 20045 WHERE user_id = 10045;
UPDATE user_notification_settings SET user_id = 20045 WHERE user_id = 10045;
UPDATE email_notifications SET user_id = 20045 WHERE user_id = 10045;
UPDATE pdf_reviews SET user_id = 20045 WHERE user_id = 10045;
UPDATE review_helpful SET user_id = 20045 WHERE user_id = 10045;
UPDATE news_likes SET user_id = 20045 WHERE user_id = 10045;

-- Move user_id 10046 -> 20046 (temporary)
UPDATE users SET id = 20046 WHERE id = 10046;
UPDATE magic_link_tokens SET user_id = 20046 WHERE user_id = 10046;
UPDATE user_downloads SET user_id = 20046 WHERE user_id = 10046;
UPDATE user_favorites SET user_id = 20046 WHERE user_id = 10046;
UPDATE user_notification_settings SET user_id = 20046 WHERE user_id = 10046;
UPDATE email_notifications SET user_id = 20046 WHERE user_id = 10046;
UPDATE pdf_reviews SET user_id = 20046 WHERE user_id = 10046;
UPDATE review_helpful SET user_id = 20046 WHERE user_id = 10046;
UPDATE news_likes SET user_id = 20046 WHERE user_id = 10046;

-- Move user_id 10047 -> 20047 (temporary)
UPDATE users SET id = 20047 WHERE id = 10047;
UPDATE magic_link_tokens SET user_id = 20047 WHERE user_id = 10047;
UPDATE user_downloads SET user_id = 20047 WHERE user_id = 10047;
UPDATE user_favorites SET user_id = 20047 WHERE user_id = 10047;
UPDATE user_notification_settings SET user_id = 20047 WHERE user_id = 10047;
UPDATE email_notifications SET user_id = 20047 WHERE user_id = 10047;
UPDATE pdf_reviews SET user_id = 20047 WHERE user_id = 10047;
UPDATE review_helpful SET user_id = 20047 WHERE user_id = 10047;
UPDATE news_likes SET user_id = 20047 WHERE user_id = 10047;

-- Move user_id 10048 -> 20048 (temporary)
UPDATE users SET id = 20048 WHERE id = 10048;
UPDATE magic_link_tokens SET user_id = 20048 WHERE user_id = 10048;
UPDATE user_downloads SET user_id = 20048 WHERE user_id = 10048;
UPDATE user_favorites SET user_id = 20048 WHERE user_id = 10048;
UPDATE user_notification_settings SET user_id = 20048 WHERE user_id = 10048;
UPDATE email_notifications SET user_id = 20048 WHERE user_id = 10048;
UPDATE pdf_reviews SET user_id = 20048 WHERE user_id = 10048;
UPDATE review_helpful SET user_id = 20048 WHERE user_id = 10048;
UPDATE news_likes SET user_id = 20048 WHERE user_id = 10048;

-- Move user_id 10049 -> 20049 (temporary)
UPDATE users SET id = 20049 WHERE id = 10049;
UPDATE magic_link_tokens SET user_id = 20049 WHERE user_id = 10049;
UPDATE user_downloads SET user_id = 20049 WHERE user_id = 10049;
UPDATE user_favorites SET user_id = 20049 WHERE user_id = 10049;
UPDATE user_notification_settings SET user_id = 20049 WHERE user_id = 10049;
UPDATE email_notifications SET user_id = 20049 WHERE user_id = 10049;
UPDATE pdf_reviews SET user_id = 20049 WHERE user_id = 10049;
UPDATE review_helpful SET user_id = 20049 WHERE user_id = 10049;
UPDATE news_likes SET user_id = 20049 WHERE user_id = 10049;

-- Move user_id 10050 -> 20050 (temporary)
UPDATE users SET id = 20050 WHERE id = 10050;
UPDATE magic_link_tokens SET user_id = 20050 WHERE user_id = 10050;
UPDATE user_downloads SET user_id = 20050 WHERE user_id = 10050;
UPDATE user_favorites SET user_id = 20050 WHERE user_id = 10050;
UPDATE user_notification_settings SET user_id = 20050 WHERE user_id = 10050;
UPDATE email_notifications SET user_id = 20050 WHERE user_id = 10050;
UPDATE pdf_reviews SET user_id = 20050 WHERE user_id = 10050;
UPDATE review_helpful SET user_id = 20050 WHERE user_id = 10050;
UPDATE news_likes SET user_id = 20050 WHERE user_id = 10050;

-- Move user_id 10051 -> 20051 (temporary)
UPDATE users SET id = 20051 WHERE id = 10051;
UPDATE magic_link_tokens SET user_id = 20051 WHERE user_id = 10051;
UPDATE user_downloads SET user_id = 20051 WHERE user_id = 10051;
UPDATE user_favorites SET user_id = 20051 WHERE user_id = 10051;
UPDATE user_notification_settings SET user_id = 20051 WHERE user_id = 10051;
UPDATE email_notifications SET user_id = 20051 WHERE user_id = 10051;
UPDATE pdf_reviews SET user_id = 20051 WHERE user_id = 10051;
UPDATE review_helpful SET user_id = 20051 WHERE user_id = 10051;
UPDATE news_likes SET user_id = 20051 WHERE user_id = 10051;

-- Move user_id 10052 -> 20052 (temporary)
UPDATE users SET id = 20052 WHERE id = 10052;
UPDATE magic_link_tokens SET user_id = 20052 WHERE user_id = 10052;
UPDATE user_downloads SET user_id = 20052 WHERE user_id = 10052;
UPDATE user_favorites SET user_id = 20052 WHERE user_id = 10052;
UPDATE user_notification_settings SET user_id = 20052 WHERE user_id = 10052;
UPDATE email_notifications SET user_id = 20052 WHERE user_id = 10052;
UPDATE pdf_reviews SET user_id = 20052 WHERE user_id = 10052;
UPDATE review_helpful SET user_id = 20052 WHERE user_id = 10052;
UPDATE news_likes SET user_id = 20052 WHERE user_id = 10052;

-- Move user_id 10053 -> 20053 (temporary)
UPDATE users SET id = 20053 WHERE id = 10053;
UPDATE magic_link_tokens SET user_id = 20053 WHERE user_id = 10053;
UPDATE user_downloads SET user_id = 20053 WHERE user_id = 10053;
UPDATE user_favorites SET user_id = 20053 WHERE user_id = 10053;
UPDATE user_notification_settings SET user_id = 20053 WHERE user_id = 10053;
UPDATE email_notifications SET user_id = 20053 WHERE user_id = 10053;
UPDATE pdf_reviews SET user_id = 20053 WHERE user_id = 10053;
UPDATE review_helpful SET user_id = 20053 WHERE user_id = 10053;
UPDATE news_likes SET user_id = 20053 WHERE user_id = 10053;

-- Move user_id 10054 -> 20054 (temporary)
UPDATE users SET id = 20054 WHERE id = 10054;
UPDATE magic_link_tokens SET user_id = 20054 WHERE user_id = 10054;
UPDATE user_downloads SET user_id = 20054 WHERE user_id = 10054;
UPDATE user_favorites SET user_id = 20054 WHERE user_id = 10054;
UPDATE user_notification_settings SET user_id = 20054 WHERE user_id = 10054;
UPDATE email_notifications SET user_id = 20054 WHERE user_id = 10054;
UPDATE pdf_reviews SET user_id = 20054 WHERE user_id = 10054;
UPDATE review_helpful SET user_id = 20054 WHERE user_id = 10054;
UPDATE news_likes SET user_id = 20054 WHERE user_id = 10054;

-- Move user_id 10055 -> 20055 (temporary)
UPDATE users SET id = 20055 WHERE id = 10055;
UPDATE magic_link_tokens SET user_id = 20055 WHERE user_id = 10055;
UPDATE user_downloads SET user_id = 20055 WHERE user_id = 10055;
UPDATE user_favorites SET user_id = 20055 WHERE user_id = 10055;
UPDATE user_notification_settings SET user_id = 20055 WHERE user_id = 10055;
UPDATE email_notifications SET user_id = 20055 WHERE user_id = 10055;
UPDATE pdf_reviews SET user_id = 20055 WHERE user_id = 10055;
UPDATE review_helpful SET user_id = 20055 WHERE user_id = 10055;
UPDATE news_likes SET user_id = 20055 WHERE user_id = 10055;

-- Move user_id 10056 -> 20056 (temporary)
UPDATE users SET id = 20056 WHERE id = 10056;
UPDATE magic_link_tokens SET user_id = 20056 WHERE user_id = 10056;
UPDATE user_downloads SET user_id = 20056 WHERE user_id = 10056;
UPDATE user_favorites SET user_id = 20056 WHERE user_id = 10056;
UPDATE user_notification_settings SET user_id = 20056 WHERE user_id = 10056;
UPDATE email_notifications SET user_id = 20056 WHERE user_id = 10056;
UPDATE pdf_reviews SET user_id = 20056 WHERE user_id = 10056;
UPDATE review_helpful SET user_id = 20056 WHERE user_id = 10056;
UPDATE news_likes SET user_id = 20056 WHERE user_id = 10056;

-- Move user_id 10057 -> 20057 (temporary)
UPDATE users SET id = 20057 WHERE id = 10057;
UPDATE magic_link_tokens SET user_id = 20057 WHERE user_id = 10057;
UPDATE user_downloads SET user_id = 20057 WHERE user_id = 10057;
UPDATE user_favorites SET user_id = 20057 WHERE user_id = 10057;
UPDATE user_notification_settings SET user_id = 20057 WHERE user_id = 10057;
UPDATE email_notifications SET user_id = 20057 WHERE user_id = 10057;
UPDATE pdf_reviews SET user_id = 20057 WHERE user_id = 10057;
UPDATE review_helpful SET user_id = 20057 WHERE user_id = 10057;
UPDATE news_likes SET user_id = 20057 WHERE user_id = 10057;

-- Move user_id 10058 -> 20058 (temporary)
UPDATE users SET id = 20058 WHERE id = 10058;
UPDATE magic_link_tokens SET user_id = 20058 WHERE user_id = 10058;
UPDATE user_downloads SET user_id = 20058 WHERE user_id = 10058;
UPDATE user_favorites SET user_id = 20058 WHERE user_id = 10058;
UPDATE user_notification_settings SET user_id = 20058 WHERE user_id = 10058;
UPDATE email_notifications SET user_id = 20058 WHERE user_id = 10058;
UPDATE pdf_reviews SET user_id = 20058 WHERE user_id = 10058;
UPDATE review_helpful SET user_id = 20058 WHERE user_id = 10058;
UPDATE news_likes SET user_id = 20058 WHERE user_id = 10058;

-- Move user_id 10059 -> 20059 (temporary)
UPDATE users SET id = 20059 WHERE id = 10059;
UPDATE magic_link_tokens SET user_id = 20059 WHERE user_id = 10059;
UPDATE user_downloads SET user_id = 20059 WHERE user_id = 10059;
UPDATE user_favorites SET user_id = 20059 WHERE user_id = 10059;
UPDATE user_notification_settings SET user_id = 20059 WHERE user_id = 10059;
UPDATE email_notifications SET user_id = 20059 WHERE user_id = 10059;
UPDATE pdf_reviews SET user_id = 20059 WHERE user_id = 10059;
UPDATE review_helpful SET user_id = 20059 WHERE user_id = 10059;
UPDATE news_likes SET user_id = 20059 WHERE user_id = 10059;

-- Move user_id 10060 -> 20060 (temporary)
UPDATE users SET id = 20060 WHERE id = 10060;
UPDATE magic_link_tokens SET user_id = 20060 WHERE user_id = 10060;
UPDATE user_downloads SET user_id = 20060 WHERE user_id = 10060;
UPDATE user_favorites SET user_id = 20060 WHERE user_id = 10060;
UPDATE user_notification_settings SET user_id = 20060 WHERE user_id = 10060;
UPDATE email_notifications SET user_id = 20060 WHERE user_id = 10060;
UPDATE pdf_reviews SET user_id = 20060 WHERE user_id = 10060;
UPDATE review_helpful SET user_id = 20060 WHERE user_id = 10060;
UPDATE news_likes SET user_id = 20060 WHERE user_id = 10060;

-- Move user_id 10061 -> 20061 (temporary)
UPDATE users SET id = 20061 WHERE id = 10061;
UPDATE magic_link_tokens SET user_id = 20061 WHERE user_id = 10061;
UPDATE user_downloads SET user_id = 20061 WHERE user_id = 10061;
UPDATE user_favorites SET user_id = 20061 WHERE user_id = 10061;
UPDATE user_notification_settings SET user_id = 20061 WHERE user_id = 10061;
UPDATE email_notifications SET user_id = 20061 WHERE user_id = 10061;
UPDATE pdf_reviews SET user_id = 20061 WHERE user_id = 10061;
UPDATE review_helpful SET user_id = 20061 WHERE user_id = 10061;
UPDATE news_likes SET user_id = 20061 WHERE user_id = 10061;

-- Move user_id 10062 -> 20062 (temporary)
UPDATE users SET id = 20062 WHERE id = 10062;
UPDATE magic_link_tokens SET user_id = 20062 WHERE user_id = 10062;
UPDATE user_downloads SET user_id = 20062 WHERE user_id = 10062;
UPDATE user_favorites SET user_id = 20062 WHERE user_id = 10062;
UPDATE user_notification_settings SET user_id = 20062 WHERE user_id = 10062;
UPDATE email_notifications SET user_id = 20062 WHERE user_id = 10062;
UPDATE pdf_reviews SET user_id = 20062 WHERE user_id = 10062;
UPDATE review_helpful SET user_id = 20062 WHERE user_id = 10062;
UPDATE news_likes SET user_id = 20062 WHERE user_id = 10062;

-- Move user_id 10063 -> 20063 (temporary)
UPDATE users SET id = 20063 WHERE id = 10063;
UPDATE magic_link_tokens SET user_id = 20063 WHERE user_id = 10063;
UPDATE user_downloads SET user_id = 20063 WHERE user_id = 10063;
UPDATE user_favorites SET user_id = 20063 WHERE user_id = 10063;
UPDATE user_notification_settings SET user_id = 20063 WHERE user_id = 10063;
UPDATE email_notifications SET user_id = 20063 WHERE user_id = 10063;
UPDATE pdf_reviews SET user_id = 20063 WHERE user_id = 10063;
UPDATE review_helpful SET user_id = 20063 WHERE user_id = 10063;
UPDATE news_likes SET user_id = 20063 WHERE user_id = 10063;

-- Move user_id 10064 -> 20064 (temporary)
UPDATE users SET id = 20064 WHERE id = 10064;
UPDATE magic_link_tokens SET user_id = 20064 WHERE user_id = 10064;
UPDATE user_downloads SET user_id = 20064 WHERE user_id = 10064;
UPDATE user_favorites SET user_id = 20064 WHERE user_id = 10064;
UPDATE user_notification_settings SET user_id = 20064 WHERE user_id = 10064;
UPDATE email_notifications SET user_id = 20064 WHERE user_id = 10064;
UPDATE pdf_reviews SET user_id = 20064 WHERE user_id = 10064;
UPDATE review_helpful SET user_id = 20064 WHERE user_id = 10064;
UPDATE news_likes SET user_id = 20064 WHERE user_id = 10064;

-- Move user_id 10065 -> 20065 (temporary)
UPDATE users SET id = 20065 WHERE id = 10065;
UPDATE magic_link_tokens SET user_id = 20065 WHERE user_id = 10065;
UPDATE user_downloads SET user_id = 20065 WHERE user_id = 10065;
UPDATE user_favorites SET user_id = 20065 WHERE user_id = 10065;
UPDATE user_notification_settings SET user_id = 20065 WHERE user_id = 10065;
UPDATE email_notifications SET user_id = 20065 WHERE user_id = 10065;
UPDATE pdf_reviews SET user_id = 20065 WHERE user_id = 10065;
UPDATE review_helpful SET user_id = 20065 WHERE user_id = 10065;
UPDATE news_likes SET user_id = 20065 WHERE user_id = 10065;

-- Move user_id 10066 -> 20066 (temporary)
UPDATE users SET id = 20066 WHERE id = 10066;
UPDATE magic_link_tokens SET user_id = 20066 WHERE user_id = 10066;
UPDATE user_downloads SET user_id = 20066 WHERE user_id = 10066;
UPDATE user_favorites SET user_id = 20066 WHERE user_id = 10066;
UPDATE user_notification_settings SET user_id = 20066 WHERE user_id = 10066;
UPDATE email_notifications SET user_id = 20066 WHERE user_id = 10066;
UPDATE pdf_reviews SET user_id = 20066 WHERE user_id = 10066;
UPDATE review_helpful SET user_id = 20066 WHERE user_id = 10066;
UPDATE news_likes SET user_id = 20066 WHERE user_id = 10066;

-- Move user_id 10067 -> 20067 (temporary)
UPDATE users SET id = 20067 WHERE id = 10067;
UPDATE magic_link_tokens SET user_id = 20067 WHERE user_id = 10067;
UPDATE user_downloads SET user_id = 20067 WHERE user_id = 10067;
UPDATE user_favorites SET user_id = 20067 WHERE user_id = 10067;
UPDATE user_notification_settings SET user_id = 20067 WHERE user_id = 10067;
UPDATE email_notifications SET user_id = 20067 WHERE user_id = 10067;
UPDATE pdf_reviews SET user_id = 20067 WHERE user_id = 10067;
UPDATE review_helpful SET user_id = 20067 WHERE user_id = 10067;
UPDATE news_likes SET user_id = 20067 WHERE user_id = 10067;

-- Move user_id 10068 -> 20068 (temporary)
UPDATE users SET id = 20068 WHERE id = 10068;
UPDATE magic_link_tokens SET user_id = 20068 WHERE user_id = 10068;
UPDATE user_downloads SET user_id = 20068 WHERE user_id = 10068;
UPDATE user_favorites SET user_id = 20068 WHERE user_id = 10068;
UPDATE user_notification_settings SET user_id = 20068 WHERE user_id = 10068;
UPDATE email_notifications SET user_id = 20068 WHERE user_id = 10068;
UPDATE pdf_reviews SET user_id = 20068 WHERE user_id = 10068;
UPDATE review_helpful SET user_id = 20068 WHERE user_id = 10068;
UPDATE news_likes SET user_id = 20068 WHERE user_id = 10068;

-- Move user_id 10069 -> 20069 (temporary)
UPDATE users SET id = 20069 WHERE id = 10069;
UPDATE magic_link_tokens SET user_id = 20069 WHERE user_id = 10069;
UPDATE user_downloads SET user_id = 20069 WHERE user_id = 10069;
UPDATE user_favorites SET user_id = 20069 WHERE user_id = 10069;
UPDATE user_notification_settings SET user_id = 20069 WHERE user_id = 10069;
UPDATE email_notifications SET user_id = 20069 WHERE user_id = 10069;
UPDATE pdf_reviews SET user_id = 20069 WHERE user_id = 10069;
UPDATE review_helpful SET user_id = 20069 WHERE user_id = 10069;
UPDATE news_likes SET user_id = 20069 WHERE user_id = 10069;

-- Move user_id 10070 -> 20070 (temporary)
UPDATE users SET id = 20070 WHERE id = 10070;
UPDATE magic_link_tokens SET user_id = 20070 WHERE user_id = 10070;
UPDATE user_downloads SET user_id = 20070 WHERE user_id = 10070;
UPDATE user_favorites SET user_id = 20070 WHERE user_id = 10070;
UPDATE user_notification_settings SET user_id = 20070 WHERE user_id = 10070;
UPDATE email_notifications SET user_id = 20070 WHERE user_id = 10070;
UPDATE pdf_reviews SET user_id = 20070 WHERE user_id = 10070;
UPDATE review_helpful SET user_id = 20070 WHERE user_id = 10070;
UPDATE news_likes SET user_id = 20070 WHERE user_id = 10070;

-- Move user_id 10071 -> 20071 (temporary)
UPDATE users SET id = 20071 WHERE id = 10071;
UPDATE magic_link_tokens SET user_id = 20071 WHERE user_id = 10071;
UPDATE user_downloads SET user_id = 20071 WHERE user_id = 10071;
UPDATE user_favorites SET user_id = 20071 WHERE user_id = 10071;
UPDATE user_notification_settings SET user_id = 20071 WHERE user_id = 10071;
UPDATE email_notifications SET user_id = 20071 WHERE user_id = 10071;
UPDATE pdf_reviews SET user_id = 20071 WHERE user_id = 10071;
UPDATE review_helpful SET user_id = 20071 WHERE user_id = 10071;
UPDATE news_likes SET user_id = 20071 WHERE user_id = 10071;

-- Move user_id 10072 -> 20072 (temporary)
UPDATE users SET id = 20072 WHERE id = 10072;
UPDATE magic_link_tokens SET user_id = 20072 WHERE user_id = 10072;
UPDATE user_downloads SET user_id = 20072 WHERE user_id = 10072;
UPDATE user_favorites SET user_id = 20072 WHERE user_id = 10072;
UPDATE user_notification_settings SET user_id = 20072 WHERE user_id = 10072;
UPDATE email_notifications SET user_id = 20072 WHERE user_id = 10072;
UPDATE pdf_reviews SET user_id = 20072 WHERE user_id = 10072;
UPDATE review_helpful SET user_id = 20072 WHERE user_id = 10072;
UPDATE news_likes SET user_id = 20072 WHERE user_id = 10072;

-- Move user_id 10073 -> 20073 (temporary)
UPDATE users SET id = 20073 WHERE id = 10073;
UPDATE magic_link_tokens SET user_id = 20073 WHERE user_id = 10073;
UPDATE user_downloads SET user_id = 20073 WHERE user_id = 10073;
UPDATE user_favorites SET user_id = 20073 WHERE user_id = 10073;
UPDATE user_notification_settings SET user_id = 20073 WHERE user_id = 10073;
UPDATE email_notifications SET user_id = 20073 WHERE user_id = 10073;
UPDATE pdf_reviews SET user_id = 20073 WHERE user_id = 10073;
UPDATE review_helpful SET user_id = 20073 WHERE user_id = 10073;
UPDATE news_likes SET user_id = 20073 WHERE user_id = 10073;

-- Move user_id 10074 -> 20074 (temporary)
UPDATE users SET id = 20074 WHERE id = 10074;
UPDATE magic_link_tokens SET user_id = 20074 WHERE user_id = 10074;
UPDATE user_downloads SET user_id = 20074 WHERE user_id = 10074;
UPDATE user_favorites SET user_id = 20074 WHERE user_id = 10074;
UPDATE user_notification_settings SET user_id = 20074 WHERE user_id = 10074;
UPDATE email_notifications SET user_id = 20074 WHERE user_id = 10074;
UPDATE pdf_reviews SET user_id = 20074 WHERE user_id = 10074;
UPDATE review_helpful SET user_id = 20074 WHERE user_id = 10074;
UPDATE news_likes SET user_id = 20074 WHERE user_id = 10074;

-- Move user_id 10075 -> 20075 (temporary)
UPDATE users SET id = 20075 WHERE id = 10075;
UPDATE magic_link_tokens SET user_id = 20075 WHERE user_id = 10075;
UPDATE user_downloads SET user_id = 20075 WHERE user_id = 10075;
UPDATE user_favorites SET user_id = 20075 WHERE user_id = 10075;
UPDATE user_notification_settings SET user_id = 20075 WHERE user_id = 10075;
UPDATE email_notifications SET user_id = 20075 WHERE user_id = 10075;
UPDATE pdf_reviews SET user_id = 20075 WHERE user_id = 10075;
UPDATE review_helpful SET user_id = 20075 WHERE user_id = 10075;
UPDATE news_likes SET user_id = 20075 WHERE user_id = 10075;

-- Move user_id 10076 -> 20076 (temporary)
UPDATE users SET id = 20076 WHERE id = 10076;
UPDATE magic_link_tokens SET user_id = 20076 WHERE user_id = 10076;
UPDATE user_downloads SET user_id = 20076 WHERE user_id = 10076;
UPDATE user_favorites SET user_id = 20076 WHERE user_id = 10076;
UPDATE user_notification_settings SET user_id = 20076 WHERE user_id = 10076;
UPDATE email_notifications SET user_id = 20076 WHERE user_id = 10076;
UPDATE pdf_reviews SET user_id = 20076 WHERE user_id = 10076;
UPDATE review_helpful SET user_id = 20076 WHERE user_id = 10076;
UPDATE news_likes SET user_id = 20076 WHERE user_id = 10076;

-- Move user_id 10077 -> 20077 (temporary)
UPDATE users SET id = 20077 WHERE id = 10077;
UPDATE magic_link_tokens SET user_id = 20077 WHERE user_id = 10077;
UPDATE user_downloads SET user_id = 20077 WHERE user_id = 10077;
UPDATE user_favorites SET user_id = 20077 WHERE user_id = 10077;
UPDATE user_notification_settings SET user_id = 20077 WHERE user_id = 10077;
UPDATE email_notifications SET user_id = 20077 WHERE user_id = 10077;
UPDATE pdf_reviews SET user_id = 20077 WHERE user_id = 10077;
UPDATE review_helpful SET user_id = 20077 WHERE user_id = 10077;
UPDATE news_likes SET user_id = 20077 WHERE user_id = 10077;

-- Move user_id 10078 -> 20078 (temporary)
UPDATE users SET id = 20078 WHERE id = 10078;
UPDATE magic_link_tokens SET user_id = 20078 WHERE user_id = 10078;
UPDATE user_downloads SET user_id = 20078 WHERE user_id = 10078;
UPDATE user_favorites SET user_id = 20078 WHERE user_id = 10078;
UPDATE user_notification_settings SET user_id = 20078 WHERE user_id = 10078;
UPDATE email_notifications SET user_id = 20078 WHERE user_id = 10078;
UPDATE pdf_reviews SET user_id = 20078 WHERE user_id = 10078;
UPDATE review_helpful SET user_id = 20078 WHERE user_id = 10078;
UPDATE news_likes SET user_id = 20078 WHERE user_id = 10078;

-- Move user_id 10079 -> 20079 (temporary)
UPDATE users SET id = 20079 WHERE id = 10079;
UPDATE magic_link_tokens SET user_id = 20079 WHERE user_id = 10079;
UPDATE user_downloads SET user_id = 20079 WHERE user_id = 10079;
UPDATE user_favorites SET user_id = 20079 WHERE user_id = 10079;
UPDATE user_notification_settings SET user_id = 20079 WHERE user_id = 10079;
UPDATE email_notifications SET user_id = 20079 WHERE user_id = 10079;
UPDATE pdf_reviews SET user_id = 20079 WHERE user_id = 10079;
UPDATE review_helpful SET user_id = 20079 WHERE user_id = 10079;
UPDATE news_likes SET user_id = 20079 WHERE user_id = 10079;

-- Move user_id 10080 -> 20080 (temporary)
UPDATE users SET id = 20080 WHERE id = 10080;
UPDATE magic_link_tokens SET user_id = 20080 WHERE user_id = 10080;
UPDATE user_downloads SET user_id = 20080 WHERE user_id = 10080;
UPDATE user_favorites SET user_id = 20080 WHERE user_id = 10080;
UPDATE user_notification_settings SET user_id = 20080 WHERE user_id = 10080;
UPDATE email_notifications SET user_id = 20080 WHERE user_id = 10080;
UPDATE pdf_reviews SET user_id = 20080 WHERE user_id = 10080;
UPDATE review_helpful SET user_id = 20080 WHERE user_id = 10080;
UPDATE news_likes SET user_id = 20080 WHERE user_id = 10080;

-- Move user_id 10081 -> 20081 (temporary)
UPDATE users SET id = 20081 WHERE id = 10081;
UPDATE magic_link_tokens SET user_id = 20081 WHERE user_id = 10081;
UPDATE user_downloads SET user_id = 20081 WHERE user_id = 10081;
UPDATE user_favorites SET user_id = 20081 WHERE user_id = 10081;
UPDATE user_notification_settings SET user_id = 20081 WHERE user_id = 10081;
UPDATE email_notifications SET user_id = 20081 WHERE user_id = 10081;
UPDATE pdf_reviews SET user_id = 20081 WHERE user_id = 10081;
UPDATE review_helpful SET user_id = 20081 WHERE user_id = 10081;
UPDATE news_likes SET user_id = 20081 WHERE user_id = 10081;

-- Move user_id 10082 -> 20082 (temporary)
UPDATE users SET id = 20082 WHERE id = 10082;
UPDATE magic_link_tokens SET user_id = 20082 WHERE user_id = 10082;
UPDATE user_downloads SET user_id = 20082 WHERE user_id = 10082;
UPDATE user_favorites SET user_id = 20082 WHERE user_id = 10082;
UPDATE user_notification_settings SET user_id = 20082 WHERE user_id = 10082;
UPDATE email_notifications SET user_id = 20082 WHERE user_id = 10082;
UPDATE pdf_reviews SET user_id = 20082 WHERE user_id = 10082;
UPDATE review_helpful SET user_id = 20082 WHERE user_id = 10082;
UPDATE news_likes SET user_id = 20082 WHERE user_id = 10082;

-- Move user_id 10083 -> 20083 (temporary)
UPDATE users SET id = 20083 WHERE id = 10083;
UPDATE magic_link_tokens SET user_id = 20083 WHERE user_id = 10083;
UPDATE user_downloads SET user_id = 20083 WHERE user_id = 10083;
UPDATE user_favorites SET user_id = 20083 WHERE user_id = 10083;
UPDATE user_notification_settings SET user_id = 20083 WHERE user_id = 10083;
UPDATE email_notifications SET user_id = 20083 WHERE user_id = 10083;
UPDATE pdf_reviews SET user_id = 20083 WHERE user_id = 10083;
UPDATE review_helpful SET user_id = 20083 WHERE user_id = 10083;
UPDATE news_likes SET user_id = 20083 WHERE user_id = 10083;

-- Move user_id 10084 -> 20084 (temporary)
UPDATE users SET id = 20084 WHERE id = 10084;
UPDATE magic_link_tokens SET user_id = 20084 WHERE user_id = 10084;
UPDATE user_downloads SET user_id = 20084 WHERE user_id = 10084;
UPDATE user_favorites SET user_id = 20084 WHERE user_id = 10084;
UPDATE user_notification_settings SET user_id = 20084 WHERE user_id = 10084;
UPDATE email_notifications SET user_id = 20084 WHERE user_id = 10084;
UPDATE pdf_reviews SET user_id = 20084 WHERE user_id = 10084;
UPDATE review_helpful SET user_id = 20084 WHERE user_id = 10084;
UPDATE news_likes SET user_id = 20084 WHERE user_id = 10084;

-- Move user_id 10085 -> 20085 (temporary)
UPDATE users SET id = 20085 WHERE id = 10085;
UPDATE magic_link_tokens SET user_id = 20085 WHERE user_id = 10085;
UPDATE user_downloads SET user_id = 20085 WHERE user_id = 10085;
UPDATE user_favorites SET user_id = 20085 WHERE user_id = 10085;
UPDATE user_notification_settings SET user_id = 20085 WHERE user_id = 10085;
UPDATE email_notifications SET user_id = 20085 WHERE user_id = 10085;
UPDATE pdf_reviews SET user_id = 20085 WHERE user_id = 10085;
UPDATE review_helpful SET user_id = 20085 WHERE user_id = 10085;
UPDATE news_likes SET user_id = 20085 WHERE user_id = 10085;

-- Move user_id 10086 -> 20086 (temporary)
UPDATE users SET id = 20086 WHERE id = 10086;
UPDATE magic_link_tokens SET user_id = 20086 WHERE user_id = 10086;
UPDATE user_downloads SET user_id = 20086 WHERE user_id = 10086;
UPDATE user_favorites SET user_id = 20086 WHERE user_id = 10086;
UPDATE user_notification_settings SET user_id = 20086 WHERE user_id = 10086;
UPDATE email_notifications SET user_id = 20086 WHERE user_id = 10086;
UPDATE pdf_reviews SET user_id = 20086 WHERE user_id = 10086;
UPDATE review_helpful SET user_id = 20086 WHERE user_id = 10086;
UPDATE news_likes SET user_id = 20086 WHERE user_id = 10086;

-- Move user_id 10087 -> 20087 (temporary)
UPDATE users SET id = 20087 WHERE id = 10087;
UPDATE magic_link_tokens SET user_id = 20087 WHERE user_id = 10087;
UPDATE user_downloads SET user_id = 20087 WHERE user_id = 10087;
UPDATE user_favorites SET user_id = 20087 WHERE user_id = 10087;
UPDATE user_notification_settings SET user_id = 20087 WHERE user_id = 10087;
UPDATE email_notifications SET user_id = 20087 WHERE user_id = 10087;
UPDATE pdf_reviews SET user_id = 20087 WHERE user_id = 10087;
UPDATE review_helpful SET user_id = 20087 WHERE user_id = 10087;
UPDATE news_likes SET user_id = 20087 WHERE user_id = 10087;

-- Move user_id 10088 -> 20088 (temporary)
UPDATE users SET id = 20088 WHERE id = 10088;
UPDATE magic_link_tokens SET user_id = 20088 WHERE user_id = 10088;
UPDATE user_downloads SET user_id = 20088 WHERE user_id = 10088;
UPDATE user_favorites SET user_id = 20088 WHERE user_id = 10088;
UPDATE user_notification_settings SET user_id = 20088 WHERE user_id = 10088;
UPDATE email_notifications SET user_id = 20088 WHERE user_id = 10088;
UPDATE pdf_reviews SET user_id = 20088 WHERE user_id = 10088;
UPDATE review_helpful SET user_id = 20088 WHERE user_id = 10088;
UPDATE news_likes SET user_id = 20088 WHERE user_id = 10088;

-- Move user_id 10089 -> 20089 (temporary)
UPDATE users SET id = 20089 WHERE id = 10089;
UPDATE magic_link_tokens SET user_id = 20089 WHERE user_id = 10089;
UPDATE user_downloads SET user_id = 20089 WHERE user_id = 10089;
UPDATE user_favorites SET user_id = 20089 WHERE user_id = 10089;
UPDATE user_notification_settings SET user_id = 20089 WHERE user_id = 10089;
UPDATE email_notifications SET user_id = 20089 WHERE user_id = 10089;
UPDATE pdf_reviews SET user_id = 20089 WHERE user_id = 10089;
UPDATE review_helpful SET user_id = 20089 WHERE user_id = 10089;
UPDATE news_likes SET user_id = 20089 WHERE user_id = 10089;

-- Move user_id 10090 -> 20090 (temporary)
UPDATE users SET id = 20090 WHERE id = 10090;
UPDATE magic_link_tokens SET user_id = 20090 WHERE user_id = 10090;
UPDATE user_downloads SET user_id = 20090 WHERE user_id = 10090;
UPDATE user_favorites SET user_id = 20090 WHERE user_id = 10090;
UPDATE user_notification_settings SET user_id = 20090 WHERE user_id = 10090;
UPDATE email_notifications SET user_id = 20090 WHERE user_id = 10090;
UPDATE pdf_reviews SET user_id = 20090 WHERE user_id = 10090;
UPDATE review_helpful SET user_id = 20090 WHERE user_id = 10090;
UPDATE news_likes SET user_id = 20090 WHERE user_id = 10090;

-- Move user_id 10091 -> 20091 (temporary)
UPDATE users SET id = 20091 WHERE id = 10091;
UPDATE magic_link_tokens SET user_id = 20091 WHERE user_id = 10091;
UPDATE user_downloads SET user_id = 20091 WHERE user_id = 10091;
UPDATE user_favorites SET user_id = 20091 WHERE user_id = 10091;
UPDATE user_notification_settings SET user_id = 20091 WHERE user_id = 10091;
UPDATE email_notifications SET user_id = 20091 WHERE user_id = 10091;
UPDATE pdf_reviews SET user_id = 20091 WHERE user_id = 10091;
UPDATE review_helpful SET user_id = 20091 WHERE user_id = 10091;
UPDATE news_likes SET user_id = 20091 WHERE user_id = 10091;

-- Move user_id 10092 -> 20092 (temporary)
UPDATE users SET id = 20092 WHERE id = 10092;
UPDATE magic_link_tokens SET user_id = 20092 WHERE user_id = 10092;
UPDATE user_downloads SET user_id = 20092 WHERE user_id = 10092;
UPDATE user_favorites SET user_id = 20092 WHERE user_id = 10092;
UPDATE user_notification_settings SET user_id = 20092 WHERE user_id = 10092;
UPDATE email_notifications SET user_id = 20092 WHERE user_id = 10092;
UPDATE pdf_reviews SET user_id = 20092 WHERE user_id = 10092;
UPDATE review_helpful SET user_id = 20092 WHERE user_id = 10092;
UPDATE news_likes SET user_id = 20092 WHERE user_id = 10092;

-- Move user_id 10093 -> 20093 (temporary)
UPDATE users SET id = 20093 WHERE id = 10093;
UPDATE magic_link_tokens SET user_id = 20093 WHERE user_id = 10093;
UPDATE user_downloads SET user_id = 20093 WHERE user_id = 10093;
UPDATE user_favorites SET user_id = 20093 WHERE user_id = 10093;
UPDATE user_notification_settings SET user_id = 20093 WHERE user_id = 10093;
UPDATE email_notifications SET user_id = 20093 WHERE user_id = 10093;
UPDATE pdf_reviews SET user_id = 20093 WHERE user_id = 10093;
UPDATE review_helpful SET user_id = 20093 WHERE user_id = 10093;
UPDATE news_likes SET user_id = 20093 WHERE user_id = 10093;

-- Move user_id 10094 -> 20094 (temporary)
UPDATE users SET id = 20094 WHERE id = 10094;
UPDATE magic_link_tokens SET user_id = 20094 WHERE user_id = 10094;
UPDATE user_downloads SET user_id = 20094 WHERE user_id = 10094;
UPDATE user_favorites SET user_id = 20094 WHERE user_id = 10094;
UPDATE user_notification_settings SET user_id = 20094 WHERE user_id = 10094;
UPDATE email_notifications SET user_id = 20094 WHERE user_id = 10094;
UPDATE pdf_reviews SET user_id = 20094 WHERE user_id = 10094;
UPDATE review_helpful SET user_id = 20094 WHERE user_id = 10094;
UPDATE news_likes SET user_id = 20094 WHERE user_id = 10094;

-- Move user_id 10095 -> 20095 (temporary)
UPDATE users SET id = 20095 WHERE id = 10095;
UPDATE magic_link_tokens SET user_id = 20095 WHERE user_id = 10095;
UPDATE user_downloads SET user_id = 20095 WHERE user_id = 10095;
UPDATE user_favorites SET user_id = 20095 WHERE user_id = 10095;
UPDATE user_notification_settings SET user_id = 20095 WHERE user_id = 10095;
UPDATE email_notifications SET user_id = 20095 WHERE user_id = 10095;
UPDATE pdf_reviews SET user_id = 20095 WHERE user_id = 10095;
UPDATE review_helpful SET user_id = 20095 WHERE user_id = 10095;
UPDATE news_likes SET user_id = 20095 WHERE user_id = 10095;

-- Move user_id 10096 -> 20096 (temporary)
UPDATE users SET id = 20096 WHERE id = 10096;
UPDATE magic_link_tokens SET user_id = 20096 WHERE user_id = 10096;
UPDATE user_downloads SET user_id = 20096 WHERE user_id = 10096;
UPDATE user_favorites SET user_id = 20096 WHERE user_id = 10096;
UPDATE user_notification_settings SET user_id = 20096 WHERE user_id = 10096;
UPDATE email_notifications SET user_id = 20096 WHERE user_id = 10096;
UPDATE pdf_reviews SET user_id = 20096 WHERE user_id = 10096;
UPDATE review_helpful SET user_id = 20096 WHERE user_id = 10096;
UPDATE news_likes SET user_id = 20096 WHERE user_id = 10096;

-- Move user_id 10097 -> 20097 (temporary)
UPDATE users SET id = 20097 WHERE id = 10097;
UPDATE magic_link_tokens SET user_id = 20097 WHERE user_id = 10097;
UPDATE user_downloads SET user_id = 20097 WHERE user_id = 10097;
UPDATE user_favorites SET user_id = 20097 WHERE user_id = 10097;
UPDATE user_notification_settings SET user_id = 20097 WHERE user_id = 10097;
UPDATE email_notifications SET user_id = 20097 WHERE user_id = 10097;
UPDATE pdf_reviews SET user_id = 20097 WHERE user_id = 10097;
UPDATE review_helpful SET user_id = 20097 WHERE user_id = 10097;
UPDATE news_likes SET user_id = 20097 WHERE user_id = 10097;

-- Move user_id 10098 -> 20098 (temporary)
UPDATE users SET id = 20098 WHERE id = 10098;
UPDATE magic_link_tokens SET user_id = 20098 WHERE user_id = 10098;
UPDATE user_downloads SET user_id = 20098 WHERE user_id = 10098;
UPDATE user_favorites SET user_id = 20098 WHERE user_id = 10098;
UPDATE user_notification_settings SET user_id = 20098 WHERE user_id = 10098;
UPDATE email_notifications SET user_id = 20098 WHERE user_id = 10098;
UPDATE pdf_reviews SET user_id = 20098 WHERE user_id = 10098;
UPDATE review_helpful SET user_id = 20098 WHERE user_id = 10098;
UPDATE news_likes SET user_id = 20098 WHERE user_id = 10098;

-- Move user_id 10099 -> 20099 (temporary)
UPDATE users SET id = 20099 WHERE id = 10099;
UPDATE magic_link_tokens SET user_id = 20099 WHERE user_id = 10099;
UPDATE user_downloads SET user_id = 20099 WHERE user_id = 10099;
UPDATE user_favorites SET user_id = 20099 WHERE user_id = 10099;
UPDATE user_notification_settings SET user_id = 20099 WHERE user_id = 10099;
UPDATE email_notifications SET user_id = 20099 WHERE user_id = 10099;
UPDATE pdf_reviews SET user_id = 20099 WHERE user_id = 10099;
UPDATE review_helpful SET user_id = 20099 WHERE user_id = 10099;
UPDATE news_likes SET user_id = 20099 WHERE user_id = 10099;

-- Move user_id 10100 -> 20100 (temporary)
UPDATE users SET id = 20100 WHERE id = 10100;
UPDATE magic_link_tokens SET user_id = 20100 WHERE user_id = 10100;
UPDATE user_downloads SET user_id = 20100 WHERE user_id = 10100;
UPDATE user_favorites SET user_id = 20100 WHERE user_id = 10100;
UPDATE user_notification_settings SET user_id = 20100 WHERE user_id = 10100;
UPDATE email_notifications SET user_id = 20100 WHERE user_id = 10100;
UPDATE pdf_reviews SET user_id = 20100 WHERE user_id = 10100;
UPDATE review_helpful SET user_id = 20100 WHERE user_id = 10100;
UPDATE news_likes SET user_id = 20100 WHERE user_id = 10100;

-- Move user_id 10101 -> 20101 (temporary)
UPDATE users SET id = 20101 WHERE id = 10101;
UPDATE magic_link_tokens SET user_id = 20101 WHERE user_id = 10101;
UPDATE user_downloads SET user_id = 20101 WHERE user_id = 10101;
UPDATE user_favorites SET user_id = 20101 WHERE user_id = 10101;
UPDATE user_notification_settings SET user_id = 20101 WHERE user_id = 10101;
UPDATE email_notifications SET user_id = 20101 WHERE user_id = 10101;
UPDATE pdf_reviews SET user_id = 20101 WHERE user_id = 10101;
UPDATE review_helpful SET user_id = 20101 WHERE user_id = 10101;
UPDATE news_likes SET user_id = 20101 WHERE user_id = 10101;

-- Move user_id 10102 -> 20102 (temporary)
UPDATE users SET id = 20102 WHERE id = 10102;
UPDATE magic_link_tokens SET user_id = 20102 WHERE user_id = 10102;
UPDATE user_downloads SET user_id = 20102 WHERE user_id = 10102;
UPDATE user_favorites SET user_id = 20102 WHERE user_id = 10102;
UPDATE user_notification_settings SET user_id = 20102 WHERE user_id = 10102;
UPDATE email_notifications SET user_id = 20102 WHERE user_id = 10102;
UPDATE pdf_reviews SET user_id = 20102 WHERE user_id = 10102;
UPDATE review_helpful SET user_id = 20102 WHERE user_id = 10102;
UPDATE news_likes SET user_id = 20102 WHERE user_id = 10102;

-- Move user_id 10103 -> 20103 (temporary)
UPDATE users SET id = 20103 WHERE id = 10103;
UPDATE magic_link_tokens SET user_id = 20103 WHERE user_id = 10103;
UPDATE user_downloads SET user_id = 20103 WHERE user_id = 10103;
UPDATE user_favorites SET user_id = 20103 WHERE user_id = 10103;
UPDATE user_notification_settings SET user_id = 20103 WHERE user_id = 10103;
UPDATE email_notifications SET user_id = 20103 WHERE user_id = 10103;
UPDATE pdf_reviews SET user_id = 20103 WHERE user_id = 10103;
UPDATE review_helpful SET user_id = 20103 WHERE user_id = 10103;
UPDATE news_likes SET user_id = 20103 WHERE user_id = 10103;

-- Move user_id 10104 -> 20104 (temporary)
UPDATE users SET id = 20104 WHERE id = 10104;
UPDATE magic_link_tokens SET user_id = 20104 WHERE user_id = 10104;
UPDATE user_downloads SET user_id = 20104 WHERE user_id = 10104;
UPDATE user_favorites SET user_id = 20104 WHERE user_id = 10104;
UPDATE user_notification_settings SET user_id = 20104 WHERE user_id = 10104;
UPDATE email_notifications SET user_id = 20104 WHERE user_id = 10104;
UPDATE pdf_reviews SET user_id = 20104 WHERE user_id = 10104;
UPDATE review_helpful SET user_id = 20104 WHERE user_id = 10104;
UPDATE news_likes SET user_id = 20104 WHERE user_id = 10104;

-- Move user_id 10105 -> 20105 (temporary)
UPDATE users SET id = 20105 WHERE id = 10105;
UPDATE magic_link_tokens SET user_id = 20105 WHERE user_id = 10105;
UPDATE user_downloads SET user_id = 20105 WHERE user_id = 10105;
UPDATE user_favorites SET user_id = 20105 WHERE user_id = 10105;
UPDATE user_notification_settings SET user_id = 20105 WHERE user_id = 10105;
UPDATE email_notifications SET user_id = 20105 WHERE user_id = 10105;
UPDATE pdf_reviews SET user_id = 20105 WHERE user_id = 10105;
UPDATE review_helpful SET user_id = 20105 WHERE user_id = 10105;
UPDATE news_likes SET user_id = 20105 WHERE user_id = 10105;

-- Move user_id 10106 -> 20106 (temporary)
UPDATE users SET id = 20106 WHERE id = 10106;
UPDATE magic_link_tokens SET user_id = 20106 WHERE user_id = 10106;
UPDATE user_downloads SET user_id = 20106 WHERE user_id = 10106;
UPDATE user_favorites SET user_id = 20106 WHERE user_id = 10106;
UPDATE user_notification_settings SET user_id = 20106 WHERE user_id = 10106;
UPDATE email_notifications SET user_id = 20106 WHERE user_id = 10106;
UPDATE pdf_reviews SET user_id = 20106 WHERE user_id = 10106;
UPDATE review_helpful SET user_id = 20106 WHERE user_id = 10106;
UPDATE news_likes SET user_id = 20106 WHERE user_id = 10106;

-- Move user_id 10107 -> 20107 (temporary)
UPDATE users SET id = 20107 WHERE id = 10107;
UPDATE magic_link_tokens SET user_id = 20107 WHERE user_id = 10107;
UPDATE user_downloads SET user_id = 20107 WHERE user_id = 10107;
UPDATE user_favorites SET user_id = 20107 WHERE user_id = 10107;
UPDATE user_notification_settings SET user_id = 20107 WHERE user_id = 10107;
UPDATE email_notifications SET user_id = 20107 WHERE user_id = 10107;
UPDATE pdf_reviews SET user_id = 20107 WHERE user_id = 10107;
UPDATE review_helpful SET user_id = 20107 WHERE user_id = 10107;
UPDATE news_likes SET user_id = 20107 WHERE user_id = 10107;

-- Move user_id 10108 -> 20108 (temporary)
UPDATE users SET id = 20108 WHERE id = 10108;
UPDATE magic_link_tokens SET user_id = 20108 WHERE user_id = 10108;
UPDATE user_downloads SET user_id = 20108 WHERE user_id = 10108;
UPDATE user_favorites SET user_id = 20108 WHERE user_id = 10108;
UPDATE user_notification_settings SET user_id = 20108 WHERE user_id = 10108;
UPDATE email_notifications SET user_id = 20108 WHERE user_id = 10108;
UPDATE pdf_reviews SET user_id = 20108 WHERE user_id = 10108;
UPDATE review_helpful SET user_id = 20108 WHERE user_id = 10108;
UPDATE news_likes SET user_id = 20108 WHERE user_id = 10108;

-- Move user_id 10109 -> 20109 (temporary)
UPDATE users SET id = 20109 WHERE id = 10109;
UPDATE magic_link_tokens SET user_id = 20109 WHERE user_id = 10109;
UPDATE user_downloads SET user_id = 20109 WHERE user_id = 10109;
UPDATE user_favorites SET user_id = 20109 WHERE user_id = 10109;
UPDATE user_notification_settings SET user_id = 20109 WHERE user_id = 10109;
UPDATE email_notifications SET user_id = 20109 WHERE user_id = 10109;
UPDATE pdf_reviews SET user_id = 20109 WHERE user_id = 10109;
UPDATE review_helpful SET user_id = 20109 WHERE user_id = 10109;
UPDATE news_likes SET user_id = 20109 WHERE user_id = 10109;

-- Move user_id 10110 -> 20110 (temporary)
UPDATE users SET id = 20110 WHERE id = 10110;
UPDATE magic_link_tokens SET user_id = 20110 WHERE user_id = 10110;
UPDATE user_downloads SET user_id = 20110 WHERE user_id = 10110;
UPDATE user_favorites SET user_id = 20110 WHERE user_id = 10110;
UPDATE user_notification_settings SET user_id = 20110 WHERE user_id = 10110;
UPDATE email_notifications SET user_id = 20110 WHERE user_id = 10110;
UPDATE pdf_reviews SET user_id = 20110 WHERE user_id = 10110;
UPDATE review_helpful SET user_id = 20110 WHERE user_id = 10110;
UPDATE news_likes SET user_id = 20110 WHERE user_id = 10110;

-- Move user_id 10111 -> 20111 (temporary)
UPDATE users SET id = 20111 WHERE id = 10111;
UPDATE magic_link_tokens SET user_id = 20111 WHERE user_id = 10111;
UPDATE user_downloads SET user_id = 20111 WHERE user_id = 10111;
UPDATE user_favorites SET user_id = 20111 WHERE user_id = 10111;
UPDATE user_notification_settings SET user_id = 20111 WHERE user_id = 10111;
UPDATE email_notifications SET user_id = 20111 WHERE user_id = 10111;
UPDATE pdf_reviews SET user_id = 20111 WHERE user_id = 10111;
UPDATE review_helpful SET user_id = 20111 WHERE user_id = 10111;
UPDATE news_likes SET user_id = 20111 WHERE user_id = 10111;

-- Move user_id 10112 -> 20112 (temporary)
UPDATE users SET id = 20112 WHERE id = 10112;
UPDATE magic_link_tokens SET user_id = 20112 WHERE user_id = 10112;
UPDATE user_downloads SET user_id = 20112 WHERE user_id = 10112;
UPDATE user_favorites SET user_id = 20112 WHERE user_id = 10112;
UPDATE user_notification_settings SET user_id = 20112 WHERE user_id = 10112;
UPDATE email_notifications SET user_id = 20112 WHERE user_id = 10112;
UPDATE pdf_reviews SET user_id = 20112 WHERE user_id = 10112;
UPDATE review_helpful SET user_id = 20112 WHERE user_id = 10112;
UPDATE news_likes SET user_id = 20112 WHERE user_id = 10112;

-- Move user_id 10113 -> 20113 (temporary)
UPDATE users SET id = 20113 WHERE id = 10113;
UPDATE magic_link_tokens SET user_id = 20113 WHERE user_id = 10113;
UPDATE user_downloads SET user_id = 20113 WHERE user_id = 10113;
UPDATE user_favorites SET user_id = 20113 WHERE user_id = 10113;
UPDATE user_notification_settings SET user_id = 20113 WHERE user_id = 10113;
UPDATE email_notifications SET user_id = 20113 WHERE user_id = 10113;
UPDATE pdf_reviews SET user_id = 20113 WHERE user_id = 10113;
UPDATE review_helpful SET user_id = 20113 WHERE user_id = 10113;
UPDATE news_likes SET user_id = 20113 WHERE user_id = 10113;

-- Move user_id 10114 -> 20114 (temporary)
UPDATE users SET id = 20114 WHERE id = 10114;
UPDATE magic_link_tokens SET user_id = 20114 WHERE user_id = 10114;
UPDATE user_downloads SET user_id = 20114 WHERE user_id = 10114;
UPDATE user_favorites SET user_id = 20114 WHERE user_id = 10114;
UPDATE user_notification_settings SET user_id = 20114 WHERE user_id = 10114;
UPDATE email_notifications SET user_id = 20114 WHERE user_id = 10114;
UPDATE pdf_reviews SET user_id = 20114 WHERE user_id = 10114;
UPDATE review_helpful SET user_id = 20114 WHERE user_id = 10114;
UPDATE news_likes SET user_id = 20114 WHERE user_id = 10114;

-- Move user_id 10115 -> 20115 (temporary)
UPDATE users SET id = 20115 WHERE id = 10115;
UPDATE magic_link_tokens SET user_id = 20115 WHERE user_id = 10115;
UPDATE user_downloads SET user_id = 20115 WHERE user_id = 10115;
UPDATE user_favorites SET user_id = 20115 WHERE user_id = 10115;
UPDATE user_notification_settings SET user_id = 20115 WHERE user_id = 10115;
UPDATE email_notifications SET user_id = 20115 WHERE user_id = 10115;
UPDATE pdf_reviews SET user_id = 20115 WHERE user_id = 10115;
UPDATE review_helpful SET user_id = 20115 WHERE user_id = 10115;
UPDATE news_likes SET user_id = 20115 WHERE user_id = 10115;

-- Move user_id 10116 -> 20116 (temporary)
UPDATE users SET id = 20116 WHERE id = 10116;
UPDATE magic_link_tokens SET user_id = 20116 WHERE user_id = 10116;
UPDATE user_downloads SET user_id = 20116 WHERE user_id = 10116;
UPDATE user_favorites SET user_id = 20116 WHERE user_id = 10116;
UPDATE user_notification_settings SET user_id = 20116 WHERE user_id = 10116;
UPDATE email_notifications SET user_id = 20116 WHERE user_id = 10116;
UPDATE pdf_reviews SET user_id = 20116 WHERE user_id = 10116;
UPDATE review_helpful SET user_id = 20116 WHERE user_id = 10116;
UPDATE news_likes SET user_id = 20116 WHERE user_id = 10116;

-- Move user_id 10117 -> 20117 (temporary)
UPDATE users SET id = 20117 WHERE id = 10117;
UPDATE magic_link_tokens SET user_id = 20117 WHERE user_id = 10117;
UPDATE user_downloads SET user_id = 20117 WHERE user_id = 10117;
UPDATE user_favorites SET user_id = 20117 WHERE user_id = 10117;
UPDATE user_notification_settings SET user_id = 20117 WHERE user_id = 10117;
UPDATE email_notifications SET user_id = 20117 WHERE user_id = 10117;
UPDATE pdf_reviews SET user_id = 20117 WHERE user_id = 10117;
UPDATE review_helpful SET user_id = 20117 WHERE user_id = 10117;
UPDATE news_likes SET user_id = 20117 WHERE user_id = 10117;

-- ========================================
-- STEP 2: Move from temporary to final
-- ========================================

-- Move 20000 -> 2 (final: 10000 -> 2)
UPDATE users SET id = 2 WHERE id = 20000;
UPDATE magic_link_tokens SET user_id = 2 WHERE user_id = 20000;
UPDATE user_downloads SET user_id = 2 WHERE user_id = 20000;
UPDATE user_favorites SET user_id = 2 WHERE user_id = 20000;
UPDATE user_notification_settings SET user_id = 2 WHERE user_id = 20000;
UPDATE email_notifications SET user_id = 2 WHERE user_id = 20000;
UPDATE pdf_reviews SET user_id = 2 WHERE user_id = 20000;
UPDATE review_helpful SET user_id = 2 WHERE user_id = 20000;
UPDATE news_likes SET user_id = 2 WHERE user_id = 20000;

-- Move 20001 -> 3 (final: 10001 -> 3)
UPDATE users SET id = 3 WHERE id = 20001;
UPDATE magic_link_tokens SET user_id = 3 WHERE user_id = 20001;
UPDATE user_downloads SET user_id = 3 WHERE user_id = 20001;
UPDATE user_favorites SET user_id = 3 WHERE user_id = 20001;
UPDATE user_notification_settings SET user_id = 3 WHERE user_id = 20001;
UPDATE email_notifications SET user_id = 3 WHERE user_id = 20001;
UPDATE pdf_reviews SET user_id = 3 WHERE user_id = 20001;
UPDATE review_helpful SET user_id = 3 WHERE user_id = 20001;
UPDATE news_likes SET user_id = 3 WHERE user_id = 20001;

-- Move 20002 -> 4 (final: 10002 -> 4)
UPDATE users SET id = 4 WHERE id = 20002;
UPDATE magic_link_tokens SET user_id = 4 WHERE user_id = 20002;
UPDATE user_downloads SET user_id = 4 WHERE user_id = 20002;
UPDATE user_favorites SET user_id = 4 WHERE user_id = 20002;
UPDATE user_notification_settings SET user_id = 4 WHERE user_id = 20002;
UPDATE email_notifications SET user_id = 4 WHERE user_id = 20002;
UPDATE pdf_reviews SET user_id = 4 WHERE user_id = 20002;
UPDATE review_helpful SET user_id = 4 WHERE user_id = 20002;
UPDATE news_likes SET user_id = 4 WHERE user_id = 20002;

-- Move 20003 -> 5 (final: 10003 -> 5)
UPDATE users SET id = 5 WHERE id = 20003;
UPDATE magic_link_tokens SET user_id = 5 WHERE user_id = 20003;
UPDATE user_downloads SET user_id = 5 WHERE user_id = 20003;
UPDATE user_favorites SET user_id = 5 WHERE user_id = 20003;
UPDATE user_notification_settings SET user_id = 5 WHERE user_id = 20003;
UPDATE email_notifications SET user_id = 5 WHERE user_id = 20003;
UPDATE pdf_reviews SET user_id = 5 WHERE user_id = 20003;
UPDATE review_helpful SET user_id = 5 WHERE user_id = 20003;
UPDATE news_likes SET user_id = 5 WHERE user_id = 20003;

-- Move 20004 -> 6 (final: 10004 -> 6)
UPDATE users SET id = 6 WHERE id = 20004;
UPDATE magic_link_tokens SET user_id = 6 WHERE user_id = 20004;
UPDATE user_downloads SET user_id = 6 WHERE user_id = 20004;
UPDATE user_favorites SET user_id = 6 WHERE user_id = 20004;
UPDATE user_notification_settings SET user_id = 6 WHERE user_id = 20004;
UPDATE email_notifications SET user_id = 6 WHERE user_id = 20004;
UPDATE pdf_reviews SET user_id = 6 WHERE user_id = 20004;
UPDATE review_helpful SET user_id = 6 WHERE user_id = 20004;
UPDATE news_likes SET user_id = 6 WHERE user_id = 20004;

-- Move 20005 -> 7 (final: 10005 -> 7)
UPDATE users SET id = 7 WHERE id = 20005;
UPDATE magic_link_tokens SET user_id = 7 WHERE user_id = 20005;
UPDATE user_downloads SET user_id = 7 WHERE user_id = 20005;
UPDATE user_favorites SET user_id = 7 WHERE user_id = 20005;
UPDATE user_notification_settings SET user_id = 7 WHERE user_id = 20005;
UPDATE email_notifications SET user_id = 7 WHERE user_id = 20005;
UPDATE pdf_reviews SET user_id = 7 WHERE user_id = 20005;
UPDATE review_helpful SET user_id = 7 WHERE user_id = 20005;
UPDATE news_likes SET user_id = 7 WHERE user_id = 20005;

-- Move 20006 -> 8 (final: 10006 -> 8)
UPDATE users SET id = 8 WHERE id = 20006;
UPDATE magic_link_tokens SET user_id = 8 WHERE user_id = 20006;
UPDATE user_downloads SET user_id = 8 WHERE user_id = 20006;
UPDATE user_favorites SET user_id = 8 WHERE user_id = 20006;
UPDATE user_notification_settings SET user_id = 8 WHERE user_id = 20006;
UPDATE email_notifications SET user_id = 8 WHERE user_id = 20006;
UPDATE pdf_reviews SET user_id = 8 WHERE user_id = 20006;
UPDATE review_helpful SET user_id = 8 WHERE user_id = 20006;
UPDATE news_likes SET user_id = 8 WHERE user_id = 20006;

-- Move 20007 -> 9 (final: 10007 -> 9)
UPDATE users SET id = 9 WHERE id = 20007;
UPDATE magic_link_tokens SET user_id = 9 WHERE user_id = 20007;
UPDATE user_downloads SET user_id = 9 WHERE user_id = 20007;
UPDATE user_favorites SET user_id = 9 WHERE user_id = 20007;
UPDATE user_notification_settings SET user_id = 9 WHERE user_id = 20007;
UPDATE email_notifications SET user_id = 9 WHERE user_id = 20007;
UPDATE pdf_reviews SET user_id = 9 WHERE user_id = 20007;
UPDATE review_helpful SET user_id = 9 WHERE user_id = 20007;
UPDATE news_likes SET user_id = 9 WHERE user_id = 20007;

-- Move 20008 -> 10 (final: 10008 -> 10)
UPDATE users SET id = 10 WHERE id = 20008;
UPDATE magic_link_tokens SET user_id = 10 WHERE user_id = 20008;
UPDATE user_downloads SET user_id = 10 WHERE user_id = 20008;
UPDATE user_favorites SET user_id = 10 WHERE user_id = 20008;
UPDATE user_notification_settings SET user_id = 10 WHERE user_id = 20008;
UPDATE email_notifications SET user_id = 10 WHERE user_id = 20008;
UPDATE pdf_reviews SET user_id = 10 WHERE user_id = 20008;
UPDATE review_helpful SET user_id = 10 WHERE user_id = 20008;
UPDATE news_likes SET user_id = 10 WHERE user_id = 20008;

-- Move 20009 -> 11 (final: 10009 -> 11)
UPDATE users SET id = 11 WHERE id = 20009;
UPDATE magic_link_tokens SET user_id = 11 WHERE user_id = 20009;
UPDATE user_downloads SET user_id = 11 WHERE user_id = 20009;
UPDATE user_favorites SET user_id = 11 WHERE user_id = 20009;
UPDATE user_notification_settings SET user_id = 11 WHERE user_id = 20009;
UPDATE email_notifications SET user_id = 11 WHERE user_id = 20009;
UPDATE pdf_reviews SET user_id = 11 WHERE user_id = 20009;
UPDATE review_helpful SET user_id = 11 WHERE user_id = 20009;
UPDATE news_likes SET user_id = 11 WHERE user_id = 20009;

-- Move 20010 -> 12 (final: 10010 -> 12)
UPDATE users SET id = 12 WHERE id = 20010;
UPDATE magic_link_tokens SET user_id = 12 WHERE user_id = 20010;
UPDATE user_downloads SET user_id = 12 WHERE user_id = 20010;
UPDATE user_favorites SET user_id = 12 WHERE user_id = 20010;
UPDATE user_notification_settings SET user_id = 12 WHERE user_id = 20010;
UPDATE email_notifications SET user_id = 12 WHERE user_id = 20010;
UPDATE pdf_reviews SET user_id = 12 WHERE user_id = 20010;
UPDATE review_helpful SET user_id = 12 WHERE user_id = 20010;
UPDATE news_likes SET user_id = 12 WHERE user_id = 20010;

-- Move 20011 -> 13 (final: 10011 -> 13)
UPDATE users SET id = 13 WHERE id = 20011;
UPDATE magic_link_tokens SET user_id = 13 WHERE user_id = 20011;
UPDATE user_downloads SET user_id = 13 WHERE user_id = 20011;
UPDATE user_favorites SET user_id = 13 WHERE user_id = 20011;
UPDATE user_notification_settings SET user_id = 13 WHERE user_id = 20011;
UPDATE email_notifications SET user_id = 13 WHERE user_id = 20011;
UPDATE pdf_reviews SET user_id = 13 WHERE user_id = 20011;
UPDATE review_helpful SET user_id = 13 WHERE user_id = 20011;
UPDATE news_likes SET user_id = 13 WHERE user_id = 20011;

-- Move 20012 -> 14 (final: 10012 -> 14)
UPDATE users SET id = 14 WHERE id = 20012;
UPDATE magic_link_tokens SET user_id = 14 WHERE user_id = 20012;
UPDATE user_downloads SET user_id = 14 WHERE user_id = 20012;
UPDATE user_favorites SET user_id = 14 WHERE user_id = 20012;
UPDATE user_notification_settings SET user_id = 14 WHERE user_id = 20012;
UPDATE email_notifications SET user_id = 14 WHERE user_id = 20012;
UPDATE pdf_reviews SET user_id = 14 WHERE user_id = 20012;
UPDATE review_helpful SET user_id = 14 WHERE user_id = 20012;
UPDATE news_likes SET user_id = 14 WHERE user_id = 20012;

-- Move 20013 -> 15 (final: 10013 -> 15)
UPDATE users SET id = 15 WHERE id = 20013;
UPDATE magic_link_tokens SET user_id = 15 WHERE user_id = 20013;
UPDATE user_downloads SET user_id = 15 WHERE user_id = 20013;
UPDATE user_favorites SET user_id = 15 WHERE user_id = 20013;
UPDATE user_notification_settings SET user_id = 15 WHERE user_id = 20013;
UPDATE email_notifications SET user_id = 15 WHERE user_id = 20013;
UPDATE pdf_reviews SET user_id = 15 WHERE user_id = 20013;
UPDATE review_helpful SET user_id = 15 WHERE user_id = 20013;
UPDATE news_likes SET user_id = 15 WHERE user_id = 20013;

-- Move 20014 -> 16 (final: 10014 -> 16)
UPDATE users SET id = 16 WHERE id = 20014;
UPDATE magic_link_tokens SET user_id = 16 WHERE user_id = 20014;
UPDATE user_downloads SET user_id = 16 WHERE user_id = 20014;
UPDATE user_favorites SET user_id = 16 WHERE user_id = 20014;
UPDATE user_notification_settings SET user_id = 16 WHERE user_id = 20014;
UPDATE email_notifications SET user_id = 16 WHERE user_id = 20014;
UPDATE pdf_reviews SET user_id = 16 WHERE user_id = 20014;
UPDATE review_helpful SET user_id = 16 WHERE user_id = 20014;
UPDATE news_likes SET user_id = 16 WHERE user_id = 20014;

-- Move 20015 -> 17 (final: 10015 -> 17)
UPDATE users SET id = 17 WHERE id = 20015;
UPDATE magic_link_tokens SET user_id = 17 WHERE user_id = 20015;
UPDATE user_downloads SET user_id = 17 WHERE user_id = 20015;
UPDATE user_favorites SET user_id = 17 WHERE user_id = 20015;
UPDATE user_notification_settings SET user_id = 17 WHERE user_id = 20015;
UPDATE email_notifications SET user_id = 17 WHERE user_id = 20015;
UPDATE pdf_reviews SET user_id = 17 WHERE user_id = 20015;
UPDATE review_helpful SET user_id = 17 WHERE user_id = 20015;
UPDATE news_likes SET user_id = 17 WHERE user_id = 20015;

-- Move 20016 -> 18 (final: 10016 -> 18)
UPDATE users SET id = 18 WHERE id = 20016;
UPDATE magic_link_tokens SET user_id = 18 WHERE user_id = 20016;
UPDATE user_downloads SET user_id = 18 WHERE user_id = 20016;
UPDATE user_favorites SET user_id = 18 WHERE user_id = 20016;
UPDATE user_notification_settings SET user_id = 18 WHERE user_id = 20016;
UPDATE email_notifications SET user_id = 18 WHERE user_id = 20016;
UPDATE pdf_reviews SET user_id = 18 WHERE user_id = 20016;
UPDATE review_helpful SET user_id = 18 WHERE user_id = 20016;
UPDATE news_likes SET user_id = 18 WHERE user_id = 20016;

-- Move 20017 -> 19 (final: 10017 -> 19)
UPDATE users SET id = 19 WHERE id = 20017;
UPDATE magic_link_tokens SET user_id = 19 WHERE user_id = 20017;
UPDATE user_downloads SET user_id = 19 WHERE user_id = 20017;
UPDATE user_favorites SET user_id = 19 WHERE user_id = 20017;
UPDATE user_notification_settings SET user_id = 19 WHERE user_id = 20017;
UPDATE email_notifications SET user_id = 19 WHERE user_id = 20017;
UPDATE pdf_reviews SET user_id = 19 WHERE user_id = 20017;
UPDATE review_helpful SET user_id = 19 WHERE user_id = 20017;
UPDATE news_likes SET user_id = 19 WHERE user_id = 20017;

-- Move 20018 -> 20 (final: 10018 -> 20)
UPDATE users SET id = 20 WHERE id = 20018;
UPDATE magic_link_tokens SET user_id = 20 WHERE user_id = 20018;
UPDATE user_downloads SET user_id = 20 WHERE user_id = 20018;
UPDATE user_favorites SET user_id = 20 WHERE user_id = 20018;
UPDATE user_notification_settings SET user_id = 20 WHERE user_id = 20018;
UPDATE email_notifications SET user_id = 20 WHERE user_id = 20018;
UPDATE pdf_reviews SET user_id = 20 WHERE user_id = 20018;
UPDATE review_helpful SET user_id = 20 WHERE user_id = 20018;
UPDATE news_likes SET user_id = 20 WHERE user_id = 20018;

-- Move 20019 -> 21 (final: 10019 -> 21)
UPDATE users SET id = 21 WHERE id = 20019;
UPDATE magic_link_tokens SET user_id = 21 WHERE user_id = 20019;
UPDATE user_downloads SET user_id = 21 WHERE user_id = 20019;
UPDATE user_favorites SET user_id = 21 WHERE user_id = 20019;
UPDATE user_notification_settings SET user_id = 21 WHERE user_id = 20019;
UPDATE email_notifications SET user_id = 21 WHERE user_id = 20019;
UPDATE pdf_reviews SET user_id = 21 WHERE user_id = 20019;
UPDATE review_helpful SET user_id = 21 WHERE user_id = 20019;
UPDATE news_likes SET user_id = 21 WHERE user_id = 20019;

-- Move 20020 -> 22 (final: 10020 -> 22)
UPDATE users SET id = 22 WHERE id = 20020;
UPDATE magic_link_tokens SET user_id = 22 WHERE user_id = 20020;
UPDATE user_downloads SET user_id = 22 WHERE user_id = 20020;
UPDATE user_favorites SET user_id = 22 WHERE user_id = 20020;
UPDATE user_notification_settings SET user_id = 22 WHERE user_id = 20020;
UPDATE email_notifications SET user_id = 22 WHERE user_id = 20020;
UPDATE pdf_reviews SET user_id = 22 WHERE user_id = 20020;
UPDATE review_helpful SET user_id = 22 WHERE user_id = 20020;
UPDATE news_likes SET user_id = 22 WHERE user_id = 20020;

-- Move 20021 -> 23 (final: 10021 -> 23)
UPDATE users SET id = 23 WHERE id = 20021;
UPDATE magic_link_tokens SET user_id = 23 WHERE user_id = 20021;
UPDATE user_downloads SET user_id = 23 WHERE user_id = 20021;
UPDATE user_favorites SET user_id = 23 WHERE user_id = 20021;
UPDATE user_notification_settings SET user_id = 23 WHERE user_id = 20021;
UPDATE email_notifications SET user_id = 23 WHERE user_id = 20021;
UPDATE pdf_reviews SET user_id = 23 WHERE user_id = 20021;
UPDATE review_helpful SET user_id = 23 WHERE user_id = 20021;
UPDATE news_likes SET user_id = 23 WHERE user_id = 20021;

-- Move 20022 -> 24 (final: 10022 -> 24)
UPDATE users SET id = 24 WHERE id = 20022;
UPDATE magic_link_tokens SET user_id = 24 WHERE user_id = 20022;
UPDATE user_downloads SET user_id = 24 WHERE user_id = 20022;
UPDATE user_favorites SET user_id = 24 WHERE user_id = 20022;
UPDATE user_notification_settings SET user_id = 24 WHERE user_id = 20022;
UPDATE email_notifications SET user_id = 24 WHERE user_id = 20022;
UPDATE pdf_reviews SET user_id = 24 WHERE user_id = 20022;
UPDATE review_helpful SET user_id = 24 WHERE user_id = 20022;
UPDATE news_likes SET user_id = 24 WHERE user_id = 20022;

-- Move 20023 -> 25 (final: 10023 -> 25)
UPDATE users SET id = 25 WHERE id = 20023;
UPDATE magic_link_tokens SET user_id = 25 WHERE user_id = 20023;
UPDATE user_downloads SET user_id = 25 WHERE user_id = 20023;
UPDATE user_favorites SET user_id = 25 WHERE user_id = 20023;
UPDATE user_notification_settings SET user_id = 25 WHERE user_id = 20023;
UPDATE email_notifications SET user_id = 25 WHERE user_id = 20023;
UPDATE pdf_reviews SET user_id = 25 WHERE user_id = 20023;
UPDATE review_helpful SET user_id = 25 WHERE user_id = 20023;
UPDATE news_likes SET user_id = 25 WHERE user_id = 20023;

-- Move 20024 -> 26 (final: 10024 -> 26)
UPDATE users SET id = 26 WHERE id = 20024;
UPDATE magic_link_tokens SET user_id = 26 WHERE user_id = 20024;
UPDATE user_downloads SET user_id = 26 WHERE user_id = 20024;
UPDATE user_favorites SET user_id = 26 WHERE user_id = 20024;
UPDATE user_notification_settings SET user_id = 26 WHERE user_id = 20024;
UPDATE email_notifications SET user_id = 26 WHERE user_id = 20024;
UPDATE pdf_reviews SET user_id = 26 WHERE user_id = 20024;
UPDATE review_helpful SET user_id = 26 WHERE user_id = 20024;
UPDATE news_likes SET user_id = 26 WHERE user_id = 20024;

-- Move 20025 -> 27 (final: 10025 -> 27)
UPDATE users SET id = 27 WHERE id = 20025;
UPDATE magic_link_tokens SET user_id = 27 WHERE user_id = 20025;
UPDATE user_downloads SET user_id = 27 WHERE user_id = 20025;
UPDATE user_favorites SET user_id = 27 WHERE user_id = 20025;
UPDATE user_notification_settings SET user_id = 27 WHERE user_id = 20025;
UPDATE email_notifications SET user_id = 27 WHERE user_id = 20025;
UPDATE pdf_reviews SET user_id = 27 WHERE user_id = 20025;
UPDATE review_helpful SET user_id = 27 WHERE user_id = 20025;
UPDATE news_likes SET user_id = 27 WHERE user_id = 20025;

-- Move 20026 -> 28 (final: 10026 -> 28)
UPDATE users SET id = 28 WHERE id = 20026;
UPDATE magic_link_tokens SET user_id = 28 WHERE user_id = 20026;
UPDATE user_downloads SET user_id = 28 WHERE user_id = 20026;
UPDATE user_favorites SET user_id = 28 WHERE user_id = 20026;
UPDATE user_notification_settings SET user_id = 28 WHERE user_id = 20026;
UPDATE email_notifications SET user_id = 28 WHERE user_id = 20026;
UPDATE pdf_reviews SET user_id = 28 WHERE user_id = 20026;
UPDATE review_helpful SET user_id = 28 WHERE user_id = 20026;
UPDATE news_likes SET user_id = 28 WHERE user_id = 20026;

-- Move 20027 -> 29 (final: 10027 -> 29)
UPDATE users SET id = 29 WHERE id = 20027;
UPDATE magic_link_tokens SET user_id = 29 WHERE user_id = 20027;
UPDATE user_downloads SET user_id = 29 WHERE user_id = 20027;
UPDATE user_favorites SET user_id = 29 WHERE user_id = 20027;
UPDATE user_notification_settings SET user_id = 29 WHERE user_id = 20027;
UPDATE email_notifications SET user_id = 29 WHERE user_id = 20027;
UPDATE pdf_reviews SET user_id = 29 WHERE user_id = 20027;
UPDATE review_helpful SET user_id = 29 WHERE user_id = 20027;
UPDATE news_likes SET user_id = 29 WHERE user_id = 20027;

-- Move 20028 -> 30 (final: 10028 -> 30)
UPDATE users SET id = 30 WHERE id = 20028;
UPDATE magic_link_tokens SET user_id = 30 WHERE user_id = 20028;
UPDATE user_downloads SET user_id = 30 WHERE user_id = 20028;
UPDATE user_favorites SET user_id = 30 WHERE user_id = 20028;
UPDATE user_notification_settings SET user_id = 30 WHERE user_id = 20028;
UPDATE email_notifications SET user_id = 30 WHERE user_id = 20028;
UPDATE pdf_reviews SET user_id = 30 WHERE user_id = 20028;
UPDATE review_helpful SET user_id = 30 WHERE user_id = 20028;
UPDATE news_likes SET user_id = 30 WHERE user_id = 20028;

-- Move 20029 -> 31 (final: 10029 -> 31)
UPDATE users SET id = 31 WHERE id = 20029;
UPDATE magic_link_tokens SET user_id = 31 WHERE user_id = 20029;
UPDATE user_downloads SET user_id = 31 WHERE user_id = 20029;
UPDATE user_favorites SET user_id = 31 WHERE user_id = 20029;
UPDATE user_notification_settings SET user_id = 31 WHERE user_id = 20029;
UPDATE email_notifications SET user_id = 31 WHERE user_id = 20029;
UPDATE pdf_reviews SET user_id = 31 WHERE user_id = 20029;
UPDATE review_helpful SET user_id = 31 WHERE user_id = 20029;
UPDATE news_likes SET user_id = 31 WHERE user_id = 20029;

-- Move 20030 -> 32 (final: 10030 -> 32)
UPDATE users SET id = 32 WHERE id = 20030;
UPDATE magic_link_tokens SET user_id = 32 WHERE user_id = 20030;
UPDATE user_downloads SET user_id = 32 WHERE user_id = 20030;
UPDATE user_favorites SET user_id = 32 WHERE user_id = 20030;
UPDATE user_notification_settings SET user_id = 32 WHERE user_id = 20030;
UPDATE email_notifications SET user_id = 32 WHERE user_id = 20030;
UPDATE pdf_reviews SET user_id = 32 WHERE user_id = 20030;
UPDATE review_helpful SET user_id = 32 WHERE user_id = 20030;
UPDATE news_likes SET user_id = 32 WHERE user_id = 20030;

-- Move 20031 -> 33 (final: 10031 -> 33)
UPDATE users SET id = 33 WHERE id = 20031;
UPDATE magic_link_tokens SET user_id = 33 WHERE user_id = 20031;
UPDATE user_downloads SET user_id = 33 WHERE user_id = 20031;
UPDATE user_favorites SET user_id = 33 WHERE user_id = 20031;
UPDATE user_notification_settings SET user_id = 33 WHERE user_id = 20031;
UPDATE email_notifications SET user_id = 33 WHERE user_id = 20031;
UPDATE pdf_reviews SET user_id = 33 WHERE user_id = 20031;
UPDATE review_helpful SET user_id = 33 WHERE user_id = 20031;
UPDATE news_likes SET user_id = 33 WHERE user_id = 20031;

-- Move 20032 -> 34 (final: 10032 -> 34)
UPDATE users SET id = 34 WHERE id = 20032;
UPDATE magic_link_tokens SET user_id = 34 WHERE user_id = 20032;
UPDATE user_downloads SET user_id = 34 WHERE user_id = 20032;
UPDATE user_favorites SET user_id = 34 WHERE user_id = 20032;
UPDATE user_notification_settings SET user_id = 34 WHERE user_id = 20032;
UPDATE email_notifications SET user_id = 34 WHERE user_id = 20032;
UPDATE pdf_reviews SET user_id = 34 WHERE user_id = 20032;
UPDATE review_helpful SET user_id = 34 WHERE user_id = 20032;
UPDATE news_likes SET user_id = 34 WHERE user_id = 20032;

-- Move 20033 -> 35 (final: 10033 -> 35)
UPDATE users SET id = 35 WHERE id = 20033;
UPDATE magic_link_tokens SET user_id = 35 WHERE user_id = 20033;
UPDATE user_downloads SET user_id = 35 WHERE user_id = 20033;
UPDATE user_favorites SET user_id = 35 WHERE user_id = 20033;
UPDATE user_notification_settings SET user_id = 35 WHERE user_id = 20033;
UPDATE email_notifications SET user_id = 35 WHERE user_id = 20033;
UPDATE pdf_reviews SET user_id = 35 WHERE user_id = 20033;
UPDATE review_helpful SET user_id = 35 WHERE user_id = 20033;
UPDATE news_likes SET user_id = 35 WHERE user_id = 20033;

-- Move 20034 -> 36 (final: 10034 -> 36)
UPDATE users SET id = 36 WHERE id = 20034;
UPDATE magic_link_tokens SET user_id = 36 WHERE user_id = 20034;
UPDATE user_downloads SET user_id = 36 WHERE user_id = 20034;
UPDATE user_favorites SET user_id = 36 WHERE user_id = 20034;
UPDATE user_notification_settings SET user_id = 36 WHERE user_id = 20034;
UPDATE email_notifications SET user_id = 36 WHERE user_id = 20034;
UPDATE pdf_reviews SET user_id = 36 WHERE user_id = 20034;
UPDATE review_helpful SET user_id = 36 WHERE user_id = 20034;
UPDATE news_likes SET user_id = 36 WHERE user_id = 20034;

-- Move 20035 -> 37 (final: 10035 -> 37)
UPDATE users SET id = 37 WHERE id = 20035;
UPDATE magic_link_tokens SET user_id = 37 WHERE user_id = 20035;
UPDATE user_downloads SET user_id = 37 WHERE user_id = 20035;
UPDATE user_favorites SET user_id = 37 WHERE user_id = 20035;
UPDATE user_notification_settings SET user_id = 37 WHERE user_id = 20035;
UPDATE email_notifications SET user_id = 37 WHERE user_id = 20035;
UPDATE pdf_reviews SET user_id = 37 WHERE user_id = 20035;
UPDATE review_helpful SET user_id = 37 WHERE user_id = 20035;
UPDATE news_likes SET user_id = 37 WHERE user_id = 20035;

-- Move 20036 -> 38 (final: 10036 -> 38)
UPDATE users SET id = 38 WHERE id = 20036;
UPDATE magic_link_tokens SET user_id = 38 WHERE user_id = 20036;
UPDATE user_downloads SET user_id = 38 WHERE user_id = 20036;
UPDATE user_favorites SET user_id = 38 WHERE user_id = 20036;
UPDATE user_notification_settings SET user_id = 38 WHERE user_id = 20036;
UPDATE email_notifications SET user_id = 38 WHERE user_id = 20036;
UPDATE pdf_reviews SET user_id = 38 WHERE user_id = 20036;
UPDATE review_helpful SET user_id = 38 WHERE user_id = 20036;
UPDATE news_likes SET user_id = 38 WHERE user_id = 20036;

-- Move 20037 -> 39 (final: 10037 -> 39)
UPDATE users SET id = 39 WHERE id = 20037;
UPDATE magic_link_tokens SET user_id = 39 WHERE user_id = 20037;
UPDATE user_downloads SET user_id = 39 WHERE user_id = 20037;
UPDATE user_favorites SET user_id = 39 WHERE user_id = 20037;
UPDATE user_notification_settings SET user_id = 39 WHERE user_id = 20037;
UPDATE email_notifications SET user_id = 39 WHERE user_id = 20037;
UPDATE pdf_reviews SET user_id = 39 WHERE user_id = 20037;
UPDATE review_helpful SET user_id = 39 WHERE user_id = 20037;
UPDATE news_likes SET user_id = 39 WHERE user_id = 20037;

-- Move 20038 -> 40 (final: 10038 -> 40)
UPDATE users SET id = 40 WHERE id = 20038;
UPDATE magic_link_tokens SET user_id = 40 WHERE user_id = 20038;
UPDATE user_downloads SET user_id = 40 WHERE user_id = 20038;
UPDATE user_favorites SET user_id = 40 WHERE user_id = 20038;
UPDATE user_notification_settings SET user_id = 40 WHERE user_id = 20038;
UPDATE email_notifications SET user_id = 40 WHERE user_id = 20038;
UPDATE pdf_reviews SET user_id = 40 WHERE user_id = 20038;
UPDATE review_helpful SET user_id = 40 WHERE user_id = 20038;
UPDATE news_likes SET user_id = 40 WHERE user_id = 20038;

-- Move 20039 -> 41 (final: 10039 -> 41)
UPDATE users SET id = 41 WHERE id = 20039;
UPDATE magic_link_tokens SET user_id = 41 WHERE user_id = 20039;
UPDATE user_downloads SET user_id = 41 WHERE user_id = 20039;
UPDATE user_favorites SET user_id = 41 WHERE user_id = 20039;
UPDATE user_notification_settings SET user_id = 41 WHERE user_id = 20039;
UPDATE email_notifications SET user_id = 41 WHERE user_id = 20039;
UPDATE pdf_reviews SET user_id = 41 WHERE user_id = 20039;
UPDATE review_helpful SET user_id = 41 WHERE user_id = 20039;
UPDATE news_likes SET user_id = 41 WHERE user_id = 20039;

-- Move 20040 -> 42 (final: 10040 -> 42)
UPDATE users SET id = 42 WHERE id = 20040;
UPDATE magic_link_tokens SET user_id = 42 WHERE user_id = 20040;
UPDATE user_downloads SET user_id = 42 WHERE user_id = 20040;
UPDATE user_favorites SET user_id = 42 WHERE user_id = 20040;
UPDATE user_notification_settings SET user_id = 42 WHERE user_id = 20040;
UPDATE email_notifications SET user_id = 42 WHERE user_id = 20040;
UPDATE pdf_reviews SET user_id = 42 WHERE user_id = 20040;
UPDATE review_helpful SET user_id = 42 WHERE user_id = 20040;
UPDATE news_likes SET user_id = 42 WHERE user_id = 20040;

-- Move 20041 -> 43 (final: 10041 -> 43)
UPDATE users SET id = 43 WHERE id = 20041;
UPDATE magic_link_tokens SET user_id = 43 WHERE user_id = 20041;
UPDATE user_downloads SET user_id = 43 WHERE user_id = 20041;
UPDATE user_favorites SET user_id = 43 WHERE user_id = 20041;
UPDATE user_notification_settings SET user_id = 43 WHERE user_id = 20041;
UPDATE email_notifications SET user_id = 43 WHERE user_id = 20041;
UPDATE pdf_reviews SET user_id = 43 WHERE user_id = 20041;
UPDATE review_helpful SET user_id = 43 WHERE user_id = 20041;
UPDATE news_likes SET user_id = 43 WHERE user_id = 20041;

-- Move 20042 -> 44 (final: 10042 -> 44)
UPDATE users SET id = 44 WHERE id = 20042;
UPDATE magic_link_tokens SET user_id = 44 WHERE user_id = 20042;
UPDATE user_downloads SET user_id = 44 WHERE user_id = 20042;
UPDATE user_favorites SET user_id = 44 WHERE user_id = 20042;
UPDATE user_notification_settings SET user_id = 44 WHERE user_id = 20042;
UPDATE email_notifications SET user_id = 44 WHERE user_id = 20042;
UPDATE pdf_reviews SET user_id = 44 WHERE user_id = 20042;
UPDATE review_helpful SET user_id = 44 WHERE user_id = 20042;
UPDATE news_likes SET user_id = 44 WHERE user_id = 20042;

-- Move 20043 -> 45 (final: 10043 -> 45)
UPDATE users SET id = 45 WHERE id = 20043;
UPDATE magic_link_tokens SET user_id = 45 WHERE user_id = 20043;
UPDATE user_downloads SET user_id = 45 WHERE user_id = 20043;
UPDATE user_favorites SET user_id = 45 WHERE user_id = 20043;
UPDATE user_notification_settings SET user_id = 45 WHERE user_id = 20043;
UPDATE email_notifications SET user_id = 45 WHERE user_id = 20043;
UPDATE pdf_reviews SET user_id = 45 WHERE user_id = 20043;
UPDATE review_helpful SET user_id = 45 WHERE user_id = 20043;
UPDATE news_likes SET user_id = 45 WHERE user_id = 20043;

-- Move 20044 -> 46 (final: 10044 -> 46)
UPDATE users SET id = 46 WHERE id = 20044;
UPDATE magic_link_tokens SET user_id = 46 WHERE user_id = 20044;
UPDATE user_downloads SET user_id = 46 WHERE user_id = 20044;
UPDATE user_favorites SET user_id = 46 WHERE user_id = 20044;
UPDATE user_notification_settings SET user_id = 46 WHERE user_id = 20044;
UPDATE email_notifications SET user_id = 46 WHERE user_id = 20044;
UPDATE pdf_reviews SET user_id = 46 WHERE user_id = 20044;
UPDATE review_helpful SET user_id = 46 WHERE user_id = 20044;
UPDATE news_likes SET user_id = 46 WHERE user_id = 20044;

-- Move 20045 -> 47 (final: 10045 -> 47)
UPDATE users SET id = 47 WHERE id = 20045;
UPDATE magic_link_tokens SET user_id = 47 WHERE user_id = 20045;
UPDATE user_downloads SET user_id = 47 WHERE user_id = 20045;
UPDATE user_favorites SET user_id = 47 WHERE user_id = 20045;
UPDATE user_notification_settings SET user_id = 47 WHERE user_id = 20045;
UPDATE email_notifications SET user_id = 47 WHERE user_id = 20045;
UPDATE pdf_reviews SET user_id = 47 WHERE user_id = 20045;
UPDATE review_helpful SET user_id = 47 WHERE user_id = 20045;
UPDATE news_likes SET user_id = 47 WHERE user_id = 20045;

-- Move 20046 -> 48 (final: 10046 -> 48)
UPDATE users SET id = 48 WHERE id = 20046;
UPDATE magic_link_tokens SET user_id = 48 WHERE user_id = 20046;
UPDATE user_downloads SET user_id = 48 WHERE user_id = 20046;
UPDATE user_favorites SET user_id = 48 WHERE user_id = 20046;
UPDATE user_notification_settings SET user_id = 48 WHERE user_id = 20046;
UPDATE email_notifications SET user_id = 48 WHERE user_id = 20046;
UPDATE pdf_reviews SET user_id = 48 WHERE user_id = 20046;
UPDATE review_helpful SET user_id = 48 WHERE user_id = 20046;
UPDATE news_likes SET user_id = 48 WHERE user_id = 20046;

-- Move 20047 -> 49 (final: 10047 -> 49)
UPDATE users SET id = 49 WHERE id = 20047;
UPDATE magic_link_tokens SET user_id = 49 WHERE user_id = 20047;
UPDATE user_downloads SET user_id = 49 WHERE user_id = 20047;
UPDATE user_favorites SET user_id = 49 WHERE user_id = 20047;
UPDATE user_notification_settings SET user_id = 49 WHERE user_id = 20047;
UPDATE email_notifications SET user_id = 49 WHERE user_id = 20047;
UPDATE pdf_reviews SET user_id = 49 WHERE user_id = 20047;
UPDATE review_helpful SET user_id = 49 WHERE user_id = 20047;
UPDATE news_likes SET user_id = 49 WHERE user_id = 20047;

-- Move 20048 -> 50 (final: 10048 -> 50)
UPDATE users SET id = 50 WHERE id = 20048;
UPDATE magic_link_tokens SET user_id = 50 WHERE user_id = 20048;
UPDATE user_downloads SET user_id = 50 WHERE user_id = 20048;
UPDATE user_favorites SET user_id = 50 WHERE user_id = 20048;
UPDATE user_notification_settings SET user_id = 50 WHERE user_id = 20048;
UPDATE email_notifications SET user_id = 50 WHERE user_id = 20048;
UPDATE pdf_reviews SET user_id = 50 WHERE user_id = 20048;
UPDATE review_helpful SET user_id = 50 WHERE user_id = 20048;
UPDATE news_likes SET user_id = 50 WHERE user_id = 20048;

-- Move 20049 -> 51 (final: 10049 -> 51)
UPDATE users SET id = 51 WHERE id = 20049;
UPDATE magic_link_tokens SET user_id = 51 WHERE user_id = 20049;
UPDATE user_downloads SET user_id = 51 WHERE user_id = 20049;
UPDATE user_favorites SET user_id = 51 WHERE user_id = 20049;
UPDATE user_notification_settings SET user_id = 51 WHERE user_id = 20049;
UPDATE email_notifications SET user_id = 51 WHERE user_id = 20049;
UPDATE pdf_reviews SET user_id = 51 WHERE user_id = 20049;
UPDATE review_helpful SET user_id = 51 WHERE user_id = 20049;
UPDATE news_likes SET user_id = 51 WHERE user_id = 20049;

-- Move 20050 -> 52 (final: 10050 -> 52)
UPDATE users SET id = 52 WHERE id = 20050;
UPDATE magic_link_tokens SET user_id = 52 WHERE user_id = 20050;
UPDATE user_downloads SET user_id = 52 WHERE user_id = 20050;
UPDATE user_favorites SET user_id = 52 WHERE user_id = 20050;
UPDATE user_notification_settings SET user_id = 52 WHERE user_id = 20050;
UPDATE email_notifications SET user_id = 52 WHERE user_id = 20050;
UPDATE pdf_reviews SET user_id = 52 WHERE user_id = 20050;
UPDATE review_helpful SET user_id = 52 WHERE user_id = 20050;
UPDATE news_likes SET user_id = 52 WHERE user_id = 20050;

-- Move 20051 -> 53 (final: 10051 -> 53)
UPDATE users SET id = 53 WHERE id = 20051;
UPDATE magic_link_tokens SET user_id = 53 WHERE user_id = 20051;
UPDATE user_downloads SET user_id = 53 WHERE user_id = 20051;
UPDATE user_favorites SET user_id = 53 WHERE user_id = 20051;
UPDATE user_notification_settings SET user_id = 53 WHERE user_id = 20051;
UPDATE email_notifications SET user_id = 53 WHERE user_id = 20051;
UPDATE pdf_reviews SET user_id = 53 WHERE user_id = 20051;
UPDATE review_helpful SET user_id = 53 WHERE user_id = 20051;
UPDATE news_likes SET user_id = 53 WHERE user_id = 20051;

-- Move 20052 -> 54 (final: 10052 -> 54)
UPDATE users SET id = 54 WHERE id = 20052;
UPDATE magic_link_tokens SET user_id = 54 WHERE user_id = 20052;
UPDATE user_downloads SET user_id = 54 WHERE user_id = 20052;
UPDATE user_favorites SET user_id = 54 WHERE user_id = 20052;
UPDATE user_notification_settings SET user_id = 54 WHERE user_id = 20052;
UPDATE email_notifications SET user_id = 54 WHERE user_id = 20052;
UPDATE pdf_reviews SET user_id = 54 WHERE user_id = 20052;
UPDATE review_helpful SET user_id = 54 WHERE user_id = 20052;
UPDATE news_likes SET user_id = 54 WHERE user_id = 20052;

-- Move 20053 -> 55 (final: 10053 -> 55)
UPDATE users SET id = 55 WHERE id = 20053;
UPDATE magic_link_tokens SET user_id = 55 WHERE user_id = 20053;
UPDATE user_downloads SET user_id = 55 WHERE user_id = 20053;
UPDATE user_favorites SET user_id = 55 WHERE user_id = 20053;
UPDATE user_notification_settings SET user_id = 55 WHERE user_id = 20053;
UPDATE email_notifications SET user_id = 55 WHERE user_id = 20053;
UPDATE pdf_reviews SET user_id = 55 WHERE user_id = 20053;
UPDATE review_helpful SET user_id = 55 WHERE user_id = 20053;
UPDATE news_likes SET user_id = 55 WHERE user_id = 20053;

-- Move 20054 -> 56 (final: 10054 -> 56)
UPDATE users SET id = 56 WHERE id = 20054;
UPDATE magic_link_tokens SET user_id = 56 WHERE user_id = 20054;
UPDATE user_downloads SET user_id = 56 WHERE user_id = 20054;
UPDATE user_favorites SET user_id = 56 WHERE user_id = 20054;
UPDATE user_notification_settings SET user_id = 56 WHERE user_id = 20054;
UPDATE email_notifications SET user_id = 56 WHERE user_id = 20054;
UPDATE pdf_reviews SET user_id = 56 WHERE user_id = 20054;
UPDATE review_helpful SET user_id = 56 WHERE user_id = 20054;
UPDATE news_likes SET user_id = 56 WHERE user_id = 20054;

-- Move 20055 -> 57 (final: 10055 -> 57)
UPDATE users SET id = 57 WHERE id = 20055;
UPDATE magic_link_tokens SET user_id = 57 WHERE user_id = 20055;
UPDATE user_downloads SET user_id = 57 WHERE user_id = 20055;
UPDATE user_favorites SET user_id = 57 WHERE user_id = 20055;
UPDATE user_notification_settings SET user_id = 57 WHERE user_id = 20055;
UPDATE email_notifications SET user_id = 57 WHERE user_id = 20055;
UPDATE pdf_reviews SET user_id = 57 WHERE user_id = 20055;
UPDATE review_helpful SET user_id = 57 WHERE user_id = 20055;
UPDATE news_likes SET user_id = 57 WHERE user_id = 20055;

-- Move 20056 -> 58 (final: 10056 -> 58)
UPDATE users SET id = 58 WHERE id = 20056;
UPDATE magic_link_tokens SET user_id = 58 WHERE user_id = 20056;
UPDATE user_downloads SET user_id = 58 WHERE user_id = 20056;
UPDATE user_favorites SET user_id = 58 WHERE user_id = 20056;
UPDATE user_notification_settings SET user_id = 58 WHERE user_id = 20056;
UPDATE email_notifications SET user_id = 58 WHERE user_id = 20056;
UPDATE pdf_reviews SET user_id = 58 WHERE user_id = 20056;
UPDATE review_helpful SET user_id = 58 WHERE user_id = 20056;
UPDATE news_likes SET user_id = 58 WHERE user_id = 20056;

-- Move 20057 -> 59 (final: 10057 -> 59)
UPDATE users SET id = 59 WHERE id = 20057;
UPDATE magic_link_tokens SET user_id = 59 WHERE user_id = 20057;
UPDATE user_downloads SET user_id = 59 WHERE user_id = 20057;
UPDATE user_favorites SET user_id = 59 WHERE user_id = 20057;
UPDATE user_notification_settings SET user_id = 59 WHERE user_id = 20057;
UPDATE email_notifications SET user_id = 59 WHERE user_id = 20057;
UPDATE pdf_reviews SET user_id = 59 WHERE user_id = 20057;
UPDATE review_helpful SET user_id = 59 WHERE user_id = 20057;
UPDATE news_likes SET user_id = 59 WHERE user_id = 20057;

-- Move 20058 -> 60 (final: 10058 -> 60)
UPDATE users SET id = 60 WHERE id = 20058;
UPDATE magic_link_tokens SET user_id = 60 WHERE user_id = 20058;
UPDATE user_downloads SET user_id = 60 WHERE user_id = 20058;
UPDATE user_favorites SET user_id = 60 WHERE user_id = 20058;
UPDATE user_notification_settings SET user_id = 60 WHERE user_id = 20058;
UPDATE email_notifications SET user_id = 60 WHERE user_id = 20058;
UPDATE pdf_reviews SET user_id = 60 WHERE user_id = 20058;
UPDATE review_helpful SET user_id = 60 WHERE user_id = 20058;
UPDATE news_likes SET user_id = 60 WHERE user_id = 20058;

-- Move 20059 -> 61 (final: 10059 -> 61)
UPDATE users SET id = 61 WHERE id = 20059;
UPDATE magic_link_tokens SET user_id = 61 WHERE user_id = 20059;
UPDATE user_downloads SET user_id = 61 WHERE user_id = 20059;
UPDATE user_favorites SET user_id = 61 WHERE user_id = 20059;
UPDATE user_notification_settings SET user_id = 61 WHERE user_id = 20059;
UPDATE email_notifications SET user_id = 61 WHERE user_id = 20059;
UPDATE pdf_reviews SET user_id = 61 WHERE user_id = 20059;
UPDATE review_helpful SET user_id = 61 WHERE user_id = 20059;
UPDATE news_likes SET user_id = 61 WHERE user_id = 20059;

-- Move 20060 -> 62 (final: 10060 -> 62)
UPDATE users SET id = 62 WHERE id = 20060;
UPDATE magic_link_tokens SET user_id = 62 WHERE user_id = 20060;
UPDATE user_downloads SET user_id = 62 WHERE user_id = 20060;
UPDATE user_favorites SET user_id = 62 WHERE user_id = 20060;
UPDATE user_notification_settings SET user_id = 62 WHERE user_id = 20060;
UPDATE email_notifications SET user_id = 62 WHERE user_id = 20060;
UPDATE pdf_reviews SET user_id = 62 WHERE user_id = 20060;
UPDATE review_helpful SET user_id = 62 WHERE user_id = 20060;
UPDATE news_likes SET user_id = 62 WHERE user_id = 20060;

-- Move 20061 -> 63 (final: 10061 -> 63)
UPDATE users SET id = 63 WHERE id = 20061;
UPDATE magic_link_tokens SET user_id = 63 WHERE user_id = 20061;
UPDATE user_downloads SET user_id = 63 WHERE user_id = 20061;
UPDATE user_favorites SET user_id = 63 WHERE user_id = 20061;
UPDATE user_notification_settings SET user_id = 63 WHERE user_id = 20061;
UPDATE email_notifications SET user_id = 63 WHERE user_id = 20061;
UPDATE pdf_reviews SET user_id = 63 WHERE user_id = 20061;
UPDATE review_helpful SET user_id = 63 WHERE user_id = 20061;
UPDATE news_likes SET user_id = 63 WHERE user_id = 20061;

-- Move 20062 -> 64 (final: 10062 -> 64)
UPDATE users SET id = 64 WHERE id = 20062;
UPDATE magic_link_tokens SET user_id = 64 WHERE user_id = 20062;
UPDATE user_downloads SET user_id = 64 WHERE user_id = 20062;
UPDATE user_favorites SET user_id = 64 WHERE user_id = 20062;
UPDATE user_notification_settings SET user_id = 64 WHERE user_id = 20062;
UPDATE email_notifications SET user_id = 64 WHERE user_id = 20062;
UPDATE pdf_reviews SET user_id = 64 WHERE user_id = 20062;
UPDATE review_helpful SET user_id = 64 WHERE user_id = 20062;
UPDATE news_likes SET user_id = 64 WHERE user_id = 20062;

-- Move 20063 -> 65 (final: 10063 -> 65)
UPDATE users SET id = 65 WHERE id = 20063;
UPDATE magic_link_tokens SET user_id = 65 WHERE user_id = 20063;
UPDATE user_downloads SET user_id = 65 WHERE user_id = 20063;
UPDATE user_favorites SET user_id = 65 WHERE user_id = 20063;
UPDATE user_notification_settings SET user_id = 65 WHERE user_id = 20063;
UPDATE email_notifications SET user_id = 65 WHERE user_id = 20063;
UPDATE pdf_reviews SET user_id = 65 WHERE user_id = 20063;
UPDATE review_helpful SET user_id = 65 WHERE user_id = 20063;
UPDATE news_likes SET user_id = 65 WHERE user_id = 20063;

-- Move 20064 -> 66 (final: 10064 -> 66)
UPDATE users SET id = 66 WHERE id = 20064;
UPDATE magic_link_tokens SET user_id = 66 WHERE user_id = 20064;
UPDATE user_downloads SET user_id = 66 WHERE user_id = 20064;
UPDATE user_favorites SET user_id = 66 WHERE user_id = 20064;
UPDATE user_notification_settings SET user_id = 66 WHERE user_id = 20064;
UPDATE email_notifications SET user_id = 66 WHERE user_id = 20064;
UPDATE pdf_reviews SET user_id = 66 WHERE user_id = 20064;
UPDATE review_helpful SET user_id = 66 WHERE user_id = 20064;
UPDATE news_likes SET user_id = 66 WHERE user_id = 20064;

-- Move 20065 -> 67 (final: 10065 -> 67)
UPDATE users SET id = 67 WHERE id = 20065;
UPDATE magic_link_tokens SET user_id = 67 WHERE user_id = 20065;
UPDATE user_downloads SET user_id = 67 WHERE user_id = 20065;
UPDATE user_favorites SET user_id = 67 WHERE user_id = 20065;
UPDATE user_notification_settings SET user_id = 67 WHERE user_id = 20065;
UPDATE email_notifications SET user_id = 67 WHERE user_id = 20065;
UPDATE pdf_reviews SET user_id = 67 WHERE user_id = 20065;
UPDATE review_helpful SET user_id = 67 WHERE user_id = 20065;
UPDATE news_likes SET user_id = 67 WHERE user_id = 20065;

-- Move 20066 -> 68 (final: 10066 -> 68)
UPDATE users SET id = 68 WHERE id = 20066;
UPDATE magic_link_tokens SET user_id = 68 WHERE user_id = 20066;
UPDATE user_downloads SET user_id = 68 WHERE user_id = 20066;
UPDATE user_favorites SET user_id = 68 WHERE user_id = 20066;
UPDATE user_notification_settings SET user_id = 68 WHERE user_id = 20066;
UPDATE email_notifications SET user_id = 68 WHERE user_id = 20066;
UPDATE pdf_reviews SET user_id = 68 WHERE user_id = 20066;
UPDATE review_helpful SET user_id = 68 WHERE user_id = 20066;
UPDATE news_likes SET user_id = 68 WHERE user_id = 20066;

-- Move 20067 -> 69 (final: 10067 -> 69)
UPDATE users SET id = 69 WHERE id = 20067;
UPDATE magic_link_tokens SET user_id = 69 WHERE user_id = 20067;
UPDATE user_downloads SET user_id = 69 WHERE user_id = 20067;
UPDATE user_favorites SET user_id = 69 WHERE user_id = 20067;
UPDATE user_notification_settings SET user_id = 69 WHERE user_id = 20067;
UPDATE email_notifications SET user_id = 69 WHERE user_id = 20067;
UPDATE pdf_reviews SET user_id = 69 WHERE user_id = 20067;
UPDATE review_helpful SET user_id = 69 WHERE user_id = 20067;
UPDATE news_likes SET user_id = 69 WHERE user_id = 20067;

-- Move 20068 -> 70 (final: 10068 -> 70)
UPDATE users SET id = 70 WHERE id = 20068;
UPDATE magic_link_tokens SET user_id = 70 WHERE user_id = 20068;
UPDATE user_downloads SET user_id = 70 WHERE user_id = 20068;
UPDATE user_favorites SET user_id = 70 WHERE user_id = 20068;
UPDATE user_notification_settings SET user_id = 70 WHERE user_id = 20068;
UPDATE email_notifications SET user_id = 70 WHERE user_id = 20068;
UPDATE pdf_reviews SET user_id = 70 WHERE user_id = 20068;
UPDATE review_helpful SET user_id = 70 WHERE user_id = 20068;
UPDATE news_likes SET user_id = 70 WHERE user_id = 20068;

-- Move 20069 -> 71 (final: 10069 -> 71)
UPDATE users SET id = 71 WHERE id = 20069;
UPDATE magic_link_tokens SET user_id = 71 WHERE user_id = 20069;
UPDATE user_downloads SET user_id = 71 WHERE user_id = 20069;
UPDATE user_favorites SET user_id = 71 WHERE user_id = 20069;
UPDATE user_notification_settings SET user_id = 71 WHERE user_id = 20069;
UPDATE email_notifications SET user_id = 71 WHERE user_id = 20069;
UPDATE pdf_reviews SET user_id = 71 WHERE user_id = 20069;
UPDATE review_helpful SET user_id = 71 WHERE user_id = 20069;
UPDATE news_likes SET user_id = 71 WHERE user_id = 20069;

-- Move 20070 -> 72 (final: 10070 -> 72)
UPDATE users SET id = 72 WHERE id = 20070;
UPDATE magic_link_tokens SET user_id = 72 WHERE user_id = 20070;
UPDATE user_downloads SET user_id = 72 WHERE user_id = 20070;
UPDATE user_favorites SET user_id = 72 WHERE user_id = 20070;
UPDATE user_notification_settings SET user_id = 72 WHERE user_id = 20070;
UPDATE email_notifications SET user_id = 72 WHERE user_id = 20070;
UPDATE pdf_reviews SET user_id = 72 WHERE user_id = 20070;
UPDATE review_helpful SET user_id = 72 WHERE user_id = 20070;
UPDATE news_likes SET user_id = 72 WHERE user_id = 20070;

-- Move 20071 -> 73 (final: 10071 -> 73)
UPDATE users SET id = 73 WHERE id = 20071;
UPDATE magic_link_tokens SET user_id = 73 WHERE user_id = 20071;
UPDATE user_downloads SET user_id = 73 WHERE user_id = 20071;
UPDATE user_favorites SET user_id = 73 WHERE user_id = 20071;
UPDATE user_notification_settings SET user_id = 73 WHERE user_id = 20071;
UPDATE email_notifications SET user_id = 73 WHERE user_id = 20071;
UPDATE pdf_reviews SET user_id = 73 WHERE user_id = 20071;
UPDATE review_helpful SET user_id = 73 WHERE user_id = 20071;
UPDATE news_likes SET user_id = 73 WHERE user_id = 20071;

-- Move 20072 -> 74 (final: 10072 -> 74)
UPDATE users SET id = 74 WHERE id = 20072;
UPDATE magic_link_tokens SET user_id = 74 WHERE user_id = 20072;
UPDATE user_downloads SET user_id = 74 WHERE user_id = 20072;
UPDATE user_favorites SET user_id = 74 WHERE user_id = 20072;
UPDATE user_notification_settings SET user_id = 74 WHERE user_id = 20072;
UPDATE email_notifications SET user_id = 74 WHERE user_id = 20072;
UPDATE pdf_reviews SET user_id = 74 WHERE user_id = 20072;
UPDATE review_helpful SET user_id = 74 WHERE user_id = 20072;
UPDATE news_likes SET user_id = 74 WHERE user_id = 20072;

-- Move 20073 -> 75 (final: 10073 -> 75)
UPDATE users SET id = 75 WHERE id = 20073;
UPDATE magic_link_tokens SET user_id = 75 WHERE user_id = 20073;
UPDATE user_downloads SET user_id = 75 WHERE user_id = 20073;
UPDATE user_favorites SET user_id = 75 WHERE user_id = 20073;
UPDATE user_notification_settings SET user_id = 75 WHERE user_id = 20073;
UPDATE email_notifications SET user_id = 75 WHERE user_id = 20073;
UPDATE pdf_reviews SET user_id = 75 WHERE user_id = 20073;
UPDATE review_helpful SET user_id = 75 WHERE user_id = 20073;
UPDATE news_likes SET user_id = 75 WHERE user_id = 20073;

-- Move 20074 -> 76 (final: 10074 -> 76)
UPDATE users SET id = 76 WHERE id = 20074;
UPDATE magic_link_tokens SET user_id = 76 WHERE user_id = 20074;
UPDATE user_downloads SET user_id = 76 WHERE user_id = 20074;
UPDATE user_favorites SET user_id = 76 WHERE user_id = 20074;
UPDATE user_notification_settings SET user_id = 76 WHERE user_id = 20074;
UPDATE email_notifications SET user_id = 76 WHERE user_id = 20074;
UPDATE pdf_reviews SET user_id = 76 WHERE user_id = 20074;
UPDATE review_helpful SET user_id = 76 WHERE user_id = 20074;
UPDATE news_likes SET user_id = 76 WHERE user_id = 20074;

-- Move 20075 -> 77 (final: 10075 -> 77)
UPDATE users SET id = 77 WHERE id = 20075;
UPDATE magic_link_tokens SET user_id = 77 WHERE user_id = 20075;
UPDATE user_downloads SET user_id = 77 WHERE user_id = 20075;
UPDATE user_favorites SET user_id = 77 WHERE user_id = 20075;
UPDATE user_notification_settings SET user_id = 77 WHERE user_id = 20075;
UPDATE email_notifications SET user_id = 77 WHERE user_id = 20075;
UPDATE pdf_reviews SET user_id = 77 WHERE user_id = 20075;
UPDATE review_helpful SET user_id = 77 WHERE user_id = 20075;
UPDATE news_likes SET user_id = 77 WHERE user_id = 20075;

-- Move 20076 -> 78 (final: 10076 -> 78)
UPDATE users SET id = 78 WHERE id = 20076;
UPDATE magic_link_tokens SET user_id = 78 WHERE user_id = 20076;
UPDATE user_downloads SET user_id = 78 WHERE user_id = 20076;
UPDATE user_favorites SET user_id = 78 WHERE user_id = 20076;
UPDATE user_notification_settings SET user_id = 78 WHERE user_id = 20076;
UPDATE email_notifications SET user_id = 78 WHERE user_id = 20076;
UPDATE pdf_reviews SET user_id = 78 WHERE user_id = 20076;
UPDATE review_helpful SET user_id = 78 WHERE user_id = 20076;
UPDATE news_likes SET user_id = 78 WHERE user_id = 20076;

-- Move 20077 -> 79 (final: 10077 -> 79)
UPDATE users SET id = 79 WHERE id = 20077;
UPDATE magic_link_tokens SET user_id = 79 WHERE user_id = 20077;
UPDATE user_downloads SET user_id = 79 WHERE user_id = 20077;
UPDATE user_favorites SET user_id = 79 WHERE user_id = 20077;
UPDATE user_notification_settings SET user_id = 79 WHERE user_id = 20077;
UPDATE email_notifications SET user_id = 79 WHERE user_id = 20077;
UPDATE pdf_reviews SET user_id = 79 WHERE user_id = 20077;
UPDATE review_helpful SET user_id = 79 WHERE user_id = 20077;
UPDATE news_likes SET user_id = 79 WHERE user_id = 20077;

-- Move 20078 -> 80 (final: 10078 -> 80)
UPDATE users SET id = 80 WHERE id = 20078;
UPDATE magic_link_tokens SET user_id = 80 WHERE user_id = 20078;
UPDATE user_downloads SET user_id = 80 WHERE user_id = 20078;
UPDATE user_favorites SET user_id = 80 WHERE user_id = 20078;
UPDATE user_notification_settings SET user_id = 80 WHERE user_id = 20078;
UPDATE email_notifications SET user_id = 80 WHERE user_id = 20078;
UPDATE pdf_reviews SET user_id = 80 WHERE user_id = 20078;
UPDATE review_helpful SET user_id = 80 WHERE user_id = 20078;
UPDATE news_likes SET user_id = 80 WHERE user_id = 20078;

-- Move 20079 -> 81 (final: 10079 -> 81)
UPDATE users SET id = 81 WHERE id = 20079;
UPDATE magic_link_tokens SET user_id = 81 WHERE user_id = 20079;
UPDATE user_downloads SET user_id = 81 WHERE user_id = 20079;
UPDATE user_favorites SET user_id = 81 WHERE user_id = 20079;
UPDATE user_notification_settings SET user_id = 81 WHERE user_id = 20079;
UPDATE email_notifications SET user_id = 81 WHERE user_id = 20079;
UPDATE pdf_reviews SET user_id = 81 WHERE user_id = 20079;
UPDATE review_helpful SET user_id = 81 WHERE user_id = 20079;
UPDATE news_likes SET user_id = 81 WHERE user_id = 20079;

-- Move 20080 -> 82 (final: 10080 -> 82)
UPDATE users SET id = 82 WHERE id = 20080;
UPDATE magic_link_tokens SET user_id = 82 WHERE user_id = 20080;
UPDATE user_downloads SET user_id = 82 WHERE user_id = 20080;
UPDATE user_favorites SET user_id = 82 WHERE user_id = 20080;
UPDATE user_notification_settings SET user_id = 82 WHERE user_id = 20080;
UPDATE email_notifications SET user_id = 82 WHERE user_id = 20080;
UPDATE pdf_reviews SET user_id = 82 WHERE user_id = 20080;
UPDATE review_helpful SET user_id = 82 WHERE user_id = 20080;
UPDATE news_likes SET user_id = 82 WHERE user_id = 20080;

-- Move 20081 -> 83 (final: 10081 -> 83)
UPDATE users SET id = 83 WHERE id = 20081;
UPDATE magic_link_tokens SET user_id = 83 WHERE user_id = 20081;
UPDATE user_downloads SET user_id = 83 WHERE user_id = 20081;
UPDATE user_favorites SET user_id = 83 WHERE user_id = 20081;
UPDATE user_notification_settings SET user_id = 83 WHERE user_id = 20081;
UPDATE email_notifications SET user_id = 83 WHERE user_id = 20081;
UPDATE pdf_reviews SET user_id = 83 WHERE user_id = 20081;
UPDATE review_helpful SET user_id = 83 WHERE user_id = 20081;
UPDATE news_likes SET user_id = 83 WHERE user_id = 20081;

-- Move 20082 -> 84 (final: 10082 -> 84)
UPDATE users SET id = 84 WHERE id = 20082;
UPDATE magic_link_tokens SET user_id = 84 WHERE user_id = 20082;
UPDATE user_downloads SET user_id = 84 WHERE user_id = 20082;
UPDATE user_favorites SET user_id = 84 WHERE user_id = 20082;
UPDATE user_notification_settings SET user_id = 84 WHERE user_id = 20082;
UPDATE email_notifications SET user_id = 84 WHERE user_id = 20082;
UPDATE pdf_reviews SET user_id = 84 WHERE user_id = 20082;
UPDATE review_helpful SET user_id = 84 WHERE user_id = 20082;
UPDATE news_likes SET user_id = 84 WHERE user_id = 20082;

-- Move 20083 -> 85 (final: 10083 -> 85)
UPDATE users SET id = 85 WHERE id = 20083;
UPDATE magic_link_tokens SET user_id = 85 WHERE user_id = 20083;
UPDATE user_downloads SET user_id = 85 WHERE user_id = 20083;
UPDATE user_favorites SET user_id = 85 WHERE user_id = 20083;
UPDATE user_notification_settings SET user_id = 85 WHERE user_id = 20083;
UPDATE email_notifications SET user_id = 85 WHERE user_id = 20083;
UPDATE pdf_reviews SET user_id = 85 WHERE user_id = 20083;
UPDATE review_helpful SET user_id = 85 WHERE user_id = 20083;
UPDATE news_likes SET user_id = 85 WHERE user_id = 20083;

-- Move 20084 -> 86 (final: 10084 -> 86)
UPDATE users SET id = 86 WHERE id = 20084;
UPDATE magic_link_tokens SET user_id = 86 WHERE user_id = 20084;
UPDATE user_downloads SET user_id = 86 WHERE user_id = 20084;
UPDATE user_favorites SET user_id = 86 WHERE user_id = 20084;
UPDATE user_notification_settings SET user_id = 86 WHERE user_id = 20084;
UPDATE email_notifications SET user_id = 86 WHERE user_id = 20084;
UPDATE pdf_reviews SET user_id = 86 WHERE user_id = 20084;
UPDATE review_helpful SET user_id = 86 WHERE user_id = 20084;
UPDATE news_likes SET user_id = 86 WHERE user_id = 20084;

-- Move 20085 -> 87 (final: 10085 -> 87)
UPDATE users SET id = 87 WHERE id = 20085;
UPDATE magic_link_tokens SET user_id = 87 WHERE user_id = 20085;
UPDATE user_downloads SET user_id = 87 WHERE user_id = 20085;
UPDATE user_favorites SET user_id = 87 WHERE user_id = 20085;
UPDATE user_notification_settings SET user_id = 87 WHERE user_id = 20085;
UPDATE email_notifications SET user_id = 87 WHERE user_id = 20085;
UPDATE pdf_reviews SET user_id = 87 WHERE user_id = 20085;
UPDATE review_helpful SET user_id = 87 WHERE user_id = 20085;
UPDATE news_likes SET user_id = 87 WHERE user_id = 20085;

-- Move 20086 -> 88 (final: 10086 -> 88)
UPDATE users SET id = 88 WHERE id = 20086;
UPDATE magic_link_tokens SET user_id = 88 WHERE user_id = 20086;
UPDATE user_downloads SET user_id = 88 WHERE user_id = 20086;
UPDATE user_favorites SET user_id = 88 WHERE user_id = 20086;
UPDATE user_notification_settings SET user_id = 88 WHERE user_id = 20086;
UPDATE email_notifications SET user_id = 88 WHERE user_id = 20086;
UPDATE pdf_reviews SET user_id = 88 WHERE user_id = 20086;
UPDATE review_helpful SET user_id = 88 WHERE user_id = 20086;
UPDATE news_likes SET user_id = 88 WHERE user_id = 20086;

-- Move 20087 -> 89 (final: 10087 -> 89)
UPDATE users SET id = 89 WHERE id = 20087;
UPDATE magic_link_tokens SET user_id = 89 WHERE user_id = 20087;
UPDATE user_downloads SET user_id = 89 WHERE user_id = 20087;
UPDATE user_favorites SET user_id = 89 WHERE user_id = 20087;
UPDATE user_notification_settings SET user_id = 89 WHERE user_id = 20087;
UPDATE email_notifications SET user_id = 89 WHERE user_id = 20087;
UPDATE pdf_reviews SET user_id = 89 WHERE user_id = 20087;
UPDATE review_helpful SET user_id = 89 WHERE user_id = 20087;
UPDATE news_likes SET user_id = 89 WHERE user_id = 20087;

-- Move 20088 -> 90 (final: 10088 -> 90)
UPDATE users SET id = 90 WHERE id = 20088;
UPDATE magic_link_tokens SET user_id = 90 WHERE user_id = 20088;
UPDATE user_downloads SET user_id = 90 WHERE user_id = 20088;
UPDATE user_favorites SET user_id = 90 WHERE user_id = 20088;
UPDATE user_notification_settings SET user_id = 90 WHERE user_id = 20088;
UPDATE email_notifications SET user_id = 90 WHERE user_id = 20088;
UPDATE pdf_reviews SET user_id = 90 WHERE user_id = 20088;
UPDATE review_helpful SET user_id = 90 WHERE user_id = 20088;
UPDATE news_likes SET user_id = 90 WHERE user_id = 20088;

-- Move 20089 -> 91 (final: 10089 -> 91)
UPDATE users SET id = 91 WHERE id = 20089;
UPDATE magic_link_tokens SET user_id = 91 WHERE user_id = 20089;
UPDATE user_downloads SET user_id = 91 WHERE user_id = 20089;
UPDATE user_favorites SET user_id = 91 WHERE user_id = 20089;
UPDATE user_notification_settings SET user_id = 91 WHERE user_id = 20089;
UPDATE email_notifications SET user_id = 91 WHERE user_id = 20089;
UPDATE pdf_reviews SET user_id = 91 WHERE user_id = 20089;
UPDATE review_helpful SET user_id = 91 WHERE user_id = 20089;
UPDATE news_likes SET user_id = 91 WHERE user_id = 20089;

-- Move 20090 -> 92 (final: 10090 -> 92)
UPDATE users SET id = 92 WHERE id = 20090;
UPDATE magic_link_tokens SET user_id = 92 WHERE user_id = 20090;
UPDATE user_downloads SET user_id = 92 WHERE user_id = 20090;
UPDATE user_favorites SET user_id = 92 WHERE user_id = 20090;
UPDATE user_notification_settings SET user_id = 92 WHERE user_id = 20090;
UPDATE email_notifications SET user_id = 92 WHERE user_id = 20090;
UPDATE pdf_reviews SET user_id = 92 WHERE user_id = 20090;
UPDATE review_helpful SET user_id = 92 WHERE user_id = 20090;
UPDATE news_likes SET user_id = 92 WHERE user_id = 20090;

-- Move 20091 -> 93 (final: 10091 -> 93)
UPDATE users SET id = 93 WHERE id = 20091;
UPDATE magic_link_tokens SET user_id = 93 WHERE user_id = 20091;
UPDATE user_downloads SET user_id = 93 WHERE user_id = 20091;
UPDATE user_favorites SET user_id = 93 WHERE user_id = 20091;
UPDATE user_notification_settings SET user_id = 93 WHERE user_id = 20091;
UPDATE email_notifications SET user_id = 93 WHERE user_id = 20091;
UPDATE pdf_reviews SET user_id = 93 WHERE user_id = 20091;
UPDATE review_helpful SET user_id = 93 WHERE user_id = 20091;
UPDATE news_likes SET user_id = 93 WHERE user_id = 20091;

-- Move 20092 -> 94 (final: 10092 -> 94)
UPDATE users SET id = 94 WHERE id = 20092;
UPDATE magic_link_tokens SET user_id = 94 WHERE user_id = 20092;
UPDATE user_downloads SET user_id = 94 WHERE user_id = 20092;
UPDATE user_favorites SET user_id = 94 WHERE user_id = 20092;
UPDATE user_notification_settings SET user_id = 94 WHERE user_id = 20092;
UPDATE email_notifications SET user_id = 94 WHERE user_id = 20092;
UPDATE pdf_reviews SET user_id = 94 WHERE user_id = 20092;
UPDATE review_helpful SET user_id = 94 WHERE user_id = 20092;
UPDATE news_likes SET user_id = 94 WHERE user_id = 20092;

-- Move 20093 -> 95 (final: 10093 -> 95)
UPDATE users SET id = 95 WHERE id = 20093;
UPDATE magic_link_tokens SET user_id = 95 WHERE user_id = 20093;
UPDATE user_downloads SET user_id = 95 WHERE user_id = 20093;
UPDATE user_favorites SET user_id = 95 WHERE user_id = 20093;
UPDATE user_notification_settings SET user_id = 95 WHERE user_id = 20093;
UPDATE email_notifications SET user_id = 95 WHERE user_id = 20093;
UPDATE pdf_reviews SET user_id = 95 WHERE user_id = 20093;
UPDATE review_helpful SET user_id = 95 WHERE user_id = 20093;
UPDATE news_likes SET user_id = 95 WHERE user_id = 20093;

-- Move 20094 -> 96 (final: 10094 -> 96)
UPDATE users SET id = 96 WHERE id = 20094;
UPDATE magic_link_tokens SET user_id = 96 WHERE user_id = 20094;
UPDATE user_downloads SET user_id = 96 WHERE user_id = 20094;
UPDATE user_favorites SET user_id = 96 WHERE user_id = 20094;
UPDATE user_notification_settings SET user_id = 96 WHERE user_id = 20094;
UPDATE email_notifications SET user_id = 96 WHERE user_id = 20094;
UPDATE pdf_reviews SET user_id = 96 WHERE user_id = 20094;
UPDATE review_helpful SET user_id = 96 WHERE user_id = 20094;
UPDATE news_likes SET user_id = 96 WHERE user_id = 20094;

-- Move 20095 -> 97 (final: 10095 -> 97)
UPDATE users SET id = 97 WHERE id = 20095;
UPDATE magic_link_tokens SET user_id = 97 WHERE user_id = 20095;
UPDATE user_downloads SET user_id = 97 WHERE user_id = 20095;
UPDATE user_favorites SET user_id = 97 WHERE user_id = 20095;
UPDATE user_notification_settings SET user_id = 97 WHERE user_id = 20095;
UPDATE email_notifications SET user_id = 97 WHERE user_id = 20095;
UPDATE pdf_reviews SET user_id = 97 WHERE user_id = 20095;
UPDATE review_helpful SET user_id = 97 WHERE user_id = 20095;
UPDATE news_likes SET user_id = 97 WHERE user_id = 20095;

-- Move 20096 -> 98 (final: 10096 -> 98)
UPDATE users SET id = 98 WHERE id = 20096;
UPDATE magic_link_tokens SET user_id = 98 WHERE user_id = 20096;
UPDATE user_downloads SET user_id = 98 WHERE user_id = 20096;
UPDATE user_favorites SET user_id = 98 WHERE user_id = 20096;
UPDATE user_notification_settings SET user_id = 98 WHERE user_id = 20096;
UPDATE email_notifications SET user_id = 98 WHERE user_id = 20096;
UPDATE pdf_reviews SET user_id = 98 WHERE user_id = 20096;
UPDATE review_helpful SET user_id = 98 WHERE user_id = 20096;
UPDATE news_likes SET user_id = 98 WHERE user_id = 20096;

-- Move 20097 -> 99 (final: 10097 -> 99)
UPDATE users SET id = 99 WHERE id = 20097;
UPDATE magic_link_tokens SET user_id = 99 WHERE user_id = 20097;
UPDATE user_downloads SET user_id = 99 WHERE user_id = 20097;
UPDATE user_favorites SET user_id = 99 WHERE user_id = 20097;
UPDATE user_notification_settings SET user_id = 99 WHERE user_id = 20097;
UPDATE email_notifications SET user_id = 99 WHERE user_id = 20097;
UPDATE pdf_reviews SET user_id = 99 WHERE user_id = 20097;
UPDATE review_helpful SET user_id = 99 WHERE user_id = 20097;
UPDATE news_likes SET user_id = 99 WHERE user_id = 20097;

-- Move 20098 -> 100 (final: 10098 -> 100)
UPDATE users SET id = 100 WHERE id = 20098;
UPDATE magic_link_tokens SET user_id = 100 WHERE user_id = 20098;
UPDATE user_downloads SET user_id = 100 WHERE user_id = 20098;
UPDATE user_favorites SET user_id = 100 WHERE user_id = 20098;
UPDATE user_notification_settings SET user_id = 100 WHERE user_id = 20098;
UPDATE email_notifications SET user_id = 100 WHERE user_id = 20098;
UPDATE pdf_reviews SET user_id = 100 WHERE user_id = 20098;
UPDATE review_helpful SET user_id = 100 WHERE user_id = 20098;
UPDATE news_likes SET user_id = 100 WHERE user_id = 20098;

-- Move 20099 -> 101 (final: 10099 -> 101)
UPDATE users SET id = 101 WHERE id = 20099;
UPDATE magic_link_tokens SET user_id = 101 WHERE user_id = 20099;
UPDATE user_downloads SET user_id = 101 WHERE user_id = 20099;
UPDATE user_favorites SET user_id = 101 WHERE user_id = 20099;
UPDATE user_notification_settings SET user_id = 101 WHERE user_id = 20099;
UPDATE email_notifications SET user_id = 101 WHERE user_id = 20099;
UPDATE pdf_reviews SET user_id = 101 WHERE user_id = 20099;
UPDATE review_helpful SET user_id = 101 WHERE user_id = 20099;
UPDATE news_likes SET user_id = 101 WHERE user_id = 20099;

-- Move 20100 -> 102 (final: 10100 -> 102)
UPDATE users SET id = 102 WHERE id = 20100;
UPDATE magic_link_tokens SET user_id = 102 WHERE user_id = 20100;
UPDATE user_downloads SET user_id = 102 WHERE user_id = 20100;
UPDATE user_favorites SET user_id = 102 WHERE user_id = 20100;
UPDATE user_notification_settings SET user_id = 102 WHERE user_id = 20100;
UPDATE email_notifications SET user_id = 102 WHERE user_id = 20100;
UPDATE pdf_reviews SET user_id = 102 WHERE user_id = 20100;
UPDATE review_helpful SET user_id = 102 WHERE user_id = 20100;
UPDATE news_likes SET user_id = 102 WHERE user_id = 20100;

-- Move 20101 -> 103 (final: 10101 -> 103)
UPDATE users SET id = 103 WHERE id = 20101;
UPDATE magic_link_tokens SET user_id = 103 WHERE user_id = 20101;
UPDATE user_downloads SET user_id = 103 WHERE user_id = 20101;
UPDATE user_favorites SET user_id = 103 WHERE user_id = 20101;
UPDATE user_notification_settings SET user_id = 103 WHERE user_id = 20101;
UPDATE email_notifications SET user_id = 103 WHERE user_id = 20101;
UPDATE pdf_reviews SET user_id = 103 WHERE user_id = 20101;
UPDATE review_helpful SET user_id = 103 WHERE user_id = 20101;
UPDATE news_likes SET user_id = 103 WHERE user_id = 20101;

-- Move 20102 -> 104 (final: 10102 -> 104)
UPDATE users SET id = 104 WHERE id = 20102;
UPDATE magic_link_tokens SET user_id = 104 WHERE user_id = 20102;
UPDATE user_downloads SET user_id = 104 WHERE user_id = 20102;
UPDATE user_favorites SET user_id = 104 WHERE user_id = 20102;
UPDATE user_notification_settings SET user_id = 104 WHERE user_id = 20102;
UPDATE email_notifications SET user_id = 104 WHERE user_id = 20102;
UPDATE pdf_reviews SET user_id = 104 WHERE user_id = 20102;
UPDATE review_helpful SET user_id = 104 WHERE user_id = 20102;
UPDATE news_likes SET user_id = 104 WHERE user_id = 20102;

-- Move 20103 -> 105 (final: 10103 -> 105)
UPDATE users SET id = 105 WHERE id = 20103;
UPDATE magic_link_tokens SET user_id = 105 WHERE user_id = 20103;
UPDATE user_downloads SET user_id = 105 WHERE user_id = 20103;
UPDATE user_favorites SET user_id = 105 WHERE user_id = 20103;
UPDATE user_notification_settings SET user_id = 105 WHERE user_id = 20103;
UPDATE email_notifications SET user_id = 105 WHERE user_id = 20103;
UPDATE pdf_reviews SET user_id = 105 WHERE user_id = 20103;
UPDATE review_helpful SET user_id = 105 WHERE user_id = 20103;
UPDATE news_likes SET user_id = 105 WHERE user_id = 20103;

-- Move 20104 -> 106 (final: 10104 -> 106)
UPDATE users SET id = 106 WHERE id = 20104;
UPDATE magic_link_tokens SET user_id = 106 WHERE user_id = 20104;
UPDATE user_downloads SET user_id = 106 WHERE user_id = 20104;
UPDATE user_favorites SET user_id = 106 WHERE user_id = 20104;
UPDATE user_notification_settings SET user_id = 106 WHERE user_id = 20104;
UPDATE email_notifications SET user_id = 106 WHERE user_id = 20104;
UPDATE pdf_reviews SET user_id = 106 WHERE user_id = 20104;
UPDATE review_helpful SET user_id = 106 WHERE user_id = 20104;
UPDATE news_likes SET user_id = 106 WHERE user_id = 20104;

-- Move 20105 -> 107 (final: 10105 -> 107)
UPDATE users SET id = 107 WHERE id = 20105;
UPDATE magic_link_tokens SET user_id = 107 WHERE user_id = 20105;
UPDATE user_downloads SET user_id = 107 WHERE user_id = 20105;
UPDATE user_favorites SET user_id = 107 WHERE user_id = 20105;
UPDATE user_notification_settings SET user_id = 107 WHERE user_id = 20105;
UPDATE email_notifications SET user_id = 107 WHERE user_id = 20105;
UPDATE pdf_reviews SET user_id = 107 WHERE user_id = 20105;
UPDATE review_helpful SET user_id = 107 WHERE user_id = 20105;
UPDATE news_likes SET user_id = 107 WHERE user_id = 20105;

-- Move 20106 -> 108 (final: 10106 -> 108)
UPDATE users SET id = 108 WHERE id = 20106;
UPDATE magic_link_tokens SET user_id = 108 WHERE user_id = 20106;
UPDATE user_downloads SET user_id = 108 WHERE user_id = 20106;
UPDATE user_favorites SET user_id = 108 WHERE user_id = 20106;
UPDATE user_notification_settings SET user_id = 108 WHERE user_id = 20106;
UPDATE email_notifications SET user_id = 108 WHERE user_id = 20106;
UPDATE pdf_reviews SET user_id = 108 WHERE user_id = 20106;
UPDATE review_helpful SET user_id = 108 WHERE user_id = 20106;
UPDATE news_likes SET user_id = 108 WHERE user_id = 20106;

-- Move 20107 -> 109 (final: 10107 -> 109)
UPDATE users SET id = 109 WHERE id = 20107;
UPDATE magic_link_tokens SET user_id = 109 WHERE user_id = 20107;
UPDATE user_downloads SET user_id = 109 WHERE user_id = 20107;
UPDATE user_favorites SET user_id = 109 WHERE user_id = 20107;
UPDATE user_notification_settings SET user_id = 109 WHERE user_id = 20107;
UPDATE email_notifications SET user_id = 109 WHERE user_id = 20107;
UPDATE pdf_reviews SET user_id = 109 WHERE user_id = 20107;
UPDATE review_helpful SET user_id = 109 WHERE user_id = 20107;
UPDATE news_likes SET user_id = 109 WHERE user_id = 20107;

-- Move 20108 -> 110 (final: 10108 -> 110)
UPDATE users SET id = 110 WHERE id = 20108;
UPDATE magic_link_tokens SET user_id = 110 WHERE user_id = 20108;
UPDATE user_downloads SET user_id = 110 WHERE user_id = 20108;
UPDATE user_favorites SET user_id = 110 WHERE user_id = 20108;
UPDATE user_notification_settings SET user_id = 110 WHERE user_id = 20108;
UPDATE email_notifications SET user_id = 110 WHERE user_id = 20108;
UPDATE pdf_reviews SET user_id = 110 WHERE user_id = 20108;
UPDATE review_helpful SET user_id = 110 WHERE user_id = 20108;
UPDATE news_likes SET user_id = 110 WHERE user_id = 20108;

-- Move 20109 -> 111 (final: 10109 -> 111)
UPDATE users SET id = 111 WHERE id = 20109;
UPDATE magic_link_tokens SET user_id = 111 WHERE user_id = 20109;
UPDATE user_downloads SET user_id = 111 WHERE user_id = 20109;
UPDATE user_favorites SET user_id = 111 WHERE user_id = 20109;
UPDATE user_notification_settings SET user_id = 111 WHERE user_id = 20109;
UPDATE email_notifications SET user_id = 111 WHERE user_id = 20109;
UPDATE pdf_reviews SET user_id = 111 WHERE user_id = 20109;
UPDATE review_helpful SET user_id = 111 WHERE user_id = 20109;
UPDATE news_likes SET user_id = 111 WHERE user_id = 20109;

-- Move 20110 -> 112 (final: 10110 -> 112)
UPDATE users SET id = 112 WHERE id = 20110;
UPDATE magic_link_tokens SET user_id = 112 WHERE user_id = 20110;
UPDATE user_downloads SET user_id = 112 WHERE user_id = 20110;
UPDATE user_favorites SET user_id = 112 WHERE user_id = 20110;
UPDATE user_notification_settings SET user_id = 112 WHERE user_id = 20110;
UPDATE email_notifications SET user_id = 112 WHERE user_id = 20110;
UPDATE pdf_reviews SET user_id = 112 WHERE user_id = 20110;
UPDATE review_helpful SET user_id = 112 WHERE user_id = 20110;
UPDATE news_likes SET user_id = 112 WHERE user_id = 20110;

-- Move 20111 -> 113 (final: 10111 -> 113)
UPDATE users SET id = 113 WHERE id = 20111;
UPDATE magic_link_tokens SET user_id = 113 WHERE user_id = 20111;
UPDATE user_downloads SET user_id = 113 WHERE user_id = 20111;
UPDATE user_favorites SET user_id = 113 WHERE user_id = 20111;
UPDATE user_notification_settings SET user_id = 113 WHERE user_id = 20111;
UPDATE email_notifications SET user_id = 113 WHERE user_id = 20111;
UPDATE pdf_reviews SET user_id = 113 WHERE user_id = 20111;
UPDATE review_helpful SET user_id = 113 WHERE user_id = 20111;
UPDATE news_likes SET user_id = 113 WHERE user_id = 20111;

-- Move 20112 -> 114 (final: 10112 -> 114)
UPDATE users SET id = 114 WHERE id = 20112;
UPDATE magic_link_tokens SET user_id = 114 WHERE user_id = 20112;
UPDATE user_downloads SET user_id = 114 WHERE user_id = 20112;
UPDATE user_favorites SET user_id = 114 WHERE user_id = 20112;
UPDATE user_notification_settings SET user_id = 114 WHERE user_id = 20112;
UPDATE email_notifications SET user_id = 114 WHERE user_id = 20112;
UPDATE pdf_reviews SET user_id = 114 WHERE user_id = 20112;
UPDATE review_helpful SET user_id = 114 WHERE user_id = 20112;
UPDATE news_likes SET user_id = 114 WHERE user_id = 20112;

-- Move 20113 -> 115 (final: 10113 -> 115)
UPDATE users SET id = 115 WHERE id = 20113;
UPDATE magic_link_tokens SET user_id = 115 WHERE user_id = 20113;
UPDATE user_downloads SET user_id = 115 WHERE user_id = 20113;
UPDATE user_favorites SET user_id = 115 WHERE user_id = 20113;
UPDATE user_notification_settings SET user_id = 115 WHERE user_id = 20113;
UPDATE email_notifications SET user_id = 115 WHERE user_id = 20113;
UPDATE pdf_reviews SET user_id = 115 WHERE user_id = 20113;
UPDATE review_helpful SET user_id = 115 WHERE user_id = 20113;
UPDATE news_likes SET user_id = 115 WHERE user_id = 20113;

-- Move 20114 -> 116 (final: 10114 -> 116)
UPDATE users SET id = 116 WHERE id = 20114;
UPDATE magic_link_tokens SET user_id = 116 WHERE user_id = 20114;
UPDATE user_downloads SET user_id = 116 WHERE user_id = 20114;
UPDATE user_favorites SET user_id = 116 WHERE user_id = 20114;
UPDATE user_notification_settings SET user_id = 116 WHERE user_id = 20114;
UPDATE email_notifications SET user_id = 116 WHERE user_id = 20114;
UPDATE pdf_reviews SET user_id = 116 WHERE user_id = 20114;
UPDATE review_helpful SET user_id = 116 WHERE user_id = 20114;
UPDATE news_likes SET user_id = 116 WHERE user_id = 20114;

-- Move 20115 -> 117 (final: 10115 -> 117)
UPDATE users SET id = 117 WHERE id = 20115;
UPDATE magic_link_tokens SET user_id = 117 WHERE user_id = 20115;
UPDATE user_downloads SET user_id = 117 WHERE user_id = 20115;
UPDATE user_favorites SET user_id = 117 WHERE user_id = 20115;
UPDATE user_notification_settings SET user_id = 117 WHERE user_id = 20115;
UPDATE email_notifications SET user_id = 117 WHERE user_id = 20115;
UPDATE pdf_reviews SET user_id = 117 WHERE user_id = 20115;
UPDATE review_helpful SET user_id = 117 WHERE user_id = 20115;
UPDATE news_likes SET user_id = 117 WHERE user_id = 20115;

-- Move 20116 -> 118 (final: 10116 -> 118)
UPDATE users SET id = 118 WHERE id = 20116;
UPDATE magic_link_tokens SET user_id = 118 WHERE user_id = 20116;
UPDATE user_downloads SET user_id = 118 WHERE user_id = 20116;
UPDATE user_favorites SET user_id = 118 WHERE user_id = 20116;
UPDATE user_notification_settings SET user_id = 118 WHERE user_id = 20116;
UPDATE email_notifications SET user_id = 118 WHERE user_id = 20116;
UPDATE pdf_reviews SET user_id = 118 WHERE user_id = 20116;
UPDATE review_helpful SET user_id = 118 WHERE user_id = 20116;
UPDATE news_likes SET user_id = 118 WHERE user_id = 20116;

-- Move 20117 -> 119 (final: 10117 -> 119)
UPDATE users SET id = 119 WHERE id = 20117;
UPDATE magic_link_tokens SET user_id = 119 WHERE user_id = 20117;
UPDATE user_downloads SET user_id = 119 WHERE user_id = 20117;
UPDATE user_favorites SET user_id = 119 WHERE user_id = 20117;
UPDATE user_notification_settings SET user_id = 119 WHERE user_id = 20117;
UPDATE email_notifications SET user_id = 119 WHERE user_id = 20117;
UPDATE pdf_reviews SET user_id = 119 WHERE user_id = 20117;
UPDATE review_helpful SET user_id = 119 WHERE user_id = 20117;
UPDATE news_likes SET user_id = 119 WHERE user_id = 20117;

-- Verification query
SELECT id, name, email FROM users WHERE id < 200 ORDER BY id;
