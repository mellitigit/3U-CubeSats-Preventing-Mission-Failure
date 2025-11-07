import os
import pandas as pd
from datetime import datetime
from data_classifier import detect_data_type
from compression_engine import (
    compress_image_jpeg,
    compress_lz4,
    compress_zstd
)

# CSV log file
LOG_FILE = "compressed_files.csv"


# ---------------------------------------------------------
# Utility: get file size in MB
# ---------------------------------------------------------
def file_size(filepath):
    return os.path.getsize(filepath) / (1024 * 1024)


# ---------------------------------------------------------
# Save results to CSV
# ---------------------------------------------------------
def save_results_to_csv(row_dict):
    df_row = pd.DataFrame([row_dict])

    if not os.path.exists(LOG_FILE):
        df_row.to_csv(LOG_FILE, index=False)
    else:
        df_row.to_csv(LOG_FILE, mode='a', header=False, index=False)

    print(f"✅ Results saved to {LOG_FILE}")


# ---------------------------------------------------------
# Test one file with automatic compression selection
# ---------------------------------------------------------
def test_compression(input_path):
    print("\n==========================================")
    print(f"📂 Testing File: {input_path}")
    print("==========================================")

    if not os.path.exists(input_path):
        print("❌ ERROR: File does not exist!")
        return

    # Detect type
    data_type = detect_data_type(input_path)
    print(f"🧩 Detected Data Type: {data_type}")

    # Original size
    original = file_size(input_path)
    print(f"📦 Original Size: {original:.2f} MB")

    # Apply compression based on type
    if data_type == "image":
        print("🖼️ Running JPEG Compression...")
        out_path = input_path + "_compressed.jpg"
        compress_image_jpeg(input_path, out_path, 40)

    elif data_type == "telemetry":
        print("📡 Running LZ4 Compression...")
        out_path = input_path + ".lz4"
        compress_lz4(input_path, out_path, level=2)

    elif data_type == "science":
        print("🔬 Running Zstd Compression...")
        out_path = input_path + ".zst"
        compress_zstd(input_path, out_path, level=5)

    else:
        print("⚠ Unknown/Unsupported type. No compression.")
        return

    # Compressed size
    compressed = file_size(out_path)
    saved = original - compressed
    ratio = compressed / original if original > 0 else 1

    print(f"✅ Compressed File: {out_path}")
    print(f"📦 Compressed Size: {compressed:.2f} MB")
    print(f"💾 Saved: {saved:.2f} MB")
    print("==========================================\n")

    # -------------------------------------------
    # SAVE RESULTS TO CSV
    # -------------------------------------------
    save_results_to_csv({
        "filename": os.path.basename(input_path),
        "data_type": data_type,
        "original_size_MB": round(original, 3),
        "compressed_size_MB": round(compressed, 3),
        "saved_MB": round(saved, 3),
        "compression_ratio": round(ratio, 3),
        "output_file": out_path,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


# ---------------------------------------------------------
# Generate realistic test files
# ---------------------------------------------------------
def generate_test_files():
    os.makedirs("test_files", exist_ok=True)

    print("\n📁 Generating Test Files...")

    # Image file (you must place it manually)
    if not os.path.exists("test_files/1.jpg"):
        print("⚠ WARNING: Missing image. Please place a JPEG at test_files/1.jpg")

    # Telemetry CSV
    print("📝 Creating telemetry CSV...")
    with open("test_files/telemetry.csv", "w") as f:
        f.write("temp,voltage,altitude\n")
        for i in range(5000):
            f.write(f"{20+i%5},{7.4+i%2},{400+i%10}\n")

    # Science binary (compressible)
    print("🔬 Creating science data binary...")
    with open("test_files/science_data.bin", "wb") as f:
        f.write((b'\x00\x01\x02\x03' * 500000))

    # Logs
    print("📘 Creating log file...")
    with open("test_files/log.txt", "w") as f:
        for i in range(30000):
            f.write(f"[INFO] Timestamp={i} System nominal\n")

    print("✅ All test files generated!\n")


# ---------------------------------------------------------
# MAIN MENU
# ---------------------------------------------------------
if __name__ == "__main__":
    generate_test_files()

    print("✅ READY TO TEST!")
    print("1️⃣ Test image")
    print("2️⃣ Test telemetry")
    print("3️⃣ Test science binary")
    print("4️⃣ Test logs (telemetry type)")
    print("5️⃣ Test custom file")
    print("0️⃣ Exit")

    choice = input("\n👉 Enter choice: ").strip()

    if choice == "1":
        test_compression("test_files/1.jpg")

    elif choice == "2":
        test_compression("test_files/telemetry.csv")

    elif choice == "3":
        test_compression("test_files/science_data.bin")

    elif choice == "4":
        test_compression("test_files/log.txt")

    elif choice == "5":
        path = input("📁 Enter file path: ")
        test_compression(path)

    else:
        print("👋 Exiting.")
