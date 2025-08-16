import qrcode
import sys
import os

# Ambil data dari argumen CLI
if len(sys.argv) < 3:
    print("Usage: python generate_qr.py <data> <output_path>")
    sys.exit(1)

data = sys.argv[1]
output_path = sys.argv[2]

# Pastikan folder tujuan ada
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Generate QR
img = qrcode.make(data)

# Simpan ke file
img.save(output_path)

print(f"QR Code berhasil dibuat di: {output_path}")



