# Battery Health Prediction Model for CubeSat Mission Failure Prevention

## 📋 Objective

This project implements a **GRU (Gated Recurrent Unit)** neural network model to predict future battery parameters (temperature, voltage, and current) for 3U CubeSats. The primary goal is to enable **proactive mission failure prevention** by providing early warnings about potential battery and thermal issues before they become critical.

### Key Objectives:

1. **Thermal Management**: Predict temperature rises to prevent overheating that could damage electronics and batteries
2. **Battery Health Monitoring**: Forecast voltage drops and current spikes to avoid deep discharge and overcurrent situations
3. **Mission Failure Prevention**: Provide early warnings before critical thresholds are reached, enabling proactive power management
4. **Operational Decision Support**: Inform power allocation decisions and enable autonomous power management systems

## 🏗️ Model Architecture

### GRU Model Specifications

- **Model Type**: Gated Recurrent Unit (GRU) - A simpler alternative to LSTM with 2 gates (update, reset) instead of 3
- **Architecture**:
  - Input Size: 7 features
  - Hidden Size: 48
  - Number of Layers: 2
  - Output Size: 3 (temperature_next, voltage_next, current_next)
  - Dropout Rate: 0.35
  - Bidirectional: False
  - Total Parameters: ~23,571

### Model Components:

```
Input Layer (7 features) 
  ↓
GRU Layer 1 (hidden_size=48)
  ↓
GRU Layer 2 (hidden_size=48)
  ↓
Dropout (0.35)
  ↓
Fully Connected Layer 1 (48 → 24)
  ↓
ReLU Activation
  ↓
Dropout (0.28)
  ↓
Fully Connected Layer 2 (24 → 3)
  ↓
Output (temperature_next, voltage_next, current_next)
```

### Input Features (7):
- `temperature`: Current battery temperature (°C)
- `voltage`: Current battery voltage (V)
- `current`: Current battery current (A)
- `power`: Calculated power (W)
- `delta_temp`: Temperature change rate
- `delta_voltage`: Voltage change rate
- `delta_current`: Current change rate

### Output Targets (3):
- `temperature_next`: Predicted next-step temperature (°C)
- `voltage_next`: Predicted next-step voltage (V)
- `current_next`: Predicted next-step current (A)

### Training Parameters:

- **Sequence Length**: 10 time steps (looks at past 10 measurements)
- **Batch Size**: 32
- **Learning Rate**: 0.0008 (with ReduceLROnPlateau scheduler)
- **Optimizer**: Adam with weight decay (1e-3)
- **Loss Function**: Mean Squared Error (MSE)
- **Gradient Clipping**: Max norm = 1.0
- **Early Stopping**: Patience = 15 epochs
- **Train/Val/Test Split**: 60/20/20

### Anti-Overfitting Techniques:

1. **Increased Dropout**: 0.35 (strong regularization)
2. **Weight Decay**: 1e-3 (L2 regularization)
3. **Reduced Model Size**: Hidden size 48 (fewer parameters)
4. **Additional FC Layer**: Hidden layer with dropout
5. **Gradient Clipping**: Prevents exploding gradients
6. **Lower Learning Rate**: 0.0008 (stable training)

## 📊 Model Performance

### Test Set Metrics:

- **Temperature Prediction**:
  - RMSE: 0.7283 °C
  - MAE: 0.6176 °C
  - R²: 0.9832

- **Voltage Prediction**:
  - RMSE: 0.047526 V
  - MAE: 0.034493 V
  - R²: 0.9741

- **Current Prediction**:
  - RMSE: 0.054206 A
  - MAE: 0.040902 A
  - R²: 0.9103

