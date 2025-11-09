# 🛰️ CubeSat Detumbling Project using Reinforcement Learning

## 📋 Overview

This project combines **Supervised Learning** and **Reinforcement Learning** to build an intelligent control system for detumbling (reducing unwanted rotation) of a small CubeSat.

### Main Components:
1. **Detector Model**: A neural network trained to detect disturbance / tumbling state
2. **Simulation Environment (CubeSatEnv)**: A Gym environment that simulates simplified spacecraft attitude dynamics
3. **RL Agent (SAC Agent)**: Soft Actor-Critic algorithm learning an optimal control policy

---

## 🚀 Quick Start

### 1. Install Requirements

```bash
pip install -r requirements.txt
```

Or directly:
```bash
pip install numpy tensorflow scikit-learn matplotlib gym==0.26.2 stable-baselines3
```

### 2. Run the notebooks in order

#### A) Train the detector model
Open and run `cubesat.ipynb`:
- Generates synthetic data
- Trains the disturbance / tumbling detection model
- Saves the model to `model_supervised.keras`

#### B) Train the reinforcement learning agent
Open and run `rl-cubesat.ipynb`:
- Loads the trained detector model
- Builds the CubeSat Gym environment
- Trains the SAC agent
- Evaluates performance and saves the trained policy

---

## 📁 File Structure

```
cubesat-rl/
├── cubesat.ipynb                      # Notebook 1: detector model training
├── rl-cubesat.ipynb                   # Notebook 2: reinforcement learning (SAC)
├── requirements.txt                   # Required libraries
├── README.md                          # This file
│
├── model_supervised.keras             # Trained detector model (created after first notebook)
├── best_detector_model.keras          # Best model checkpoint during training
│
├── sac_cubesat_policy.zip             # Trained SAC policy (created after second notebook)
│
├── checkpoints/                       # Training checkpoints
├── logs/                              # TensorBoard logs
│
├── training_curves.png                # Training metric plots
└── evaluation_results.png             # Evaluation results visualization
```

---

## 🎯 Goals and Outcomes

### Primary Goal
Learn a control policy that detumbles the CubeSat (reduces angular velocity) with minimal energy consumption.

### Performance Metrics
- **Final angular speed**: target < 0.05 rad/s
- **Episode length (steps)**: fewer is better (faster stabilization)
- **Energy usage**: minimize sum of squared control torques
- **Disturbance probability**: < 0.1 according to the detector model

---

## 🔧 Applied Improvements

### In `cubesat.ipynb`:
✅ Fixed random seeds for reproducibility  
✅ Added EarlyStopping and ModelCheckpoint  
✅ Explicit model saving  
✅ Detailed metrics (Precision, Recall, Confusion Matrix)  
✅ Plotted accuracy & loss curves  
✅ Verified loading of the saved model  

### In `rl-cubesat.ipynb`:
✅ Robust model loading (flexible path)  
✅ Removed unused imports (torch)  
✅ Added maximum steps (max_steps=200)  
✅ Fixed random seeds  
✅ Increased training steps (5,000 → 50,000)  
✅ Added CheckpointCallback & TensorBoard  
✅ Comprehensive evaluation cell with plots  
✅ Action clipping  
✅ Simulated magnetic field variation  

---

## 📊 Monitoring Training

### Using TensorBoard

During SAC training you can monitor progress via:

```bash
tensorboard --logdir=./logs/sac_cubesat_tensorboard/
```

Then open: `http://localhost:6006`

### Available Metrics:
- `rollout/ep_len_mean`: Mean episode length
- `rollout/ep_rew_mean`: Mean episodic reward
- `train/learning_rate`: Current learning rate
- `train/loss`: Training loss

---

## 🧪 Testing the Trained Policy

After training, you can test the policy:

```python
from stable_baselines3 import SAC
import numpy as np

# Load policy
model = SAC.load("sac_cubesat_policy")

# Create environment
env = CubeSatEnv()

# Test
obs = env.reset()
for _ in range(200):
    action, _ = model.predict(obs, deterministic=True)
    obs, reward, done, info = env.step(action)
    if done:
        print(f"Stabilized in {info['step']} steps!")
        print(f"Final angular speed: {info['angular_speed']:.4f} rad/s")
        break
```

---

## 🔬 Proposed Future Enhancements

### 1. Physics Model Improvements
- [ ] Add full Euler rotational dynamics
- [ ] Use a realistic spacecraft inertia matrix
- [ ] Simulate magnetic field torque effects
- [ ] Add external disturbances (solar pressure, gravity gradient)

### 2. Data Improvements
- [ ] Use simulated data from GMAT or STK
- [ ] Add realistic sensor noise
- [ ] Use time-series sequences instead of single samples
- [ ] Collect data from real CubeSat missions

### 3. Learning Improvements
- [ ] Try other algorithms (PPO, TD3, DDPG)
- [ ] Use parallel environments for faster training
- [ ] Hyperparameter tuning with Optuna
- [ ] Transfer Learning from similar missions

### 4. Evaluation & Testing
- [ ] Build a diverse test suite (varied scenarios)
- [ ] Compare with classical control (B-dot, PD controller)
- [ ] Robustness testing under unexpected disturbances
- [ ] Analyze cumulative energy consumption

---

## 📚 References & Resources

### Reinforcement Learning Algorithms:
- [Stable-Baselines3 Documentation](https://stable-baselines3.readthedocs.io/)
- [SAC Paper: Soft Actor-Critic](https://arxiv.org/abs/1801.01290)

### Spacecraft Dynamics:
- Wertz, J. R. (2012). *Spacecraft Attitude Determination and Control*
- Sidi, M. J. (1997). *Spacecraft Dynamics and Control*

### CubeSat Detumbling:
- B-dot Control Algorithm
- Magnetorquer-based attitude control

---

## 🤝 Contributing

To improve the project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 Important Notes

⚠️ **Educational Project**: Physics models are heavily simplified and not fully representative of real spacecraft.

⚠️ **Synthetic Data**: Training data is randomly generated, not from real sensors.

⚠️ **Performance**: For better results, increase training steps to 100,000+ and use more realistic data.

---

## 📧 Support

If you encounter issues:
1. Ensure all libraries are installed with correct versions
2. Confirm `model_supervised.keras` exists before running the RL notebook
3. Inspect error messages in notebook cells

---

## 📄 License

This project is open-source and available for educational and research use.

---

**Created**: November 2025  

---

✨ **Happy Learning!** 🚀
