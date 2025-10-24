-- Добавляем настройку для публикации расписания
INSERT INTO settings (key, value) 
VALUES ('schedule_published', 'false')
ON CONFLICT (key) DO UPDATE SET value = 'false';