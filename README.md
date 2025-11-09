# 🚀 CubeSat Autonomous AI System — Full Project Documentation

---

## **1. Summary**

CubeSats operate in harsh space environments where communication delays, limited bandwidth, and long blackout periods make real-time ground intervention impossible. This project proposes an autonomous AI-driven system capable of detecting anomalies, managing power, and maintaining stability without human input. By combining advanced fault detection, predictive models, reinforcement learning control, and adaptive onboard decision-making, the solution ensures continuous, reliable CubeSat operation and prevents mission-critical failures.

---

## **2. Problematic**  

CubeSats operate in highly constrained and unpredictable environments where communication delays, limited bandwidth, and blackouts make ground intervention ineffective. Minor anomalies such as thermal imbalances or battery degradation can escalate into mission-threatening failures. Traditional FDIR systems struggle to provide timely responses and often misinterpret real faults as sensor noise.

Unpredictable power variations further complicate operations, as poor forecasting can shut down subsystems. Limited downlink bandwidth restricts data transmission, requiring intelligent compression. Uncontrolled tumbling threatens communication stability. These combined challenges demand advanced onboard intelligence capable of autonomous real-time fault detection, resource management, detumbling control, and stabilization — without relying on ground control.

---

# **3. Solution**

---

## **3.1 Overview**

Below are the five autonomous intelligence modules developed to enhance CubeSat resilience and mission success.

---

# ✅ **Objective 1: CubeSat AI-Based Downlink Prediction & Adaptive Compression**

This system predicts **available downlink capacity** for each pass and computes the required **compression ratio** to ensure the full payload is deliverable.

### ✅ Highlights
- XGBoost-based prediction  
- Autonomous bandwidth management  
- Intelligent compression selection  
- Works under SNR/weather geometry challenges  

### ✅ How to Run
python train_XGBoost.py

python send_with_compressing.py



---

# ✅ **Objective 2: CubeSat Power Prediction Model**

Predicts **power availability at T+12 minutes** to optimize onboard power allocation.

### ✅ Highlights
- XGBoost model  
- Sequential SoC simulation  
- Rolling statistics + engineered features  
- Avoids brownouts & unsafe discharge  

### ✅ How to Run
python generate_enhanced_data.py
python train_optimized_model.py
python test_single_prediction.py



---

# ✅ **Objective 3: CubeSat Battery Health Prediction (GRU Model)**

GRU-based neural network predicting:  
✅ Temperature_next  
✅ Voltage_next  
✅ Current_next  

### ✅ Highlights
- 10-step time series  
- 7 engineered features  
- Lightweight, overfitting-resistant  
- High R² performance  

### ✅ How to Run
python generate_data_prediction.py
jupyter notebook train_gru_model.ipynb



---

# ✅ **Objective 4: AI-Based FDIR (Fault Detection, Isolation & Recovery)**

Two LightGBM models for real-time fault detection & subsystem isolation.

### ✅ Highlights
- Fault detection accuracy: **95%**  
- Fault isolation accuracy: **95.75%**  
- Sliding window preprocessing  
- Works on synthetic sensor datasets  

### ✅ How to Run
python generate_sensor_dataset.py
python train_fault_detection.py
python train_fault_isolation.py
python fdir_inference.py



---

# ✅ **Objective 5: Detumbling using Reinforcement Learning**

This module stabilizes a tumbling CubeSat using **supervised learning + reinforcement learning**.

### ✅ Summary (Short Version)

The system first detects tumbling using a **neural network classifier**, then uses a **Soft Actor-Critic (SAC)** reinforcement learning agent trained in a custom CubeSat attitude dynamics environment to reduce angular velocity and stabilize the satellite. The RL agent learns an optimal torque control policy that minimizes energy consumption while detumbling the CubeSat efficiently.

### ✅ How to Run
pip install -r requirements.txt


**Train detector model:**  
Run `cubesat.ipynb`  
→ Saves `model_supervised.keras`

**Train RL agent:**  
Run `rl-cubesat.ipynb`  
→ Saves `sac_cubesat_policy.zip`

### ✅ Repository Structure
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

## **3.2 Features**
*(Schema electric, workflow diagram, workflow description — TO BE ADDED)*

---

## **3.3 Impact** 

The proposed objectives collectively enhance the autonomy, reliability, and longevity of CubeSat missions. The battery and power prediction systems prevent overheating and energy depletion, ensuring safe long-term operation. The AI-based FDIR provides rapid onboard detection and isolation of faults, reducing downtime and preventing mission-critical failures.

The adaptive compression and link prediction module significantly improves communication efficiency under limited bandwidth. Finally, the reinforcement learning–based detumbling controller ensures stable orientation and communication quality immediately after deployment or disturbances.

Together, these advancements enable resilient, long-duration CubeSat missions capable of operating fully autonomously without relying on ground control.

---
## **4. Budget **  
---
## **5. Commercial **  


# ✅ END OF README ✅



