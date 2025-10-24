-- ============================================
-- PostgreSQL Database Export
-- Tournament Management System
-- Export Date: 2025-10-24
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS schedule_teams CASCADE;
DROP TABLE IF EXISTS individual_registrations CASCADE;
DROP TABLE IF EXISTS team_registrations CASCADE;
DROP TABLE IF EXISTS individual_players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ============================================
-- TABLE: admin_users
-- ============================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_token VARCHAR(255)
);

INSERT INTO admin_users (id, username, password_hash, role, created_at, session_token) VALUES
(3, 'Dante', 'a7c1e9b45150876c9f247b1c7757fbb36e79dc18df7a4e811b1558a5291400c6', 'admin', '2025-10-24 13:03:57.441558', 'VQdNTNeTn2_vpUsnZEYnCRLD-uCnI8ikV9IRMhqAWhw'),
(1, 'Xuna', '7e45e9698d89fc03a9012fa25e87a37ccf7154f623c4a49c1e8df294f30ad7c9', 'super_admin', '2025-10-20 04:05:39.621921', 'iPvDkZQQpC3ksfOKzqgRu1ZlrfAdTTPmg6jTBsPzkH0');

SELECT setval('admin_users_id_seq', (SELECT MAX(id) FROM admin_users));

-- ============================================
-- TABLE: settings
-- ============================================
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (id, key, value, updated_at) VALUES
(35, 'home_title', 'League of Legends: Wild Rift', '2025-10-24 16:00:51.653321'),
(36, 'home_subtitle', 'Турнир 5x5', '2025-10-24 16:00:51.915944'),
(37, 'home_description', 'Соберите команду и докажите своё мастерство в «Диком ущелье»', '2025-10-24 16:00:52.130475'),
(32, 'schedule_published', 'false', '2025-10-24 14:03:58.534238'),
(1, 'registration_open', 'true', '2025-10-24 14:14:18.651232'),
(2, 'challonge_url', '', '2025-10-24 14:14:32.593937'),
(38, 'home_info_blocks', '[]', '2025-10-24 14:44:12.885268'),
(42, 'tournament_info', '{"tournamentName": "хина", "prizeFund": "20 000 рублей", "prizeCount": "3", "streamLinks": "https://www.twitch.tv/xuna_twitch", "sponsor": "тлттлт", "startDate": "12 октября 2025", "registrationEnd": "13 октября 2025", "verticalBanner": "https://www.resizepixel.com/Image/milogrxagqja/Preview/8ec68f678dedcc7ac702645df4bdeaad.jpg?v=caa39a39-516c-4160-830b-444892819e06", "rules": "1. Участники турнира обязаны соблюдать Tournament Rules, с которым они соглашаются автоматически при регистрации. \n2. Регистрация на турнир происходит через бота @RoriRYWR_bot.\n3. Турнир будет проводиться в формате «Своя игра» — «Выбор в слепую». \n4. Формат: БО1 (до 1 победы), БО3 (до 2 побед) — полуфинал и финал,\n5. Сетка Single Elimination. \n6. Победителем считается тот игрок, который дважды убьет своего оппонента или разрушит первую стратегическую башню (техническая победа).\n7. Запрещено: фарм леса, других лайнов, ключевых объектов, руна сноса вышек, ягоды на речках.\n8. Чемпион: Ноктюрн\n", "regulationsLink": "https://docs.google.com/document/d/13t_2T97JUVeFtZH_OJ0wIJC0pSvk_-ObAZy4vfLU6CM/edit?tab=t.0"}', '2025-10-24 16:00:52.357554');

SELECT setval('settings_id_seq', (SELECT MAX(id) FROM settings));

-- ============================================
-- TABLE: teams
-- ============================================
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    captain_nick VARCHAR(255) NOT NULL,
    captain_telegram VARCHAR(255) NOT NULL,
    top_nick VARCHAR(255) NOT NULL,
    top_telegram VARCHAR(255) NOT NULL,
    jungle_nick VARCHAR(255) NOT NULL,
    jungle_telegram VARCHAR(255) NOT NULL,
    mid_nick VARCHAR(255) NOT NULL,
    mid_telegram VARCHAR(255) NOT NULL,
    adc_nick VARCHAR(255) NOT NULL,
    adc_telegram VARCHAR(255) NOT NULL,
    support_nick VARCHAR(255) NOT NULL,
    support_telegram VARCHAR(255) NOT NULL,
    sub1_nick VARCHAR(255),
    sub1_telegram VARCHAR(255),
    sub2_nick VARCHAR(255),
    sub2_telegram VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_hash VARCHAR(255),
    is_edited BOOLEAN DEFAULT false
);

