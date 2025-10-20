-- Таблица для командных регистраций
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

-- Таблица для индивидуальных регистраций
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

-- Индексы для быстрого поиска
CREATE INDEX idx_team_captain ON team_registrations(captain_telegram);
CREATE INDEX idx_individual_nick ON individual_registrations(player_nick);
CREATE INDEX idx_individual_telegram ON individual_registrations(player_telegram);