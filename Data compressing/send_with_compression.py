import pandas as pd
import joblib
import os
from datetime import datetime
from data_classifier import detect_data_type
from compression_selector import select_compression_protocol
from compression_settings import *
from compression_engine import *

# ================================
# Load ML models
# ================================
print("📥 Loading ML models...")
model_can = joblib.load("xgboost_can_send_all_model.pkl")
model_comp = joblib.load("xgboost_recommended_compression_ratio_model.pkl")

# ================================
# Load dataset
# ================================
df = pd.read_csv("generated_dataset/aggregated_passes_enriched.csv")
df["pass_start_utc"] = pd.to_datetime(df["pass_start_utc"], utc=True)
df["pass_end_utc"] = pd.to_datetime(df["pass_end_utc"], utc=True)

# Recreate numeric time features
df["pass_start_ts"] = df["pass_start_utc"].astype("int64") // 10**9
df["pass_end_ts"] = df["pass_end_utc"].astype("int64") // 10**9

# ================================
# Prepare features
# ================================
target_cols = ["can_send_all", "recommended_compression_ratio"]
leakage_cols = ["max_bytes_transferable", "historical_max_bytes", "predicted_mean_snr_db"]
exclude = set(target_cols + leakage_cols + ["timestamp", "pass_start_utc", "pass_end_utc"])

feature_cols = [c for c in df.columns if c not in exclude]


# ================================
# MAIN FUNCTION
# ================================
def send_file_with_ml(input_file, date_str):
    print(f"\n✅ Processing file: {input_file}")

    # ------------------------------------
    # 1. Detect data type
    # ------------------------------------
    data_type = detect_data_type(input_file)
    print(f"📄 Data type detected: {data_type}")

    # ------------------------------------
    # 2. Select compression protocol
    # ------------------------------------
    protocol = select_compression_protocol(data_type)
    print(f"🗜️ Compression protocol selected: {protocol}")

    # ------------------------------------
    # 3. Find closest pass
    # ------------------------------------
    input_date = pd.to_datetime(date_str, utc=True)
    idx = (df["pass_start_utc"] - input_date).abs().idxmin()
    row = df.loc[idx]
    print(f"🛰️ Closest pass: {row['pass_start_utc']}")

    # Build feature vector
    X = row[feature_cols].to_frame().T
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0)

    # Align with model input features
    model_features = model_can.get_booster().feature_names
    X = X.reindex(columns=model_features, fill_value=0)

    # ------------------------------------
    # 4. Predict if full data can be sent
    # ------------------------------------
    can_val = model_can.predict(X)[0]
    can_binary = 1 if can_val >= 0.5 else 0

    print(f"📤 Sendability prediction: {can_val:.3f} → Binary: {can_binary}")

    # If full send is possible → no compression
    if can_binary == 1:
        print("✅ Full transmission possible — no compression needed.")
        return input_file

    # ------------------------------------
    # 5. Predict compression ratio
    # ------------------------------------
    ratio = model_comp.predict(X)[0]
    ratio = max(0.05, min(ratio, 1.0))  # clamp for safety

    print(f"⚠️ Required compression ratio: {ratio:.3f}")

    # ------------------------------------
    # 6. Convert ratio → compression settings
    # ------------------------------------
    if protocol == "jpeg":
        quality = jpeg_quality_from_ratio(ratio)
        print(f"🖼️ JPEG quality set to {quality}")
        out = input_file + ".jpg_compressed.jpg"
        compress_image_jpeg(input_file, out, quality)
    
    elif protocol == "zstd":
        level = zstd_level_from_ratio(ratio)
        print(f"🔬 Zstd level set to {level}")
        out = input_file + ".zst"
        compress_zstd(input_file, out, level)

    elif protocol == "lz4":
        level = lz4_level_from_ratio(ratio)
        print(f"📡 LZ4 level set to {level}")
        out = input_file + ".lz4"
        compress_lz4(input_file, out, level)

    elif protocol == "h264":
        bitrate = str(int(ratio * 2000)) + "k"
        print(f"🎥 Video bitrate: {bitrate}")
        out = input_file + "_compressed.mp4"
        compress_h264(input_file, out, bitrate)

    else:
        print("⚠️ No compression applied.")
        out = input_file

    # ------------------------------------
    # 7. Report final size
    # ------------------------------------
    original_size = os.path.getsize(input_file) / (1024*1024)
    new_size = os.path.getsize(out) / (1024*1024)

    print(f"\n📦 Original size: {original_size:.2f} MB")
    print(f"📦 Compressed size: {new_size:.2f} MB")

    # ------------------------------------
    # 8. Return compressed file path
    # ------------------------------------
    print(f"✅ File ready for transmission: {out}")
    return out



# ================================
# EXECUTION
# ================================
if __name__ == "__main__":
    file_path = input("📁 Enter file path to send: ").strip()
    pass_time = input("🕒 Enter UTC date for communication window: ").strip()
    send_file_with_ml(file_path, pass_time)
