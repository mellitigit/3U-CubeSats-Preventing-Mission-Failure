FDIR – Fault Detection, Isolation & Recovery using AI

Intelligent Fault Management for CubeSat Sensor Systems

📌 Overview

This project implements an AI-based FDIR (Fault Detection, Isolation & Recovery) system for CubeSats.
Unlike traditional methods that rely solely on thresholds or PCA, our solution leverages two AI models:

✅ Model 1 – Fault Detection
Automatically identifies whether anomalies exist in sensor data.

✅ Model 2 – Fault Isolation
Determines which sensor or subsystem is faulty (Gyroscope, Accelerometer, Battery, Solar Panels, etc.)

Outcome: Higher precision, faster execution, and improved satellite autonomy in orbit.
⚙️ Sensors Used

Based on a standard CubeSat architecture:

🔸 Gyroscope (Gx, Gy, Gz)
🔸 Accelerometer (Ax, Ay, Az)
🔸 Magnetometer (MagX, MagY, MagZ)
🔸 Internal & solar panel temperatures
🔸 Battery & Solar voltages and currents
🔸 BMP atmospheric pressure sensor
🔸 Light sensor
🔸 Internal ADC

🧪 Dataset

Artificially generated based on real sensor ranges from datasheets.

Simulated multiple fault types:
GyroFault, AccelFault, MagFault, TempFault,
BattFault, SolarFault, ADC_Fault, BMP_Fault,
LightFault, Normal
Sliding windows of 10 samples (10 Hz → 1 second) to capture dynamic sensor behavior.

AI Methods:
Fault Detection: LightGBM binary (0 = normal, 1 = anomaly)
Accuracy: 0.95

Fault Isolation: LightGBM multiclass
Accuracy: 0.9575

Sliding windows of 10 samples (~1 s) capture dynamic system behavior.
✅ Technical Contributions

Realistic CubeSat sensor data generation
Training ML models on sliding windows
Automated Fault Detection & Isolation
Ready for onboard CubeSat deployment 🛰️
