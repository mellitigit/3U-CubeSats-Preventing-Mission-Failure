import pandas as pd
import numpy as np
import joblib
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
from datetime import datetime

# ============================================================
# 1. Load Dataset
# ============================================================
df = pd.read_csv("generated_dataset/aggregated_passes_enriched.csv")
print(f"✅ Dataset loaded: {df.shape[0]} rows × {df.shape[1]} columns")

# ============================================================
# 2. Preprocess columns
# ============================================================
# Drop identifier column if present
if "pass_id" in df.columns:
    df = df.drop(columns=["pass_id"])

# Convert timestamps to datetime (UTC-aware)
for col in ["pass_start_utc", "pass_end_utc"]:
    if col in df.columns:
        df[col] = pd.to_datetime(df[col], errors="coerce", utc=True)

# Create numeric time features (seconds since epoch)
if "pass_start_utc" in df.columns:
    df["pass_start_ts"] = df["pass_start_utc"].astype("int64") // 10**9
if "pass_end_utc" in df.columns:
    df["pass_end_ts"] = df["pass_end_utc"].astype("int64") // 10**9

# Optional: encode modem_modcod as integer codes (safe)
if "modem_modcod" in df.columns:
    df["modem_modcod"] = df["modem_modcod"].astype("category").cat.codes

# ============================================================
# 3. Define targets and features (remove leakage)
# ============================================================
target_cols = ["can_send_all", "recommended_compression_ratio"]
leakage_cols = ["max_bytes_transferable", "historical_max_bytes", "predicted_mean_snr_db"]

exclude = set(target_cols + leakage_cols + ["timestamp", "pass_start_utc", "pass_end_utc"])
feature_cols = [c for c in df.columns if c not in exclude]

# Ensure feature columns exist and are numeric
df[feature_cols] = df[feature_cols].apply(pd.to_numeric, errors="coerce").fillna(0)

# Remove rows missing targets
df = df.dropna(subset=target_cols).reset_index(drop=True)

# ============================================================
# 4. Temporal train/test split (80/20)
# ============================================================
if "pass_start_utc" in df.columns:
    df = df.sort_values("pass_start_utc").reset_index(drop=True)
else:
    df = df.reset_index(drop=True)

split_idx = int(len(df) * 0.8)
train_df = df.iloc[:split_idx].reset_index(drop=True)
test_df = df.iloc[split_idx:].reset_index(drop=True)

X_train = train_df[feature_cols]
X_test = test_df[feature_cols]
y_train_can = train_df["can_send_all"]
y_test_can = test_df["can_send_all"]
y_train_comp = train_df["recommended_compression_ratio"]
y_test_comp = test_df["recommended_compression_ratio"]

print(f"📊 Data split: Train={len(train_df)}, Test={len(test_df)}")
print(f"📋 Number of features used: {len(feature_cols)}")

# ============================================================
# 5. Train & evaluate helper
# ============================================================
def train_and_evaluate(X_tr, y_tr, X_te, y_te, name):
    print(f"\n🚀 Training model for: {name}")
    model = XGBRegressor(
        n_estimators=300,
        learning_rate=0.07,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_lambda=2.0,
        reg_alpha=1.0,
        random_state=42,
        enable_categorical=False
    )
    model.fit(X_tr, y_tr)

    y_tr_pred = model.predict(X_tr)
    y_te_pred = model.predict(X_te)

    mse_tr = mean_squared_error(y_tr, y_tr_pred)
    mse_te = mean_squared_error(y_te, y_te_pred)
    rmse_te = np.sqrt(mse_te)               # <- safe for older sklearn
    r2_tr = r2_score(y_tr, y_tr_pred)
    r2_te = r2_score(y_te, y_te_pred)

    model_path = f"xgboost_{name}_model.pkl"
    joblib.dump(model, model_path)
    print(f"💾 Saved model: {model_path}")
    print(f"📈 {name}: Train R²={r2_tr:.4f}, Test R²={r2_te:.4f}, RMSE(Test)={rmse_te:.4f}")

    return model, (mse_tr, mse_te, r2_tr, r2_te, rmse_te)

# Train the two required models
model_can, metrics_can = train_and_evaluate(X_train, y_train_can, X_test, y_test_can, "can_send_all")
model_comp, metrics_comp = train_and_evaluate(X_train, y_train_comp, X_test, y_test_comp, "recommended_compression_ratio")

# Summary
print("\n🔹 SUMMARY")
print(f"can_send_all -> Train R²={metrics_can[2]:.4f}, Test R²={metrics_can[3]:.4f}, RMSE={metrics_can[4]:.4f}")
print(f"recommended_compression_ratio -> Train R²={metrics_comp[2]:.4f}, Test R²={metrics_comp[3]:.4f}, RMSE={metrics_comp[4]:.4f}")

# ============================================================
# 6. Date-based prediction function
# ============================================================
def predict_for_date(date_str):
    input_date = pd.to_datetime(date_str, utc=True)
    
    # reload dataset and reapply preprocessing
    df_full = pd.read_csv("generated_dataset/aggregated_passes_enriched.csv")
    df_full["pass_start_utc"] = pd.to_datetime(df_full["pass_start_utc"], errors="coerce", utc=True)
    df_full["pass_end_utc"] = pd.to_datetime(df_full["pass_end_utc"], errors="coerce", utc=True)

    # recreate numeric time features (like in training)
    df_full["pass_start_ts"] = df_full["pass_start_utc"].astype("int64") // 10**9
    df_full["pass_end_ts"] = df_full["pass_end_utc"].astype("int64") // 10**9

    if "modem_modcod" in df_full.columns:
        df_full["modem_modcod"] = df_full["modem_modcod"].astype("category").cat.codes

    # find closest pass to input date
    idx = (df_full["pass_start_utc"] - input_date).abs().idxmin()
    row = df_full.loc[idx]
    print(f"\n🔎 Closest pass: {row['pass_start_utc']} (delta={(df_full['pass_start_utc'][idx] - input_date)})")

    # rebuild features for this row
    X_sample = row[feature_cols].to_frame().T
    X_sample = X_sample.apply(pd.to_numeric, errors="coerce").fillna(0)

    # load saved models
    model_can = joblib.load("xgboost_can_send_all_model.pkl")
    model_comp = joblib.load("xgboost_recommended_compression_ratio_model.pkl")

    # reindex columns to match model feature names
    model_features = model_can.get_booster().feature_names
    X_sample = X_sample.reindex(columns=model_features, fill_value=0)

    # predict
    can_val = model_can.predict(X_sample)[0]
    can_binary = 1 if can_val >= 0.5 else 0
    print(f"📤 can_send_all (raw) = {can_val:.4f} -> binary = {can_binary}")

    if can_binary == 1:
        print("✅ Send all data (no compression needed).")
    else:
        ratio = model_comp.predict(X_sample)[0]
        print(f"⚠️ Recommended compression ratio = {ratio:.3f}")

# Interactive run
if __name__ == "__main__":
    date_in = input("\n🕒 Enter date (UTC, e.g. 2025-11-07T18:11:55Z): ").strip()
    predict_for_date(date_in)
