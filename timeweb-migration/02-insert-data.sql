-- Вставка начальных данных из текущей базы
-- Выполните этот скрипт после создания структуры

-- Администраторы (ВАЖНО: эти данные нужно вставить вручную)
INSERT INTO admin_users (id, username, password_hash, role, session_token) VALUES
(1, 'Xuna', '7e45e9698d89fc03a9012fa25e87a37ccf7154f623c4a49c1e8df294f30ad7c9', 'super_admin', NULL),
(3, 'Dante', 'a7c1e9b45150876c9f247b1c7757fbb36e79dc18df7a4e811b1558a5291400c6', 'admin', NULL);

-- Настройки сайта
INSERT INTO settings (setting_key, setting_value) VALUES
('registration_open', 'true'),
('schedule_published', 'false'),
('challonge_url', ''),
('home_title', 'League of Legends: Wild Rift'),
('home_subtitle', 'Турнир 5x5'),
('home_description', 'Соберите команду и докажите своё мастерство в «Диком ущелье»'),
('home_info_blocks', '[]'),
('tournament_info', '{"tournamentName": "хина", "prizeFund": "20 000 рублей", "prizeCount": "3", "streamLinks": "https://www.twitch.tv/xuna_twitch", "sponsor": "тлттлт", "startDate": "12 октября 2025", "registrationEnd": "13 октября 2025", "verticalBanner": "https://www.resizepixel.com/Image/milogrxagqja/Preview/8ec68f678dedcc7ac702645df4bdeaad.jpg?v=caa39a39-516c-4160-830b-444892819e06", "rules": "1. Участники турнира обязаны соблюдать Tournament Rules, с которым они соглашаются автоматически при регистрации. \\n2. Регистрация на турнир происходит через бота @RoriRYWR_bot.\\n3. Турнир будет проводиться в формате «Своя игра» — «Выбор в слепую». \\n4. Формат: БО1 (до 1 победы), БО3 (до 2 побед) — полуфинал и финал,\\n5. Сетка Single Elimination. \\n6. Победителем считается тот игрок, который дважды убьет своего оппонента или разрушит первую стратегическую башню (техническая победа).\\n7. Запрещено: фарм леса, других лайнов, ключевых объектов, руна сноса вышек, ягоды на речках.\\n8. Чемпион: Ноктюрн\\n", "regulationsLink": "https://docs.google.com/document/d/13t_2T97JUVeFtZH_OJ0wIJC0pSvk_-ObAZy4vfLU6CM/edit?tab=t.0"}');

-- ПРИМЕЧАНИЕ: Команды и регистрации нужно экспортировать отдельно
-- Используйте панель Timeweb для импорта из CSV или выполните экспорт из PostgreSQL
