import hashlib

passwords = [
    "SmirNova2468",
    "smirnova2468",
    " SmirNova2468",
    "SmirNova2468 "
]

target_hash = "7e45e9698d89fc03a9012fa25e87a37ccf7154f623c4a49c1e8df294f30ad7c9"

print("SHA-256 хеши паролей:")
print("=" * 80)

for pwd in passwords:
    h = hashlib.sha256(pwd.encode()).hexdigest()
    match = " ✓ СОВПАДЕНИЕ!" if h == target_hash else ""
    print(f"{pwd!r}: {h}{match}")