The model demonstrates excellent generalization with high R² scores, indicating strong predictive capability for battery health parameters.

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Jupyter Notebook or JupyterLab

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "prediction temp and volt"
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   # Install basic dependencies
   pip install -r requirements.txt
   
   # Install PyTorch (choose the appropriate command for your system)
   # For CPU-only version:
   pip install torch torchvision torchaudio
   
   # For CUDA support (if you have a compatible GPU):
   # Visit https://pytorch.org/get-started/locally/ for the correct command
   
   # Install scikit-learn
   pip install scikit-learn
   ```

   **Note**: 
   - The `requirements.txt` file contains basic visualization and data manipulation libraries
   - PyTorch and scikit-learn need to be installed separately
   - For GPU acceleration, install the CUDA version of PyTorch from the official website

### Required Python Packages:

- `torch` - PyTorch for deep learning
- `numpy` - Numerical computing
- `pandas` - Data manipulation
- `matplotlib` - Data visualization
- `scikit-learn` - Data preprocessing and metrics
- `seaborn` - Statistical visualization (optional)

## 📁 File Structure

```
prediction temp and volt/
│
├── README.md                          # This file
├── train_gru_model.ipynb             # Main training notebook
├── generate_data_prediction.py       # Script to generate synthetic data
├── requirements.txt                   # Python dependencies
│
├── synthetic_battery_prediction_data.csv  # Training dataset (2000 samples)
│
├── best_gru_model.pth                # Best model weights (saved during training)
├── battery_gru_model.pth             # Final trained model weights
├── scaler_X_gru.pkl                  # Feature scaler (MinMaxScaler)
├── scaler_y_gru.pkl                  # Target scaler (MinMaxScaler)
├── model_params_gru.pkl              # Model hyperparameters
│
└── venv/                             # Virtual environment (if created)
```

## 🎯 How to Run

### Option 1: Train the Model from Scratch

1. **Open the Jupyter Notebook**:
   ```bash
   jupyter notebook train_gru_model.ipynb
   ```

2. **Run all cells sequentially**:
   - The notebook will load the data, preprocess it, train the model, and evaluate performance
   - Training typically takes 10-30 minutes depending on your hardware
   - The model will be saved automatically when validation loss improves

3. **View Results**:
   - Training/validation loss curves
   - Test set performance metrics
   - Prediction vs actual scatter plots
   - Time series visualization

### Option 2: Generate New Synthetic Data

If you want to generate new synthetic battery data:

```bash
python generate_data_prediction.py
```

This will create a new `synthetic_battery_prediction_data.csv` file with 2000 time steps of realistic battery data.

### Option 3: Use Pre-trained Model for Inference

To use the pre-trained model for predictions, you can create a Python script with the model class definition:

```python
import torch
import torch.nn as nn
import pickle
import numpy as np
import pandas as pd

