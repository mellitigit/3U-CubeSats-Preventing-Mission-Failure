# 🚀 CubeSat Autonomous AI System — Full Project Documentation

---

## ✅ Table of Contents

1. [Repository Structure](#repository-structure)
2. [Summary](#1-summary)  
3. [Problematic](#2-problematic)  
4. [Solution Overview](#4-solution-overview)  
5. [Objective 1 — Downlink Prediction & Adaptive Compression](#objective-1-cubesat-ai-based-downlink-prediction--adaptive-compression)  
6. [Objective 2 — Power Prediction Model](#objective-2-cubesat-power-prediction-model)  
7. [Objective 3 — Battery Health Prediction (GRU)](#objective-3-cubesat-battery-health-prediction-model)  
8. [Objective 4 — AI-Based FDIR](#objective-4--ai-based-fdir-fault-detection-isolation--recovery-for-cubesats)  
9. [Objective 5 — Detumbling using Reinforcement Learning](#objective-5-detumbling-using-reinforcement-learning)  
10. [Features (Schema Electric, Workflow)](#42-features)  
11. [Impact](#43-impact)

---

# **0. Repository Structure & Organization**

## Complete Directory Layout

```
3U-CubeSats-Preventing-Mission-Failure/          # Root repository
│
├── README.md                                      # Main project documentation
├── .git/                                          # Git version control
├── .gitignore                                     # Git ignore rules
│
├── 📁 battery health and thermal prediction for mission failure prevention/
│   ├── train_gru_model.ipynb                      # GRU model training notebook
│   ├── generate_data_prediction.py                # Synthetic data generator for battery
│   ├── synthetic_battery_prediction_data.csv      # Generated training dataset (~12k rows)
│   ├── best_gru_model.pth                         # Trained GRU model (best weights)
│   ├── battery_gru_model.pth                      # Backup GRU model weights
│   ├── scaler_X_gru.pkl                           # Input feature scaler (serialized)
│   ├── scaler_y_gru.pkl                           # Output target scaler (serialized)
│   ├── model_params_gru.pkl                       # Model architecture parameters
│   ├── requirements.txt                           # Python dependencies
│   ├── README.md                                  # Objective 3 documentation
│   └── venv/                                      # Python virtual environment
│
├── 📁 CubeSat/                                    # Reinforcement Learning Module
│   ├── cubesat.ipynb                              # Supervised tumbling detector training
│   ├── rl-cubesat.ipynb                           # RL agent (SAC) training for detumbling
│   ├── model_supervised.keras                     # Trained tumbling detector model
│   ├── README.en.md                               # Documentation in English
│   ├── requirements.txt                           # Python dependencies
│   ├── sac_cubesat_policy.zip                     # Trained SAC policy model
│   └── [checkpoints/, logs/ folders expected]     # Training artifacts (optional)
│
├── 📁 Data compressing/                           # Downlink & Adaptive Compression
│   ├── 🔧 Core Scripts
│   │   ├── train_XGBoost.py                       # XGBoost model training for compression
│   │   ├── send_with_compression.py               # Main inference pipeline
│   │   ├── compression_engine.py                  # Compression algorithm implementations
│   │   ├── compression_selector.py                # Compression protocol selector logic
│   │   ├── compression_settings.py                # Configuration & protocol settings
│   │   ├── compressor.py                          # File compression wrapper
│   │   ├── data_classifier.py                     # Data type classifier (image/text/binary)
│   │   ├── data_generation.py                     # Synthetic pass data generator
│   │   ├── extract_ts_features.py                 # Time-series feature extraction
│   │   ├── merge_ts_into_aggregated.py            # Dataset aggregation & merging
│   │   └── test.py                                # Unit tests
│   │
│   ├── 📊 Models & Outputs
│   │   ├── xgboost_can_send_all_model.pkl         # Model: Payload transmission feasibility
│   │   ├── xgboost_recommended_compression_ratio_model.pkl  # Model: Optimal compression ratio
│   │   └── compressed_files.csv                   # Compression results log
│   │
│   ├── 📁 generated_dataset/                      # Simulated orbital pass data
│   │   ├── aggregated_passes.csv                  # Main dataset (50k passes)
│   │   ├── aggregated_passes_enriched.csv         # Enriched features for modeling
│   │   ├── timeseries_passes_profiles.csv         # SNR/range/elevation time-series
│   │   ├── timeseries_passes_meta.csv             # Metadata for time-series passes
│   │   └── ts_features.csv                        # Extracted statistical features
│   │
│   └── 📁 test_files/                             # Test data for compression validation
│       ├── 1.jpg, 22.png                          # Test images (JPEG/PNG)
│       ├── telemetry.csv                          # Sample telemetry data
│       ├── umath-validation-set-log10.csv         # Test CSV dataset
│       ├── IT.1-10.cbow1...txt                    # NLP/embedding test file
│       ├── test_data.csv                          # Generic test CSV
│       ├── log.txt                                # Test text log
│       ├── test_binary.bin, science_data.bin      # Binary test files
│       ├── image_noeoi.lzw.bin                    # LZW-compressed image
│       ├── *.lz4, *.zst                           # Compressed versions (LZ4, Zstandard)
│       └── *.jpg_compressed.jpg                   # Compression artifacts
│
├── 📁 FDIR_VF/                                    # Fault Detection, Isolation & Recovery
│   ├── 📁 anomaly_detection/                      # Binary fault detection
│   │   ├── binary_anomaly_FDIR_dataset_balanced (1).csv  # Training dataset
│   │   └── lgb_anomaly_model.pkl                  # LightGBM anomaly detector (95% accuracy)
│   │
│   └── 📁 anomaly_classfication/                  # Multi-class fault isolation
│       ├── fault_type_FDIR_dataset_realistic.csv  # Fault classification dataset
│       └── lgb_fault_type_current.pkl             # LightGBM fault classifier (95.75% accuracy)
│
└── 📁 power/                                      # Power Prediction Model
    ├── 🔧 Core Scripts
    │   ├── generate_enhanced_data.py              # Synthetic power data generator
    │   ├── train_optimized_model.py               # XGBoost model training with hyperparameter tuning
    │   └── test_single_prediction.ipynb           # Inference & validation notebook
    │
    ├── 📊 Models & Outputs
    │   ├── xgboost_power_predictor_optimized.pkl  # Trained power prediction model
    │   └── prediction_comparison.csv              # Model predictions vs ground truth
    │
    └── 📁 generated_data/                         # Simulated power dataset
        └── sim_power_data_enhanced.csv            # Training/test dataset with 12 min forecasting
```

---

## Directory Descriptions

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| **battery health and thermal prediction/** | Battery state-of-health prediction using GRU neural network | `train_gru_model.ipynb`, `best_gru_model.pth` |
| **CubeSat/** | Reinforcement learning agent for attitude control & detumbling | `rl-cubesat.ipynb`, `sac_cubesat_policy.zip` |
| **Data compressing/** | Downlink optimization with adaptive compression selection | `train_XGBoost.py`, `send_with_compression.py` |
| **FDIR_VF/** | Autonomous fault detection & isolation models | `lgb_anomaly_model.pkl`, `lgb_fault_type_current.pkl` |
| **power/** | 12-minute ahead power availability forecasting | `train_optimized_model.py`, `xgboost_power_predictor_optimized.pkl` |

---

## File Organization by Type

### 🔧 **Training Scripts** (Top-level in each module)
- `train_gru_model.ipynb` → Battery model training
- `train_XGBoost.py` → Compression model training
- `train_optimized_model.py` → Power model training
- `cubesat.ipynb` & `rl-cubesat.ipynb` → RL agent training

### 📊 **Generated Datasets** (in `generated_dataset/` or `generated_data/`)
- Orbital pass simulations (Objective 1)
- Power profiles (Objective 2)
- Battery telemetry (Objective 3)
- Sensor fault data (Objective 4)

### 🤖 **Trained Models** (`.pth`, `.pkl`, `.keras`, `.zip`)
- `best_gru_model.pth` → Battery GRU
- `xgboost_*.pkl` → Compression & power predictions
- `lgb_*.pkl` → FDIR models
- `model_supervised.keras` → Tumbling detector
- `sac_cubesat_policy.zip` → RL policy

### ✅ **Inference & Validation** (Notebooks & test scripts)
- `test_single_prediction.ipynb` → Power inference demo
- `send_with_compression.py` → Compression pipeline
- `test.py` → Unit tests for compression

---

# **1. Summary**

CubeSats operate in harsh space environments where communication delays, limited bandwidth, and long blackout periods make real-time ground intervention impossible. This project proposes an autonomous AI-driven system capable of detecting anomalies, managing power, stabilizing attitude, and maintaining communication reliability without human input. By combining fault detection, predictive modeling, reinforcement learning control, and adaptive onboard decision-making, the system ensures continuous, reliable CubeSat operation and mitigates mission-critical failures.

---

# **2. Problematic**  


CubeSats operate in highly constrained and unpredictable space environments where communication delays, limited bandwidth, and blackouts make ground intervention ineffective. Minor anomalies such as thermal imbalances, battery degradation, or attitude instabilities can rapidly escalate into mission-threatening failures. Traditional FDIR systems struggle to react promptly and often misinterpret subsystem faults as sensor errors.

Unpredictable variations in power generation and consumption create additional risks, as poor power forecasting can lead to payload shutdowns or brownouts. Limited bandwidth further complicates data transmission, requiring intelligent compression systems. Finally, tumbling after deployment or external disturbances affects communication stability and energy harvesting.

These challenges highlight the need for **advanced onboard autonomy** for real-time fault detection, predictive resource management, efficient communication, and attitude stabilization — without relying on ground stations.

---

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
-generated_data/: Designated output directory for generated datasets (e.g., .csv files).
-generate_enhanced_data.py: Python script for simulating and generating the training and -testing dataset (sim_power_data_enhanced.csv).
-train_optimized_model.py: The main training script. It handles data loading, hyperparameter tuning, model training, evaluation, and serialization.
-test_single_prediction.py: A demonstration script to load the trained model and make a single prediction on a simulated "current state" from the test data.
-xgboost_power_predictor_optimized.pkl: (Output) The final, serialized XGBoost model artifact, ready for deployment.
-prediction_comparison.csv: (Output) A CSV file comparing the model's predictions against the ground truth values on the test set.




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

# **3.2  Hardware/electronics design files**
*(Schema electric, workflow diagram, workflow description — to be added)*

---

# **3.3 Impact**

The system enhances CubeSat autonomy, reliability, and mission longevity.  
Power and battery prediction prevent energy failures.  
The FDIR system minimizes mission downtime.  
The downlink compression module maximizes data return under real bandwidth limits.  
Reinforcement learning detumbling ensures stabilization after deployment.  

Together, these advancements create a fully autonomous CubeSat capable of surviving long-duration missions without dependence on ground control.

---

# ✅ END OF README ✅


