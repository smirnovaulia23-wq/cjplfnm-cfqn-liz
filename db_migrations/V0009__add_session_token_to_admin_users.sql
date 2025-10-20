-- Добавляем колонку session_token для хранения токенов администраторов
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS session_token VARCHAR(255);