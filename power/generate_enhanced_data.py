
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# Paramètres
n_samples = 10000
t_step = 720  # 12 minutes en secondes

# Paramètres de la batterie pour une simulation plus réaliste
BATTERY_CAPACITY_WH = 30  # Capacité typique d'une batterie de CubeSat (Watt-heures)
BATTERY_CAPACITY_JOULES = BATTERY_CAPACITY_WH * 3600  # Conversion en Joules


# Génération séquentielle des données

print("Génération des données séquentielles...")
data_list = []
# Initialisation de l'état de charge initial de la batterie
current_soc = np.random.uniform(0.5, 0.9)

for i in range(n_samples):
    # Les caractéristiques orbitales et solaires 
    orb_phase = (2 * np.pi * i) / n_samples
    sun_incidence_cos = np.random.uniform(0, 1)
    eclipse_flag = 1 if sun_incidence_cos < 0.1 else 0
    solar_irradiance_Wm2 = 1361 * sun_incidence_cos
    panel_temp_C = 20 + 30 * sun_incidence_cos - np.random.normal(0, 2)
    
    # Efficacité et puissance générée
    mppt_eff = 0.85 + 0.1 * sun_incidence_cos - 0.02 * (panel_temp_C - 25) / 25
    mppt_eff = np.clip(mppt_eff, 0.7, 0.95)
    P_panel_pred = 40 * sun_incidence_cos * mppt_eff
    
    # Consommation
    P_base_pred = np.random.uniform(3, 6)
    payload_flag = np.random.choice([0, 1], p=[0.5, 0.5])
    P_payload_pred = payload_flag * np.random.uniform(2, 8)
    P_load_total = P_base_pred + P_payload_pred
    
    # Puissance nette actuelle
    P_net_current = P_panel_pred - P_load_total
    
    # Température de la batterie
    battery_temp_C = 10 + 15 * np.random.rand()

    # Logique de la puissance future (cible)
    P_future_720s = (
        P_net_current
        + np.random.normal(0, 2)
        + 5 * (current_soc - 0.5)
        - 6 * eclipse_flag
        + 2.0 * np.sin(orb_phase + np.pi/4)
        + 0.15 * (25 - battery_temp_C)
    )
    P_future_720s = np.clip(P_future_720s, -5, 40)

    # Stockage des données de l'instant 'i'
    data_list.append({
        "orb_phase": orb_phase,
        "eclipse_flag": eclipse_flag,
        "sun_incidence_cos": sun_incidence_cos,
        "solar_irradiance_Wm2": solar_irradiance_Wm2,
        "panel_temp_C": panel_temp_C,
        "mppt_eff": mppt_eff,
        "P_panel_pred": P_panel_pred,
        "SoC": current_soc,  
        "battery_temp_C": battery_temp_C,
        "P_base_pred": P_base_pred,
        "payload_flag": payload_flag,
        "P_payload_pred": P_payload_pred,
        "P_net_current": P_net_current,
        "P_future_720s": P_future_720s
    })

    #  Mettre à jour le SoC pour la prochaine itération
    energy_change_J = P_net_current * t_step
    current_soc += energy_change_J / BATTERY_CAPACITY_JOULES
    current_soc = np.clip(current_soc, 0, 1) # Le SoC reste entre 0% et 100%

# Création du DataFrame
df = pd.DataFrame(data_list)


# Ingénierie de nouvelles caractéristiques (Feature Engineering)

print("Création de nouvelles caractéristiques...")
# 1. Caractéristiques temporelles 
window_size = 5
df['P_panel_pred_rolling_mean'] = df['P_panel_pred'].rolling(window=window_size, min_periods=1).mean()
df['P_panel_pred_rolling_std'] = df['P_panel_pred'].rolling(window=window_size, min_periods=1).std()
df['panel_temp_C_rolling_mean'] = df['panel_temp_C'].rolling(window=window_size, min_periods=1).mean()

# Remplacer les NaN créés par le rolling std au début par 0
df.fillna(0, inplace=True)

# 2. Caractéristiques d'interaction
df['irradiance_x_mppt'] = df['solar_irradiance_Wm2'] * df['mppt_eff']
df.to_csv("sim_power_data_enhanced.csv", index=False)
print("✅ Dataset amélioré (sim_power_data_enhanced.csv) généré:", df.shape)
print("\nColonnes disponibles :")
print(df.columns.tolist())