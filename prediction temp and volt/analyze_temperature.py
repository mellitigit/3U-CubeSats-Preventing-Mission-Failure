import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Read the dataset
df = pd.read_csv('synthetic_battery_prediction_data.csv')

# Extract temperature column
temperature = df['temperature']

# Calculate statistics
print("=" * 60)
print("TEMPERATURE FEATURE ANALYSIS")
print("=" * 60)
print(f"\nTotal number of data points: {len(temperature)}")
print(f"\n--- Basic Statistics ---")
print(f"Minimum temperature: {temperature.min():.4f}°C")
print(f"Maximum temperature: {temperature.max():.4f}°C")
print(f"Range: {temperature.max() - temperature.min():.4f}°C")
print(f"Mean: {temperature.mean():.4f}°C")
print(f"Median: {temperature.median():.4f}°C")
print(f"Standard deviation: {temperature.std():.4f}°C")
print(f"25th percentile (Q1): {temperature.quantile(0.25):.4f}°C")
print(f"75th percentile (Q3): {temperature.quantile(0.75):.4f}°C")
print(f"IQR: {temperature.quantile(0.75) - temperature.quantile(0.25):.4f}°C")

# Show first and last few values
print(f"\n--- Sample Values ---")
print(f"First 10 values:")
print(temperature.head(10).values)
print(f"\nLast 10 values:")
print(temperature.tail(10).values)

# Create visualization
fig, axes = plt.subplots(2, 2, figsize=(15, 12))

# 1. Histogram
axes[0, 0].hist(temperature, bins=50, edgecolor='black', alpha=0.7, color='skyblue')
axes[0, 0].axvline(temperature.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {temperature.mean():.2f}°C')
axes[0, 0].axvline(temperature.median(), color='green', linestyle='--', linewidth=2, label=f'Median: {temperature.median():.2f}°C')
axes[0, 0].set_xlabel('Temperature (°C)', fontsize=12)
axes[0, 0].set_ylabel('Frequency', fontsize=12)
axes[0, 0].set_title('Temperature Distribution (Histogram)', fontsize=14, fontweight='bold')
axes[0, 0].legend()
axes[0, 0].grid(True, alpha=0.3)

# 2. Box plot
axes[0, 1].boxplot(temperature, vert=True, patch_artist=True,
                   boxprops=dict(facecolor='lightblue', alpha=0.7))
axes[0, 1].set_ylabel('Temperature (°C)', fontsize=12)
axes[0, 1].set_title('Temperature Box Plot', fontsize=14, fontweight='bold')
axes[0, 1].grid(True, alpha=0.3, axis='y')

# 3. Time series plot
axes[1, 0].plot(temperature, alpha=0.7, color='coral', linewidth=0.8)
axes[1, 0].axhline(temperature.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {temperature.mean():.2f}°C')
axes[1, 0].set_xlabel('Time Step', fontsize=12)
axes[1, 0].set_ylabel('Temperature (°C)', fontsize=12)
axes[1, 0].set_title('Temperature Over Time', fontsize=14, fontweight='bold')
axes[1, 0].legend()
axes[1, 0].grid(True, alpha=0.3)

# 4. Density plot (KDE)
temperature.plot.density(ax=axes[1, 1], color='purple', linewidth=2)
axes[1, 1].axvline(temperature.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {temperature.mean():.2f}°C')
axes[1, 1].set_xlabel('Temperature (°C)', fontsize=12)
axes[1, 1].set_ylabel('Density', fontsize=12)
axes[1, 1].set_title('Temperature Probability Density', fontsize=14, fontweight='bold')
axes[1, 1].legend()
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('temperature_analysis.png', dpi=300, bbox_inches='tight')
print(f"\n--- Visualization saved as 'temperature_analysis.png' ---")
plt.show()

