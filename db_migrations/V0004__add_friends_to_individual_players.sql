ALTER TABLE individual_players 
ADD COLUMN has_friends BOOLEAN DEFAULT false,
ADD COLUMN friend1_nickname VARCHAR(255),
ADD COLUMN friend1_telegram VARCHAR(255),
ADD COLUMN friend1_role VARCHAR(50),
ADD COLUMN friend2_nickname VARCHAR(255),
ADD COLUMN friend2_telegram VARCHAR(255),
ADD COLUMN friend2_role VARCHAR(50);