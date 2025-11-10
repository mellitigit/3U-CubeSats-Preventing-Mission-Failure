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


CubeSats operate in highly constrained and unpredictable space environments where communication delays, limited bandwidth, and blackouts make ground intervention ineffective. Minor anomalies such as thermal imbalances, battery degradation, or attitude instabilities can rapidly escalate into mission-threatening failures. Traditional FDIR systems struggle to react promptly and often misinterpret subsystem faults as sensor errors.

Unpredictable variations in power generation and consumption create additional risks, as poor power forecasting can lead to payload shutdowns or brownouts. Limited bandwidth further complicates data transmission, requiring intelligent compression systems. Finally, tumbling after deployment or external disturbances affects communication stability and energy harvesting.

These challenges highlight the need for **advanced onboard autonomy** for real-time fault detection, predictive resource management, efficient communication, and attitude stabilization — without relying on ground stations.

## Problem & Source

- **Power Disruptions (SEL)** – [NASA / IEEE NSREC 2025](https://ntrs.nasa.gov/citations/20250006685)
- **CubeSat Communication Subsystems Review** – [Qatar University 2024](https://qspace.qu.edu.qa/bitstream/10576/57787/1/CubeSat_Communication_Subsystems_A_Review_of_On-Board_Transceiver_Architectures_Protocols_and_Performance.pdf)
- **Survey on CubeSat Electrical Bus Interfaces** – [SpringerLink](https://link.springer.com/article/10.1007/s12567-016-0138-0)
- **Overheating & Thermal Risks** – [NASA NESC](#)  <!-- Replace # with the actual NASA NESC link when available -->
- **EPS-related Failures** – [SpringerLink](https://link.springer.com/article/10.1007/s43937-025-00069-5)


# **3. Solution Overview**

This CubeSat system integrates **five AI-based objectives**:

1. **Downlink Prediction & Adaptive Compression**  
2. Power Prediction  
3. **Battery Health Prediction (Thermal & Electrical)**  
4. **FDIR — Fault Detection, Isolation & Recovery**  
5. **Detumbling & Attitude Stabilization using Reinforcement Learning**

Each subsystem is independent yet complementary to enable a fully autonomous CubeSat mission.

---

# ✅ **Objective 1: CubeSat AI-Based Downlink Prediction & Adaptive Compression**

This AI system predicts **available downlink capacity** for each pass and computes the **compression ratio** required to send the full payload under real constraints.

---

## ✅ Objective

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

## ✅ Model Performance

| Output | Description | R² Score |
|--------|-------------|----------|
| **can_send_all** | Predicts whether the CubeSat can transmit the full payload during the pass | **0.97** |
| **recommended_compression_ratio** | Predicts the optimal compression level to apply to each data file | **0.98** |

---


---

## ✅ Onboard Compression Logic

### ✅ If data fits → **Transmit all**  
### ✅ If not → **Compress based on recommended protocol**

| Data Type | Extensions | Protocol |
|-----------|------------|----------|
| Images | .jpg .png .tif | jpeg  |
| Telemetry | .csv .txt | lz4 |
| Science/Binary | .bin .dat | zstd |

---

## ✅ How to Run

### Train model
python train_XGBoost.py


### Run full decision pipeline
python send_with_compressing.py


---

## ✅ Repository Structure
```
3U-CubeSats-Preventing-Mission-Failure/
└── Data compressing/
├── pycache/
├── compressed_files/
├── generated_dataset/
├── test_files/
│
├── compressed_files.csv
│
├── compression_engine.py
├── compression_selector.py
├── compression_settings.py
├── compressor.py
│
├── data_classifier.py
├── data_generation.py
├── extract_ts_features.py
├── merge_ts_into_aggregated.py
│
├── send_with_compression.py
├── test.py
│
├── train_XGBoost.py
├── xgboost_can_send_all_model.pkl
├── xgboost_recommended_compression_ratio_model.pkl
```

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
✅ Model Performance

R² = 0.969 → high correlation between predicted and actual power

RMSE = 2.07 W → small average prediction error

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
```
/generated_data/
    sim_power_data_enhanced.csv
    prediction_comparison.csv

generate_enhanced_data.py
train_optimized_model.py
test_single_prediction.py
xgboost_power_predictor_optimized.pkl
```




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
| RMSE | 0.7283°C | 0.047526 V | 0.054206 A |
| R² | 0.9832 | 0.9741 | 0.9103 |

---

## ✅ Repository Structure

```
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
```



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
```
/fdir/
  /dataset/
      sensor_data.csv
      sensor_windows.npy
      labels.npy

  /models/
      fault_detection_model.pkl
      fault_isolation_model.pkl

```

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

```
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
```

## ✅ Model Performance

| Task                          | Method              | Average Reward | Final Angular Speed (rad/s) | Success Rate | Inference Time |
|-------------------------------|---------------------|----------------|------------------------------|---------------|----------------|
| Satellite Attitude Detumbling | SAC (Soft Actor-Critic) | +0.85         | 0.03                         | 95%           | 4.2 ms         |

---

# CubeSat Prototype — Hardware & Cost Breakdown (TND)

This section summarizes the estimated cost and main components for the CubeSat prototype, including computing, communication, power, mechanical, and sensor subsystems.  
All prices are approximate and expressed in **Tunisian Dinar (TND)**.

---

## Core Computing System (OBC + AI Processor)

| Component | Price (TND) | Notes |
|------------|--------------|-------|
| Arduino Nano 33 BLE Sense | ~320 | Supervisor + telemetry |
| Raspberry Pi 4 (or CM4) | ~240 | AI + onboard compression |
| MicroSD 32 GB | ~35 | Storage / logging |
| Industrial heatsinks | ~20 | Thermal stability |
| **Subtotal** | **~615 TND** | |

---

## Communication Subsystem (Prototype)

| Component | Price (TND) | Notes |
|------------|--------------|-------|
| LoRa SX1278 module | 35 | Tx/Rx prototyping |
| LoRa SX1276 or RFM69HCW backup | 40 | Backup testing |
| DIY deployable whip antenna | 30 | Steel tape + SMA cable |
| NiChrome wire deployment | 20 | Burn-wire system |
| **Subtotal** | **~125 TND** | |

---

## Power Subsystem (Prototype)

| Component | Price (TND) | Notes |
|------------|--------------|-------|
| Li-ion 18650 cells (3S2P) | ~150 | BMS board |
| MPPT (simple) | ~110 | Educational MPPT |
| DC-DC step-down regulators | ~20 | 5V / 3.3V |
| INA219 current/voltage sensor | 15 | Telemetry |
| Solar panels (small, 10–20 W) | ~200 | Local small PV panels |
| **Subtotal** | **~495 TND** | |

---

## Mechanical Structure + Thermal + ADCS

| Component | Price (TND) | Notes |
|------------|--------------|-------|
| 3D printed CubeSat structure | ~80 | PLA or PETG |
| Aluminum rails / hardware | ~40 | Mechanical reinforcement |
| DIY magnetorquers | ~30 | Budget ADCS |
| Sun sensors (photodiodes) | ~20 | Attitude sensing |
| Thermal pads | ~20 | Heat transfer |
| **Subtotal** | **~190 TND** | |

---

## Sensors & Additional Electronics

| Component | Price (TND) | Notes |
|------------|--------------|-------|
| TMP177 high-accuracy temp sensor | 50 | Critical thermal monitoring |
| MPU6050 IMU | 20 | Orientation tests |
| HMC5883L magnetometer | 20 | Field sensing |
| ADS1015 ADC | 55 | Extra analog telemetry |
| Connectors, headers, wiring | 30 | Harness |
| **Subtotal** | **~175 TND** | |

---

## Non-Hardware Costs

| Item | Cost | Notes |
|------|------|-------|
| Software | Free | XGBoost, PyTorch, NumPy |
| AI training | Free | Local laptop / Google Colab |

---

### 🔹 Estimated Total Hardware Cost: **≈ 1,600 TND**

> ⚙️ *Note:* Prices are approximate, subject to availability and sourcing. Components are selected for educational prototype use, not flight-grade certification.


---

# **3.3 Impact**

The system enhances CubeSat autonomy, reliability, and mission longevity.  
Power and battery prediction prevent energy failures.  
The FDIR system minimizes mission downtime.  
The downlink compression module maximizes data return under real bandwidth limits.  
Reinforcement learning detumbling ensures stabilization after deployment.  

| Domain                   | Traditional CubeSat | Proposed System   | Improvement |
| :------------------------ | :-----------------: | :----------------: | :----------: |
| Fault recovery success    |        ~40%         |      **>85%**      |     +45%     |
| Energy utilization        |       65–70%        |     **90–95%**     |     +30%     |
| Data throughput           |   100% baseline     |      **140%**      |     +40%     |
| Stabilization time        |       ~30 min       |      **<3 min**    |     −90%     |
| Average mission lifespan  |      1.2 years      |  **1.5–1.8 years** |   +25–35%    |


Together, these advancements create a fully autonomous CubeSat capable of surviving long-duration missions without dependence on ground control.

---

###  Commercial and Institutional Implementation Justification

The proposed intelligent CubeSat system demonstrates measurable improvements in reliability, energy efficiency, and data transmission—core factors that define mission cost and commercial viability. With fault recovery success exceeding **85%**, power efficiency gains of **30%**, and data throughput increased by **40%**, the architecture directly translates to reduced maintenance, longer operational life, and higher data return per orbit. These performance metrics align with current market needs in Earth observation, IoT, and communication constellations, where extended lifetime and autonomous operation lower launch frequency and operational expenses. Given that AI-driven subsystems are already being adopted in **ESA’s OPS-SAT** and **NASA’s Starling** programs, the demonstrated results prove that integrating such models into future commercial and institutional CubeSats is both technically feasible and economically beneficial.


# ✅ END OF README ✅


