-- Изменяем колонки friend1_role и friend2_role на массивы
ALTER TABLE individual_players 
  ALTER COLUMN friend1_role TYPE text[] USING CASE 
    WHEN friend1_role IS NULL THEN NULL 
    ELSE ARRAY[friend1_role]::text[] 
  END;

ALTER TABLE individual_players 
  ALTER COLUMN friend2_role TYPE text[] USING CASE 
    WHEN friend2_role IS NULL THEN NULL 
    ELSE ARRAY[friend2_role]::text[] 
  END;

-- Переименовываем колонки для консистентности
ALTER TABLE individual_players RENAME COLUMN friend1_role TO friend1_roles;
ALTER TABLE individual_players RENAME COLUMN friend2_role TO friend2_roles;