# Define the model class (same as in the notebook)
class BatteryGRU(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size, dropout=0.3, bidirectional=False):
        super(BatteryGRU, self).__init__()
        self.bidirectional = bidirectional
        self.gru = nn.GRU(
            input_size, 
            hidden_size, 
            num_layers, 
            batch_first=True, 
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=bidirectional
        )
        gru_output_size = hidden_size * 2 if bidirectional else hidden_size
        self.dropout1 = nn.Dropout(dropout)
        self.fc1 = nn.Linear(gru_output_size, gru_output_size // 2)
        self.dropout2 = nn.Dropout(dropout * 0.8)
        self.fc2 = nn.Linear(gru_output_size // 2, output_size)
        
    def forward(self, x):
        out, _ = self.gru(x)
        out = out[:, -1, :]
        out = self.dropout1(out)
        out = self.fc1(out)
        out = torch.relu(out)
        out = self.dropout2(out)
        out = self.fc2(out)
        return out

# Load model parameters
with open('model_params_gru.pkl', 'rb') as f:
    model_params = pickle.load(f)

# Load scalers
with open('scaler_X_gru.pkl', 'rb') as f:
    scaler_X = pickle.load(f)
with open('scaler_y_gru.pkl', 'rb') as f:
    scaler_y = pickle.load(f)

# Initialize model
model = BatteryGRU(
    input_size=model_params['input_size'],
    hidden_size=model_params['hidden_size'],
    num_layers=model_params['num_layers'],
    output_size=model_params['output_size'],
    dropout=0.35
)

# Load trained weights
model.load_state_dict(torch.load('best_gru_model.pth', map_location='cpu'))
model.eval()

# Prepare input sequence (last 10 time steps)
# Your input should be a numpy array of shape (10, 7)
# Features: [temperature, voltage, current, power, delta_temp, delta_voltage, delta_current]
# Example: Load from CSV
df = pd.read_csv('synthetic_battery_prediction_data.csv')
feature_cols = ['temperature', 'voltage', 'current', 'power', 'delta_temp', 'delta_voltage', 'delta_current']
input_sequence = df[feature_cols].tail(10).values  # Last 10 rows

# Scale and reshape
input_scaled = scaler_X.transform(input_sequence)
input_tensor = torch.tensor(input_scaled, dtype=torch.float32).unsqueeze(0)

# Make prediction
with torch.no_grad():
    prediction_scaled = model(input_tensor)

# Inverse transform to get original scale
prediction = scaler_y.inverse_transform(prediction_scaled.numpy())

print(f"Predicted Temperature: {prediction[0][0]:.2f} °C")
print(f"Predicted Voltage: {prediction[0][1]:.4f} V")
print(f"Predicted Current: {prediction[0][2]:.4f} A")
```

**Note**: For inference, you can also use the last cell (Cell 15) in the notebook which demonstrates how to make predictions with a single input sequence.

## 📈 Data Format

### Input Data Requirements:

The model expects a CSV file with the following columns:
- `timestamp`: Time step identifier
- `temperature`: Battery temperature in °C
- `voltage`: Battery voltage in V
- `current`: Battery current in A
- `power`: Power in W (calculated as voltage × current)
- `delta_temp`: Temperature change rate
- `delta_voltage`: Voltage change rate
- `delta_current`: Current change rate
- `temperature_next`: Next-step temperature (target)
- `voltage_next`: Next-step voltage (target)
- `current_next`: Next-step current (target)

### Data Characteristics:

- **Total Samples**: 2000 time steps
- **Sequence Length**: 10 (for creating input sequences)
- **Feature Range**: 
  - Temperature: 20-60 °C
  - Voltage: 3.0-4.2 V
  - Current: 0.1-2.0 A

## 🔧 Model Customization

### Experimenting with Hyperparameters:

You can modify the following parameters in the notebook:

- **Hidden Size**: Increase for more capacity (e.g., 64, 128)
- **Number of Layers**: Deeper networks (e.g., 3 layers)
- **Dropout Rate**: Adjust regularization (0.2-0.5)
- **Sequence Length**: Longer sequences (15, 20 time steps)
- **Bidirectional GRU**: Set `bidirectional=True` for bidirectional processing

### Example Modifications:

```python
# In Cell 5 of the notebook
hidden_size = 64  # Increase capacity
num_layers = 3    # Deeper network
dropout_rate = 0.3  # Less regularization
seq_length = 15   # Longer sequences (in Cell 3)
```

## ⏱️ Measuring Model Latency

To measure the inference latency (prediction time) of your model, you have two options:

### Option 1: Using the Latency Measurement Script

Run the standalone Python script:

```bash
python measure_latency.py
```

This will measure:
- Single inference latency (1000 runs)
- Batch inference latency (different batch sizes)
- Preprocessing time
- End-to-end latency
- Real-time feasibility analysis

### Option 2: Adding a Cell to the Notebook

Add the latency measurement cell from `LATENCY_MEASUREMENT_CELL.md` to your notebook after training. This will measure:
- Mean, median, min, max latency
- Throughput (predictions per second)
- Batch performance
- End-to-end latency including preprocessing

### Understanding Latency Results

- **< 10 ms**: Excellent for real-time applications
- **10-100 ms**: Good for real-time applications
- **100-1000 ms**: Acceptable for near-real-time applications
- **> 1000 ms**: Not suitable for real-time applications

### Typical Latency Values

- **CPU**: ~1-5 ms per prediction (200-1000 predictions/second)
- **GPU**: ~0.5-2 ms per prediction (500-2000 predictions/second)
- **End-to-end** (with preprocessing): ~2-6 ms

For CubeSat applications, latency under 100 ms is typically acceptable for battery monitoring systems.

## 📝 Notes

- The model uses synthetic data generated for demonstration purposes
- For real CubeSat applications, replace synthetic data with actual telemetry data
- The model performs best with normalized data (MinMaxScaler applied)
- Regular retraining with new data is recommended for maintaining accuracy
- Consider implementing real-time prediction pipelines for operational use
- Measure latency to ensure the model meets real-time requirements for your specific hardware

## 🤝 Contributing

This model is part of the **3U CubeSats - Preventing Mission Failure** project. For contributions or questions, please refer to the main project repository.

## 📄 License

Please refer to the main project license.

---

**Last Updated**: 2024
**Model Version**: GRU v1.0
**Status**: Production Ready

