-- Структура базы данных для MySQL на Timeweb
-- Выполните этот скрипт в phpMyAdmin или MySQL консоли

-- СБРОС БАЗЫ (используйте только если нужно очистить все данные)
-- DROP TABLE IF EXISTS schedule_teams;
-- DROP TABLE IF EXISTS matches;
-- DROP TABLE IF EXISTS individual_players;
-- DROP TABLE IF EXISTS individual_registrations;
-- DROP TABLE IF EXISTS team_registrations;
-- DROP TABLE IF EXISTS user_sessions;
-- DROP TABLE IF EXISTS teams;
-- DROP TABLE IF EXISTS settings;
-- DROP TABLE IF EXISTS admin_users;

-- Таблица администраторов
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_token VARCHAR(255) DEFAULT NULL,
    INDEX idx_session_token (session_token),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица команд
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL UNIQUE,
    captain_nick VARCHAR(255) NOT NULL,
    captain_telegram VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
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
    sub1_nick VARCHAR(255) DEFAULT NULL,
    sub1_telegram VARCHAR(255) DEFAULT NULL,
    sub2_nick VARCHAR(255) DEFAULT NULL,
    sub2_telegram VARCHAR(255) DEFAULT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_team_name (team_name),
    INDEX idx_is_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица сессий пользователей
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    INDEX idx_session_token (session_token),
    INDEX idx_team_id (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица регистраций команд (история)
CREATE TABLE IF NOT EXISTS team_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    sub1_nick VARCHAR(255) DEFAULT NULL,
    sub1_telegram VARCHAR(255) DEFAULT NULL,
    sub2_nick VARCHAR(255) DEFAULT NULL,
    sub2_telegram VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица индивидуальных регистраций
CREATE TABLE IF NOT EXISTS individual_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    telegram VARCHAR(255) NOT NULL,
    preferred_roles TEXT NOT NULL,
    has_friends BOOLEAN DEFAULT FALSE,
    friend1_nickname VARCHAR(255) DEFAULT NULL,
    friend1_telegram VARCHAR(255) DEFAULT NULL,
    friend1_roles TEXT DEFAULT NULL,
    friend2_nickname VARCHAR(255) DEFAULT NULL,
    friend2_telegram VARCHAR(255) DEFAULT NULL,
    friend2_roles TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица свободных игроков
CREATE TABLE IF NOT EXISTS individual_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    telegram VARCHAR(255) NOT NULL,
    preferred_roles TEXT NOT NULL,
    friend1_nickname VARCHAR(255) DEFAULT NULL,
    friend1_telegram VARCHAR(255) DEFAULT NULL,
    friend1_roles TEXT DEFAULT NULL,
    friend2_nickname VARCHAR(255) DEFAULT NULL,
    friend2_telegram VARCHAR(255) DEFAULT NULL,
    friend2_roles TEXT DEFAULT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица настроек
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица матчей
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    round_name VARCHAR(255) NOT NULL,
    match_number INT NOT NULL,
    team1_id INT DEFAULT NULL,
    team2_id INT DEFAULT NULL,
    scheduled_time TIMESTAMP NULL DEFAULT NULL,
    result VARCHAR(50) DEFAULT NULL,
    stream_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE SET NULL,
    INDEX idx_round (round_name),
    INDEX idx_scheduled_time (scheduled_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица команд в расписании
CREATE TABLE IF NOT EXISTS schedule_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    INDEX idx_team_id (team_id),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
