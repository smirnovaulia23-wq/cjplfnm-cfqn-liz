-- Создаём таблицу для команд в расписании турнира
CREATE TABLE IF NOT EXISTS schedule_teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Удаляем старые foreign key constraints для team1_id и team2_id
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_team1_id_fkey;
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_team2_id_fkey;

-- Добавляем новые foreign key constraints, указывающие на schedule_teams
ALTER TABLE matches 
    ADD CONSTRAINT matches_team1_id_fkey 
    FOREIGN KEY (team1_id) REFERENCES schedule_teams(id);

ALTER TABLE matches 
    ADD CONSTRAINT matches_team2_id_fkey 
    FOREIGN KEY (team2_id) REFERENCES schedule_teams(id);