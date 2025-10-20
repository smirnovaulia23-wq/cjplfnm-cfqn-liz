-- Делаем password_hash nullable для индивидуальных игроков
ALTER TABLE individual_players ALTER COLUMN password_hash SET DEFAULT '';
ALTER TABLE individual_players ALTER COLUMN password_hash TYPE varchar(255);