-- Create matches table for tournament schedule
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    match_date DATE NOT NULL,
    match_time TIME NOT NULL,
    team1_id INTEGER NOT NULL REFERENCES teams(id),
    team2_id INTEGER NOT NULL REFERENCES teams(id),
    team1_name TEXT NOT NULL,
    team2_name TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
    winner_team_id INTEGER REFERENCES teams(id),
    score_team1 INTEGER DEFAULT 0,
    score_team2 INTEGER DEFAULT 0,
    round TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_teams ON matches(team1_id, team2_id);
