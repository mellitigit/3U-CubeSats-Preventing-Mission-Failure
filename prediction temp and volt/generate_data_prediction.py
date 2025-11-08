import numpy as np
import pandas as pd

# -----------------------
# Parameters
# -----------------------
n_samples = 2000       # number of time steps
dt = 1                 # seconds per step
temp_base = 25         # initial temperature (°C)
volt_base = 4.2        # initial voltage (V)
curr_base = 0.5        # initial current (A)

# -----------------------
# Initialize arrays
# -----------------------
temperature = [temp_base]
voltage = [volt_base]
current = [curr_base]

# -----------------------
# Generate synthetic time-series (realistic ranges)
# -----------------------
for i in range(1, n_samples):
    # Temperature: slow oscillation + noise
    temp_trend = 25 + 10 * np.sin(i / 200)  # periodic variation
    temp_noise = np.random.normal(0, 0.2)
    temperature.append(np.clip(temp_trend + temp_noise, 20, 60))  # clamp range

    # Voltage: gradual discharge with random noise
    volt_change = -0.0005 + np.random.normal(0, 0.0005)
    voltage.append(np.clip(voltage[-1] + volt_change, 3.0, 4.2))

    # Current: small fluctuations within operational limits
    curr_change = np.random.normal(0, 0.02)
    current.append(np.clip(current[-1] + curr_change, 0.1, 2.0))

# -----------------------
# Create DataFrame
# -----------------------
df = pd.DataFrame({
    'timestamp': np.arange(n_samples) * dt,
    'temperature': temperature,
    'voltage': voltage,
    'current': current
})

# -----------------------
# Derived features
# -----------------------
df['power'] = df['voltage'] * df['current']
df['delta_temp'] = df['temperature'].diff().fillna(0)
df['delta_voltage'] = df['voltage'].diff().fillna(0)
df['delta_current'] = df['current'].diff().fillna(0)

# -----------------------
# Next-step targets (y)
# -----------------------
df['temperature_next'] = df['temperature'].shift(-1)
df['voltage_next'] = df['voltage'].shift(-1)
df['current_next'] = df['current'].shift(-1)

# Remove last row since it has no next-step target
df = df[:-1]

# -----------------------
# Save to CSV
# -----------------------
df.to_csv('synthetic_battery_prediction_data.csv', index=False)
print("✅ Realistic data generated successfully! Here's a preview:")
print(df.head())
