-- Добавляем поле password_hash в таблицу teams для аутентификации капитанов команд
ALTER TABLE teams ADD COLUMN password_hash VARCHAR(255);

-- Создаем таблицу для индивидуальной регистрации игроков
CREATE TABLE individual_players (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    telegram VARCHAR(255) NOT NULL UNIQUE,
    preferred_role VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу для сессий пользователей
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    telegram VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Индексы для быстрого поиска
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_telegram ON user_sessions(telegram);
CREATE INDEX idx_individual_players_telegram ON individual_players(telegram);