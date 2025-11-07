# ============================================================
# CUBESAT LINK-PREDICTION DATASET GENERATOR
# ============================================================

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os, random, math

# -----------------------------
# CONFIGURATION
# -----------------------------
AGG_ROWS = 50000          # number of aggregated pass rows
TS_PASSES = 5000          # number of time-series passes
TS_SAMPLING = 5           # time-series sample step in seconds
OUT_DIR = "./generated_dataset"   # output folder

random.seed(42)
np.random.seed(42)

os.makedirs(OUT_DIR, exist_ok=True)

# ============================================================
# HELPERS — PASS GEOMETRY
# ============================================================
def sample_pass_geometry():
    # Duration between 180–600 seconds
    duration = int(np.random.uniform(180, 600))
    max_elev = float(np.clip(np.random.beta(2, 2) * 80 + 5, 5, 90))
    mean_elev = float(np.clip(np.random.uniform(5, max_elev), 5, max_elev))
    range_km = float(np.clip(1200 - (max_elev/90.0)*900 + np.random.normal(0,50), 300, 1400))
    mean_range = float(range_km + np.random.normal(50,75))
    doppler = float(np.random.normal(0, 200))
    return duration, max_elev, mean_elev, round(range_km,2), round(mean_range,2), round(doppler,2)


# ============================================================
# HELPERS — RADIO PARAMETERS
# ============================================================
def sample_radio_and_hw():
    tx_freq = random.choice([437e6, 2.2e9])   # UHF or S-band
    tx_power = float(np.random.uniform(12, 28)) # dBm (12–28 typical CubeSat)
    gain_tx = float(np.random.uniform(3.0, 8.0))
    gain_rx = float(np.random.uniform(10.0, 18.0))
    bw = random.choice([125_000, 250_000, 500_000])
    modcod = random.choice(["BPSK-1/2", "QPSK-1/2", "QPSK-3/4"])
    return tx_freq, tx_power, gain_tx, gain_rx, bw, modcod


# ============================================================
# HELPERS — ENVIRONMENT / WEATHER
# ============================================================
def sample_environment():
    rain = np.random.choice([0,0.2,0.5,1,2,5,10], p=[0.55,0.15,0.10,0.08,0.06,0.04,0.02])
    cloud = float(np.clip(np.random.normal(50 + rain*5, 20), 0, 100))
    tec = float(np.clip(np.random.normal(10 + rain*0.5, 5), 1, 80))
    kp = int(np.random.choice([0,1,2,3,4], p=[0.4,0.3,0.2,0.08,0.02]))
    rfi = int(np.random.rand() < 0.03)
    return rain, cloud, tec, kp, rfi


# ============================================================
# HELPERS — ONBOARD STATE
# ============================================================
def sample_onboard_state():
    batt = float(np.clip(np.random.normal(7.4, 0.3), 6.6, 8.6))
    pa_temp = float(np.clip(np.random.normal(45, 12), -10, 90))
    pointing_err = float(np.clip(np.random.normal(0.8, 0.9), 0.0, 6.0))
    recent_snr = float(np.clip(np.random.normal(8.0, 4.5), -5, 25))
    snr_std = float(np.clip(np.random.normal(1.8, 1.2), 0.1, 8.0))
    last_loss = float(np.clip(np.random.beta(1.5,30), 0, 0.4))
    return batt, pa_temp, pointing_err, recent_snr, snr_std, last_loss


# ============================================================
# LINK-BUDGET HELPERS
# ============================================================
def fspl_db(range_km, freq_hz):
    c = 299_792_458
    r_m = range_km * 1000
    return 20 * np.log10(4*math.pi * r_m * freq_hz / c)

def rain_attenuation_db(rain, freq, elev):
    if rain <= 0: return 0
    freq_ghz = freq/1e9
    base = 0.02 * (freq_ghz**1.2) * rain
    sec = 1/math.cos(math.radians(max(1.0, min(89.0, elev))))
    return base * sec

def pointing_loss_db(deg):
    return 0.12 * (deg**2)

def noise_floor_dbHz(T=500):
    return -174 + 10*np.log10(T/290)

def snr_to_bitrate(snr_db, bw, modcod):
    snr_lin = 10**(snr_db/10)
    se = np.log2(1+snr_lin) if snr_lin>0 else 0
    eff = 0.45 if "BPSK" in modcod else 0.6   # coding efficiency
    se_eff = min(se*eff, 6)
    return se_eff * bw     # bits/s


