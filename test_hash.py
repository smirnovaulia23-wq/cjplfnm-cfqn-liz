import hashlib

password = "Smirnova2468"
hashed = hashlib.sha256(password.encode()).hexdigest()
print(f"Password: {password}")
print(f"Hash: {hashed}")
