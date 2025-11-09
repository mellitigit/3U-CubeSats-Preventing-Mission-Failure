# 🚀 CubeSat Autonomous AI System — Full Project Documentation

---

## ✅ Table of Contents

1. [Summary](#1-summary)  
2. [Problematic](#2-problematic)  
3. [Solution Overview](#4-solution-overview)  
4. [Objective 1 — Downlink Prediction & Adaptive Compression](#objective-1-cubesat-ai-based-downlink-prediction--adaptive-compression)  
5. [Objective 2 — Power Prediction Model](#objective-2-cubesat-power-prediction-model)  
6. [Objective 3 — Battery Health Prediction (GRU)](#objective-3-cubesat-battery-health-prediction-model)  
7. [Objective 4 — AI-Based FDIR](#objective-4--ai-based-fdir-fault-detection-isolation--recovery-for-cubesats)  
8. [Objective 5 — Detumbling using Reinforcement Learning](#objective-5-detumbling-using-reinforcement-learning)  
9. [Features (Schema Electric, Workflow)](#42-features)  
10. [Impact](#43-impact)

---

# **1. Summary**

CubeSats operate in harsh space environments where communication delays, limited bandwidth, and long blackout periods make real-time ground intervention impossible. This project proposes an autonomous AI-driven system capable of detecting anomalies, managing power, stabilizing attitude, and maintaining communication reliability without human input. By combining fault detection, predictive modeling, reinforcement learning control, and adaptive onboard decision-making, the system ensures continuous, reliable CubeSat operation and mitigates mission-critical failures.

---

# **2. Problematic**  
*(Hejer — updated 09/11/2025 with Eya’s contribution)*

CubeSats operate in highly constrained and unpredictable space environments where communication delays, limited bandwidth, and blackouts make ground intervention ineffective. Minor anomalies such as thermal imbalances, battery degradation, or attitude instabilities can rapidly escalate into mission-threatening failures. Traditional FDIR systems struggle to react promptly and often misinterpret subsystem faults as sensor errors.

Unpredictable variations in power generation and consumption create additional risks, as poor power forecasting can lead to payload shutdowns or brownouts. Limited bandwidth further complicates data transmission, requiring intelligent compression systems. Finally, tumbling after deployment or external disturbances affects communication stability and energy harvesting.

These challenges highlight the need for **advanced onboard autonomy** for real-time fault detection, predictive resource management, efficient communication, and attitude stabilization — without relying on ground stations.

---

# **4. Solution Overview**

This CubeSat system integrates **five AI-based objectives**:

1. **Downlink Prediction & Adaptive Compression**  
2. **Power Prediction & Energy Scheduling**  
3. **Battery Health Prediction (Thermal & Electrical)**  
4. **FDIR — Fault Detection, Isolation & Recovery**  
5. **Detumbling & Attitude Stabilization using Reinforcement Learning**

Each subsystem is independent yet complementary to enable a fully autonomous CubeSat mission.

---

# ✅ **Objective 1: CubeSat AI-Based Downlink Prediction & Adaptive Compression**

This AI system predicts **available downlink capacity** for each pass and computes the **compression ratio** required to send the full payload under real constraints.

---

## ✅ Objective

- Predict maximum transmittable bytes per pass  
- Predict whether full payload can be sent  
- Compute optimal compression ratio  
- Enable fully autonomous onboard transmission  
- Maintain reliability under bad SNR, weather, geometry  

---

## ✅ System Overview

### **Dataset Generation (Simulation)**  
Synthetic datasets model:

- Orbital pass geometry  
- Free-space path loss  
- Rain attenuation  
- Antenna mispointing  
- SNR fluctuations  
- Payload sizes  
- Environmental conditions  

### **Generated Files**

| File | Description |
|------|-------------|
| aggregated_passes.csv | Main dataset (50k passes). |
| timeseries_passes_profiles.csv | Time-series SNR/range/elevation. |
| timeseries_passes_meta.csv | Metadata for time-series passes. |
| ts_features.csv | Extracted SNR statistics. |
| aggregated_passes_enriched.csv | Final enriched dataset. |

---

## ✅ XGBoost Model

### Inputs
- Pass geometry  
- Link-budget parameters  
- Antenna gains  
- Battery & PA temperature  
- SNR history  
- Time-series statistical features  

### Outputs
- `can_send_all`  
- `recommended_compression_ratio`

---

## ✅ Onboard Compression Logic

### ✅ If data fits → **Transmit all**  
### ✅ If not → **Compress based on recommended protocol**

| Data Type | Extensions | Protocol |
|-----------|------------|----------|
| Images | .jpg .png .tif | jpeg / jpeg2000 |
| Telemetry | .csv .txt | lz4 |
| Science/Binary | .bin .dat | zstd / CCSDS121 |
| Video | — | h264 |

---

## ✅ How to Run

### Train model
python train_XGBoost.py


### Run full decision pipeline
python send_with_compressing.py


---

## ✅ Repository Structure

/data_generation/
data_generation.py
extract_ts_features.py
merge_ts_into_aggregated.py

/models/
train_XGBoost.py
tinyml_conversion.py
send_with_compressing.py

/datasets/
aggregated_passes.csv
timeseries_passes_profiles.csv
timeseries_passes_meta.csv
ts_features.csv
aggregated_passes_enriched.csv



---

# ✅ **Objective 2: CubeSat Power Prediction Model**

Predicts **T+12 min power availability** to secure payload operations and energy safety.

---

## ✅ Objective 

Predict net available power (W) at future time to:

- Prevent brownouts  
- Optimize payload scheduling  
- Maintain safe energy margins  

---

## ✅ Technical Stack

Python, XGBoost, Scikit-learn, Pandas, NumPy, Joblib, Matplotlib.

---

## ✅ Workflow Overview

### **1. Data Simulation**
`generate_enhanced_data.py`
- Sequential SoC behavior  
- Rolling mean/std  
- Interaction features  

Output: `sim_power_data_enhanced.csv`

### **2. Training**
`train_optimized_model.py`
- RandomizedSearchCV  
- Trains final model  
- Outputs:
  - `xgboost_power_predictor_optimized.pkl`
  - `prediction_comparison.csv`

### **3. Inference**
`test_single_prediction.py`
- Predicts real scenario for validation  

---

## ✅ Repository Structure
/generated_data/
sim_power_data_enhanced.csv
prediction_comparison.csv

generate_enhanced_data.py
train_optimized_model.py
test_single_prediction.py
xgboost_power_predictor_optimized.pkl



---

# ✅ **Objective 3: CubeSat Battery Health Prediction Model**

---

## ✅ Objective

Predict next-step battery:
- Temperature  
- Voltage  
- Current  

Using last 10 time steps of telemetry.

---

## ✅ Model Overview

- GRU  
- 7 Input features  
- 3 Output targets  
- 48 hidden units  
- 2 GRU layers  
- Dropout + weight decay  
- MSE loss, Adam optimizer  
- ~23k parameters  

---

## ✅ Performance

| Metric | Temperature | Voltage | Current |
|--------|-------------|---------|---------|
| RMSE | 0.73°C | 0.047 V | 0.054 A |
| R² | High | High | High |

---

## ✅ Repository Structure

/prediction temp and volt/
train_gru_model.ipynb
generate_data_prediction.py
synthetic_battery_prediction_data.csv
best_gru_model.pth
battery_gru_model.pth
scaler_X_gru.pkl
scaler_y_gru.pkl
model_params_gru.pkl
requirements.txt



---

# ✅ **Objective 4: AI-Based FDIR (Fault Detection, Isolation & Recovery)**

---

## ✅ Objective

Enable CubeSats to autonomously:

1. Detect anomalies  
2. Identify faulty subsystem  
3. Trigger appropriate recovery actions  

---

## ✅ Models

### 1️⃣ Fault Detection (Binary)
- LightGBM  
- Accuracy: **95%**

### 2️⃣ Fault Isolation (Multiclass)
- LightGBM  
- Accuracy: **95.75%**

---

## ✅ Dataset & Sensors

Simulated sensor data includes:
- Gyroscope, Accelerometer, Magnetometer  
- Battery voltage/current  
- Solar panel sensors  
- Internal temperatures  
- Light sensor  
- ADC  
- BMP pressure  

Fault classes include sensor and subsystem deviations.

Sliding windows of **10 samples** capture dynamic behavior.

---

## ✅ Repository Structure

/fdir/
  /dataset/
      sensor_data.csv
      sensor_windows.npy
      labels.npy

  /models/
      fault_detection_model.pkl
      fault_isolation_model.pkl



---

# ✅ **Objective 5: Detumbling using Reinforcement Learning**

This module stabilizes CubeSat attitude by combining:

- ✅ A supervised **tumbling detector model**  
- ✅ An **RL agent (Soft Actor-Critic)** controlling torques  
- ✅ A custom **Gym environment** modeling CubeSat rotational dynamics  

The goal is to reduce angular speed using minimal energy.

---

## ✅ How to Run

### Install requirements
pip install -r requirements.txt



### Train disturbance detector
Run `cubesat.ipynb`  
→ saves `model_supervised.keras`

### Train RL detumbling agent
Run `rl-cubesat.ipynb`  
→ saves `sac_cubesat_policy.zip`

---

## ✅ Repository Structure

/cubesat-rl/
cubesat.ipynb
rl-cubesat.ipynb
requirements.txt
model_supervised.keras
best_detector_model.keras
sac_cubesat_policy.zip
/checkpoints/
/logs/
training_curves.png
evaluation_results.png



---

# **4.2 Features**
*(Schema electric, workflow diagram, workflow description — to be added)*

---

# **4.3 Impact**

The system enhances CubeSat autonomy, reliability, and mission longevity.  
Power and battery prediction prevent energy failures.  
The FDIR system minimizes mission downtime.  
The downlink compression module maximizes data return under real bandwidth limits.  
Reinforcement learning detumbling ensures stabilization after deployment.  

Together, these advancements create a fully autonomous CubeSat capable of surviving long-duration missions without dependence on ground control.

---

# ✅ END OF README ✅