# ============================================================
# ROW GENERATOR — AGGREGATED
# ============================================================
def generate_aggregated_row(i):
    duration, max_elev, mean_elev, range_km, mean_range, doppler = sample_pass_geometry()
    tx_freq, tx_power, g_tx, g_rx, bw, modcod = sample_radio_and_hw()
    rain, cloud, tec, kp, rfi = sample_environment()
    batt, pa_temp, pointing_err, recent_snr, snr_std, last_loss = sample_onboard_state()

    # estimate SNR
    fspl = fspl_db(mean_range, tx_freq)
    rain_db = rain_attenuation_db(rain, tx_freq, mean_elev)
    point_db = pointing_loss_db(pointing_err)
    noise_db = noise_floor_dbHz() + 10*np.log10(bw)

    snr = tx_power + g_tx + g_rx - fspl - point_db - rain_db - noise_db
    snr += np.random.normal(0,1.8) + 0.3*(recent_snr-8)
    snr = float(np.clip(snr, -15, 30))

    # throughput estimate
    bitrate = snr_to_bitrate(snr, bw, modcod) * 0.9
    bits = bitrate * duration * np.random.normal(1.0, 0.05)
    max_bytes = int(bits//8)

    # payload
    payload = random.choice([
        10_000_000,
        100_000_000,
        1_000_000_000,
        5_000_000_000,
        10_000_000_000
    ])

    can_send = int(max_bytes >= payload)
    ratio = min(1.0, max_bytes/payload)

    start = datetime.utcnow() + timedelta(seconds=int(np.random.uniform(60,200000)))
    end = start + timedelta(seconds=duration)

    return {
        "pass_id": f"PASS_{i:06d}",
        "pass_start_utc": start.isoformat()+"Z",
        "pass_end_utc": end.isoformat()+"Z",
        "pass_duration_s": duration,
        "max_elevation_deg": max_elev,
        "mean_elevation_deg": mean_elev,
        "range_km_at_max": range_km,
        "mean_range_km": mean_range,
        "doppler_rate_hz_s": doppler,
        "tx_freq_hz": tx_freq,
        "tx_power_dbm": tx_power,
        "antenna_gain_tx_db": g_tx,
        "antenna_gain_rx_db": g_rx,
        "pointing_error_deg": pointing_err,
        "modem_bandwidth_hz": bw,
        "modem_modcod": modcod,
        "recent_mean_snr_db": recent_snr,
        "recent_snr_std_db": snr_std,
        "last_pass_packet_loss": last_loss,
        "battery_voltage_v": batt,
        "pa_temperature_C": pa_temp,
        "payload_size_bytes": payload,
        "payload_priority_pct": random.choice([0.1,0.2,0.3,0.5]),
        "local_time_of_day": int(np.random.uniform(0,23)),
        "day_of_year": int(np.random.uniform(1,365)),
        "rain_rate_mmhr_at_GS": rain,
        "cloud_cover_pct": cloud,
        "TEC_total": tec,
        "kp_index": kp,
        "rfi_flag": rfi,
        "historical_max_bytes": int((recent_snr/10)*max_bytes) if max_bytes>0 else 0,
        "max_bytes_transferable": max_bytes,
        "can_send_all": can_send,
        "recommended_compression_ratio": round(ratio,4),
        "predicted_mean_snr_db": snr
    }


# ============================================================
# GENERATE AGGREGATED DATASET
# ============================================================
print("Generating aggregated dataset...")
agg_rows = [generate_aggregated_row(i+1) for i in range(AGG_ROWS)]
df_agg = pd.DataFrame(agg_rows)
df_agg.to_csv(f"{OUT_DIR}/aggregated_passes.csv", index=False)
print("✅ Done: aggregated_passes.csv")


# ============================================================
# GENERATE TIME-SERIES DATA
# ============================================================
print("Generating time-series dataset...")

ts_meta = []
ts_profiles = []

for p in range(TS_PASSES):
    duration, max_elev, mean_elev, range_km, mean_range, doppler = sample_pass_geometry()
    tx_freq, tx_power, g_tx, g_rx, bw, modcod = sample_radio_and_hw()
    rain, cloud, tec, kp, rfi = sample_environment()
    batt, pa_temp, pointing_err, recent_snr, snr_std, last_loss = sample_onboard_state()

    # baseline SNR
    fspl = fspl_db(mean_range, tx_freq)
    rain_db = rain_attenuation_db(rain, tx_freq, mean_elev)
    point_db = pointing_loss_db(pointing_err)
    noise_db = noise_floor_dbHz() + 10*np.log10(bw)
    snr_base = tx_power + g_tx + g_rx - fspl - point_db - rain_db - noise_db
    snr_base += np.random.normal(0,1.8) + 0.3*(recent_snr-8)
    snr_base = float(np.clip(snr_base, -15, 30))

    # build time-series profile
    samples = list(range(0, duration, TS_SAMPLING))
    profile = []
    for t in samples:
        frac = (t-duration/2)/(duration/2)
        elev_effect = 2.5 * max(0, 1-frac*frac)
        fade = -np.random.uniform(3,12) if (rfi and np.random.rand()<0.02) else 0
        jitter = np.random.normal(0,1.5)
        snr_t = snr_base + elev_effect + jitter + fade
        profile.append({
            "pass_id": f"TS_PASS_{p:05d}",
            "t_s": t,
            "snr_db": round(snr_t,3),
            "range_km": round(range_km + np.random.normal(0,20),2),
            "elev_deg": round(max(0.1, mean_elev + np.random.normal(0,3)),2)
        })

    # compute bits
    bitrates = [snr_to_bitrate(item["snr_db"], bw, modcod)*0.9 for item in profile]
    bits = sum(b*TS_SAMPLING for b in bitrates)
    max_bytes = int(bits//8)

    payload = random.choice([10_000_000,100_000_000,1_000_000_000,5_000_000_000])

    meta = {
        "pass_id": f"TS_PASS_{p:05d}",
        "pass_duration_s": duration,
        "max_elevation_deg": max_elev,
        "tx_freq_hz": tx_freq,
        "tx_power_dbm": tx_power,
        "modem_bandwidth_hz": bw,
        "recent_mean_snr_db": recent_snr,
        "rain_rate_mmhr_at_GS": rain,
        "battery_voltage_v": batt,
        "pa_temperature_C": pa_temp,
        "payload_size_bytes": payload,
        "max_bytes_transferable": max_bytes,
        "can_send_all": int(max_bytes>=payload),
        "recommended_compression_ratio": round(min(1,max_bytes/payload),4)
    }

    ts_meta.append(meta)
    ts_profiles.extend(profile)

# write to file
pd.DataFrame(ts_meta).to_csv(f"{OUT_DIR}/timeseries_passes_meta.csv", index=False)
pd.DataFrame(ts_profiles).to_csv(f"{OUT_DIR}/timeseries_passes_profiles.csv", index=False)

print("✅ Done: timeseries_passes_meta.csv")
print("✅ Done: timeseries_passes_profiles.csv")
print("✅ Dataset generation complete!")
