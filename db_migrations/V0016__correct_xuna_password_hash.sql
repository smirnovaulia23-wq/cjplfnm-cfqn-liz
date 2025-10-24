-- Fix password hash for Xuna - correct hash for SmirNova2468
UPDATE admin_users 
SET password_hash = '7e45e9698d89fc03a9012fa25e87a37ccf7154f623c4a49c1e8df294f30ad7c9'
WHERE username = 'Xuna';