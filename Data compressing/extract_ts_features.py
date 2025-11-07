import pandas as pd
import numpy as np

# --------------------------
# Load time-series dataset 3
# --------------------------
df = pd.read_csv("generated_dataset/timeseries_passes_profiles.csv")

# Group by pass_id
groups = df.groupby("pass_id")

# Output list
rows = []

for pid, g in groups:
    g = g.sort_values("t_s")

    snr = g["snr_db"].values

    row = {
        "pass_id": pid,
        "snr_mean": np.mean(snr),
        "snr_min": np.min(snr),
        "snr_max": np.max(snr),
        "snr_std": np.std(snr),
        "snr_p10": np.percentile(snr, 10),
        "snr_p25": np.percentile(snr, 25),
        "snr_p50": np.percentile(snr, 50),
        "snr_p75": np.percentile(snr, 75),
        "snr_p90": np.percentile(snr, 90),

        # How many times SNR < 0 dB
        "fade_count": np.sum(snr < 0),

        # Outage time = SNR < -2 dB
        "outage_time_s": np.sum(snr < -2) * (g["t_s"].iloc[1] - g["t_s"].iloc[0]),

        # Average slope (derivative)
        "snr_slope": (snr[-1] - snr[0]) / (g["t_s"].iloc[-1] - g["t_s"].iloc[0] + 1e-6)
    }

    rows.append(row)

# Create dataframe
df_out = pd.DataFrame(rows)

# Save features
df_out.to_csv("generated_dataset/ts_features.csv", index=False)

print("✅ Time-series features extracted → ts_features.csv")


import pandas as pd

# Load aggregated dataset
df_agg = pd.read_csv("generated_dataset/aggregated_passes.csv")

# Load time-series statistical features
df_ts = pd.read_csv("generated_dataset/ts_features.csv")

# Merge on pass_id
df_merged = df_agg.merge(df_ts, on="pass_id", how="left")

# Fill missing values for passes that were not included in time-series
for col in df_ts.columns:
    if col != "pass_id":
        df_merged[col] = df_merged[col].fillna(df_merged[col].mean())

# Save new enriched dataset
df_merged.to_csv("generated_dataset/aggregated_passes_enriched.csv", index=False)

print("✅ Enhanced dataset created: aggregated_passes_enriched.csv")
print("✅ You can now use this file for higher-accuracy ML training!")