INSERT INTO teams (id, team_name, captain_nick, captain_telegram, top_nick, top_telegram, jungle_nick, jungle_telegram, mid_nick, mid_telegram, adc_nick, adc_telegram, support_nick, support_telegram, sub1_nick, sub1_telegram, sub2_nick, sub2_telegram, status, created_at, password_hash, is_edited) VALUES
(8, 'Test Team', 'CaptainTest', '@captaintest', 'TopPlayer', '@topplayer', 'JunglePlayer', '@jungleplayer', 'MidPlayer', '@midplayer', 'AdcPlayer', '@adcplayer', 'SupportPlayer', '@supportplayer', NULL, NULL, NULL, NULL, 'rejected', '2025-10-20 05:06:59.530541', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', false),
(9, 'Test Team', 'CaptainTest', '@captaintest', 'TopPlayer', '@topplayer', 'JunglePlayer', '@jungleplayer', 'MidPlayer', '@midplayer', 'AdcPlayer', '@adcplayer', 'SupportPlayer', '@supportplayer', NULL, NULL, NULL, NULL, 'rejected', '2025-10-20 05:10:52.155577', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', false),
(10, 'Test Team', 'CaptainTest', '@captaintest', 'TopPlayer', '@topplayer', 'JunglePlayer', '@jungleplayer', 'MidPlayer', '@midplayer', 'AdcPlayer', '@adcplayer', 'SupportPlayer', '@supportplayer', NULL, NULL, NULL, NULL, 'rejected', '2025-10-20 05:22:50.856862', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', false),
(12, 'Test Team', 'CaptainTest', '@captaintest', 'TopPlayer', '@topplayer', 'JunglePlayer', '@jungleplayer', 'MidPlayer', '@midplayer', 'AdcPlayer', '@adcplayer', 'SupportPlayer', '@supportplayer', NULL, NULL, NULL, NULL, 'rejected', '2025-10-20 05:28:30.397743', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', false),
(11, 'Test Team', 'CaptainTest', '@captaintest', 'TopPlayer', '@topplayer', 'JunglePlayer', '@jungleplayer', 'MidPlayer', '@midplayer', 'AdcPlayer', '@adcplayer', 'SupportPlayer', '@supportplayer', NULL, NULL, NULL, NULL, 'rejected', '2025-10-20 05:27:23.778136', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', false),
(13, 'Gujvcc', 'Fgujh', 'Rtyuibc', 'Fuibcry', 'Gfuvdtf', 'Ftuhcf', 'Gyuhcd', 'Vgujcfr', 'Tt7jcff', 'Gtuhvfd', 'Gf6uvfr', 'Fy7jcd', 'Gyuhcde', 'Ggujvc', 'Fyujvcc', '', '', 'rejected', '2025-10-20 05:39:14.304982', '37a4b768e8086f8fe54be3ca6bd13fb69f9376fabd1440509e63bdae73dbd753', false),
(14, 'Test Team', 'CaptainTest', '@captaintest', 'TopPlayer', '@topplayer', 'JunglePlayer', '@jungleplayer', 'MidPlayer', '@midplayer', 'AdcPlayer', '@adcplayer', 'SupportPlayer', '@supportplayer', NULL, NULL, NULL, NULL, 'rejected', '2025-10-20 06:30:57.436967', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', false),
(28, 'ybnjhkj', '[byfnf', '@Rywrxuna', 'nlnlnl', 'nknlnl', 'kjlkjlkj', 'jnlhljh', 'jlkjlkjl', 'kjljlkj', 'kjkljlj', 'jlkjljljk', 'jjldj;j', 'hduihdhdiuo', '', '', '', '', 'approved', '2025-10-24 14:25:22.560106', '7fbbc6617f5035bba74d2c0f3ae22d2b4f91b6f1b557f08794ad985f1a6deaf0', false);

SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams));

-- ============================================
-- TABLE: team_registrations
-- ============================================
CREATE TABLE team_registrations (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    captain_nick VARCHAR(255) NOT NULL,
    captain_telegram VARCHAR(255) NOT NULL,
    top_nick VARCHAR(255) NOT NULL,
    top_telegram VARCHAR(255) NOT NULL,
    jungle_nick VARCHAR(255) NOT NULL,
    jungle_telegram VARCHAR(255) NOT NULL,
    mid_nick VARCHAR(255) NOT NULL,
    mid_telegram VARCHAR(255) NOT NULL,
    adc_nick VARCHAR(255) NOT NULL,
    adc_telegram VARCHAR(255) NOT NULL,
    support_nick VARCHAR(255) NOT NULL,
    support_telegram VARCHAR(255) NOT NULL,
    sub1_nick VARCHAR(255),
    sub1_telegram VARCHAR(255),
    sub2_nick VARCHAR(255),
    sub2_telegram VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO team_registrations (id, team_name, captain_nick, captain_telegram, top_nick, top_telegram, jungle_nick, jungle_telegram, mid_nick, mid_telegram, adc_nick, adc_telegram, support_nick, support_telegram, sub1_nick, sub1_telegram, sub2_nick, sub2_telegram, created_at) VALUES
(1, 'Test Team', 'Captain1', '@captain', 'TopPlayer', '@top', 'JunglePlayer', '@jungle', 'MidPlayer', '@mid', 'ADCPlayer', '@adc', 'SupportPlayer', '@support', NULL, NULL, NULL, NULL, '2025-10-20 12:13:04.446057'),
(2, 'jb,b,b', 'hljhjhk', 'jbkbjjkb', 'vkhvkvkvkhv', 'bkjbkjbkjbkj', 'bkbjkjbkjbjkbbkb', 'bbbjkkjkbkjbj', 'bjjbjbkkjbjbjk', 'mbmmbmbmnmbmnmbn', 'bbmnbmbnbmnbnm', 'nbnmbmnbmmbmbn', 'bnmnbbmnmmbmnbnmbnm', 'nbnmbmbbnmmmmbnmbn', '', '', '', '', '2025-10-20 12:20:30.712302'),
(3, 'kldlkdalkfa', 'flimflam;a', 'fsalmf;lma;', 'sd;lcm;lasmc', 's casc.,msc', 'csmamc.amcs', 'scammcam.a', 'casmcamca', 'same.smc.,s', 'sc.,mc.sa,m', 'scam;mcs;asmc', 'scmakmscak', 'sea,m c acanc', 'csmcmckmn', 'smca;lmc', '', '', '2025-10-24 09:47:03.195002'),
(4, 'Test Team', 'Captain1', '@captain', 'TopPlayer', '@top', 'JunglePlayer', '@jungle', 'MidPlayer', '@mid', 'ADCPlayer', '@adc', 'SupportPlayer', '@support', '', '', '', '', '2025-10-24 09:54:41.780685'),
(5, 'Test Team', 'Captain1', '@captain', 'TopPlayer', '@top', 'JunglePlayer', '@jungle', 'MidPlayer', '@mid', 'ADCPlayer', '@adc', 'SupportPlayer', '@support', '', '', '', '', '2025-10-24 12:10:52.116839'),
(6, 'Чайна намбер ван', 'Чайник', '@chainek', '1', '@1', '2', '@2', '3', '@3', '4', '@4', '5', '@5', '0', '@0', '9', '@9', '2025-10-24 12:24:56.609174'),
(7, 'ybnjhkj', '[byfnf', '@Rywrxuna', 'nlnlnl', 'nknlnl', 'kjlkjlkj', 'jnlhljh', 'jlkjlkjl', 'kjljlkj', 'kjkljlj', 'jlkjljljk', 'jjldj;j', 'hduihdhdiuo', '', '', '', '', '2025-10-24 14:25:22.247796');

SELECT setval('team_registrations_id_seq', (SELECT MAX(id) FROM team_registrations));

-- ============================================
-- TABLE: individual_registrations
-- ============================================
CREATE TABLE individual_registrations (
    id SERIAL PRIMARY KEY,
    player_nick VARCHAR(255) NOT NULL,
    player_telegram VARCHAR(255) NOT NULL,
    main_role VARCHAR(50) NOT NULL,
    alternative_role VARCHAR(50),
    friend1_nick VARCHAR(255),
    friend1_telegram VARCHAR(255),
    friend2_nick VARCHAR(255),
    friend2_telegram VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO individual_registrations (id, player_nick, player_telegram, main_role, alternative_role, friend1_nick, friend1_telegram, friend2_nick, friend2_telegram, created_at) VALUES
(1, 'SoloPlayer', '@solo', 'mid', 'top', NULL, NULL, NULL, NULL, '2025-10-20 12:13:04.794364'),
(2, 'hlkhlhl', 'jhlhljhljhl', 'jungle', 'adc', NULL, NULL, NULL, NULL, '2025-10-20 12:17:18.457353'),
(3, 'bmbnnnmbnmbmn', 'nmbnmbnmbn', 'adc', 'top', 'bmnnbbmnmb', 'bnmbnmbbmnmn', '', '', '2025-10-20 12:20:50.002058'),
(4, 'ибитиьбибьиьб', 'тьбтьбтбьтб', 'any', NULL, 'оилоиоди', 'оитоиби', '', '', '2025-10-20 12:36:15.010352'),
(5, 'ибитиьбибьиьб', 'тьбтьбтбьтб', 'any', NULL, 'оилоиоди', 'оитоиби', '', '', '2025-10-20 12:36:16.899776'),
(6, 'ибитиьбибьиьб', '@tvbnmi', 'any', NULL, 'оилоиоди', 'оитоиби', '', '', '2025-10-20 12:36:33.597210'),
(7, 'ибитиьбибьиьб', '@tvbnmi', 'any', NULL, 'оилоиоди', 'оитоиби', '', '', '2025-10-20 12:36:35.095217'),
(8, 'ибитиьбибьиьб', '@tvbnmi', 'any', NULL, 'оилоиоди', 'оитоиби', '', '', '2025-10-20 12:37:59.819340'),
(9, 'ибитиьбибьиьб', '@tvbnmi', 'any', NULL, 'оилоиоди', 'оитоиби', '', '', '2025-10-20 12:38:01.168731'),
(10, 'SoloPlayer', '@solo', 'mid', 'top', NULL, NULL, NULL, NULL, '2025-10-24 09:54:42.754471'),
(11, 'SoloPlayer', '@solo', 'mid', 'top', NULL, NULL, NULL, NULL, '2025-10-24 12:10:53.562485');

SELECT setval('individual_registrations_id_seq', (SELECT MAX(id) FROM individual_registrations));

-- ============================================
-- TABLE: individual_players
-- ============================================
CREATE TABLE individual_players (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    telegram VARCHAR(255) NOT NULL,
    preferred_role VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL DEFAULT '',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferred_roles TEXT[],
    has_friends BOOLEAN DEFAULT false,
    friend1_nickname VARCHAR(255),
    friend1_telegram VARCHAR(255),
    friend1_roles TEXT[],
    friend2_nickname VARCHAR(255),
    friend2_telegram VARCHAR(255),
    friend2_roles TEXT[]
);

-- No data in individual_players table

-- ============================================
-- TABLE: schedule_teams
-- ============================================
CREATE TABLE schedule_teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schedule_teams (id, name, created_at) VALUES
(1, 'ник', '2025-10-24 13:45:42.118006'),
(2, 'ник 2', '2025-10-24 13:45:42.166426');

SELECT setval('schedule_teams_id_seq', (SELECT MAX(id) FROM schedule_teams));

-- ============================================
-- TABLE: matches
-- ============================================
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    team1_id INTEGER NOT NULL REFERENCES schedule_teams(id),
    team2_id INTEGER NOT NULL REFERENCES schedule_teams(id),
    team1_name TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    winner_team_id INTEGER REFERENCES teams(id),
    score_team1 INTEGER DEFAULT 0,
    score_team2 INTEGER DEFAULT 0,
    round TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stream_url TEXT
);

-- No data in matches table

-- ============================================
-- TABLE: user_sessions
-- ============================================
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    telegram VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

INSERT INTO user_sessions (id, telegram, user_type, session_token, created_at, expires_at) VALUES
(1, 'Xunaaaaa', 'team_captain', 'fYXET3prKGaDOh9h2mNHm-GNLcgW758DCYisq3VIRjY', '2025-10-20 04:54:54.303167', '2025-10-27 04:54:54.294219'),
(2, '@chainek', 'team_captain', '6PcbI107vQrPVer7Dp2qd3XsPMEFcTVfkDNb1iPbk6Q', '2025-10-24 12:35:23.549003', '2025-10-31 12:35:23.541307'),
(3, '@chainek', 'team_captain', 'EyW-SXSCrWZvHPjNbCYNkEK5FxlGytkEeGBVlM1LJ1M', '2025-10-24 12:38:25.211439', '2025-10-31 12:38:25.204185'),
(4, '@chainek', 'team_captain', '2-tewvNN15vjiuI3SauBvpILDWcaEzDWlqi9VKhobrU', '2025-10-24 12:41:51.062575', '2025-10-31 12:41:51.055305'),
(5, '@chainek', 'team_captain', 'UTLZIozNJC10cHRTQzl_lcfKBDLo44dHBZeO4Cn1PgI', '2025-10-24 12:42:09.616956', '2025-10-31 12:42:09.607018'),
(6, '@chainek', 'team_captain', '1NiiFSk1M8ZpSRxYLP467qAci3EJkn_Aac527wjwebE', '2025-10-24 12:45:54.746603', '2025-10-31 12:45:54.738613');

SELECT setval('user_sessions_id_seq', (SELECT MAX(id) FROM user_sessions));

-- ============================================
-- END OF EXPORT
-- ============================================
