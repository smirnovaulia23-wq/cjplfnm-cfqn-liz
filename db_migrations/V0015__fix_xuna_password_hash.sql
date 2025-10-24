-- Fix password hash for Xuna to SmirNova2468
UPDATE admin_users 
SET password_hash = 'a8f5f167f44f4964e6c998dee827110c063e28e29f86f1a8c84e0f64e3e50f4b'
WHERE username = 'Xuna';