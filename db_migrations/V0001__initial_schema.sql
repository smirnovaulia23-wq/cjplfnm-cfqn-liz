CREATE TABLE IF NOT EXISTS teams (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (key, value) VALUES ('registration_open', 'true') ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_users (username, password_hash, role) VALUES ('Xuna', 'Smirnova2468', 'super_admin') ON CONFLICT (username) DO NOTHING;