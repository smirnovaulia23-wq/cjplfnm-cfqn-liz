-- Вставка начальных данных
-- Выполните этот скрипт ПОСЛЕ создания структуры (01-mysql-schema.sql)

-- Администраторы
-- Пароль для Xuna: 0000 (хеш SHA-256)
-- Пароль для Dante: 0000 (хеш SHA-256)
INSERT INTO admin_users (username, password_hash, role) VALUES
('Xuna', '7e45e9698d89fc03a9012fa25e87a37ccf7154f623c4a49c1e8df294f30ad7c9', 'super_admin'),
('Dante', 'a7c1e9b45150876c9f247b1c7757fbb36e79dc18df7a4e811b1558a5291400c6', 'admin')
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    role = VALUES(role);

-- Настройки сайта
INSERT INTO settings (setting_key, setting_value) VALUES
('registration_open', 'true'),
('schedule_published', 'false'),
('challonge_url', ''),
('home_title', 'League of Legends: Wild Rift'),
('home_subtitle', 'Турнир 5x5'),
('home_description', 'Соберите команду и докажите своё мастерство в «Диком ущелье»'),
('home_info_blocks', '[]'),
('tournament_info', '{"tournamentName": "League of Legends: Wild Rift Турнир", "prizeFund": "20 000 рублей", "prizeCount": "3", "streamLinks": "https://www.twitch.tv/xuna_twitch", "sponsor": "", "startDate": "12 октября 2025", "registrationEnd": "13 октября 2025", "verticalBanner": "", "rules": "1. Участники турнира обязаны соблюдать Tournament Rules\\n2. Регистрация на турнир происходит через сайт\\n3. Турнир будет проводиться в формате Single Elimination\\n4. Формат: БО1 (до 1 победы), БО3 (до 2 побед) — полуфинал и финал\\n5. Все участники должны быть готовы к игре за 15 минут до начала матча", "regulationsLink": ""}')
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value);

-- ПРИМЕЧАНИЕ: Команды и регистрации добавляются через сайт
-- Если нужно перенести существующие команды, экспортируйте их из PostgreSQL и импортируйте через phpMyAdmin
