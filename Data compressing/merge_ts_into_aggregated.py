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
