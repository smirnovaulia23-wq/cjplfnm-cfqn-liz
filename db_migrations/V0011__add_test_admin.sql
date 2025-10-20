-- Create test admin with known password hash
-- Password: "test123" -> SHA256: ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae
INSERT INTO admin_users (username, password_hash, role) 
VALUES ('testadmin', 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae', 'admin')
ON CONFLICT (username) DO NOTHING;