// CubeSat Telemetry Data Generator
// Simulates realistic telemetry data for dashboard display

import type { CubeSatTelemetry, Anomaly, SeverityLevel } from '@/types'
import { randomBetween, randomChoice, clamp } from '@/lib/utils'
import {
  TELEMETRY_RANGES,
  PROBABILITIES,
  DISPLAY_CONFIG,
} from '@/lib/constants'

// System and action constants for anomaly generation
const ANOMALY_SYSTEMS = ['Power', 'Thermal', 'Communication', 'Navigation', 'AI Core'] as const
const SEVERITIES: SeverityLevel[] = ['low', 'medium', 'high', 'critical']
const REPAIR_ACTIONS = [
  'Auto-corrected voltage fluctuation',
  'Rerouted power distribution',
  'Thermal regulation activated',
  'Signal boost applied',
  'System restart initiated',
  'Backup systems engaged',
  'Self-diagnostic completed',
] as const

// Generate realistic anomaly data
const generateRandomAnomaly = (): Anomaly => ({
  time: new Date(Date.now() - Math.random() * 86400000), // Last 24 hours
  system: randomChoice([...ANOMALY_SYSTEMS]),
  severity: randomChoice(SEVERITIES),
  actionTaken: randomChoice([...REPAIR_ACTIONS]),
})

// Initial telemetry data
let currentTelemetry: CubeSatTelemetry = {
  powerSystem: {
    batteryLevel: 85,
    solarPanelOutput: 12.5,
    powerConsumption: 8.2,
    chargingStatus: "charging"
  },
  thermalSystem: {
    cpuTemp: 42,
    batteryTemp: 18,
    internalTemp: 22
  },
  communicationSystem: {
    signalStrength: -75,
    uplinkStatus: "connected",
    downlinkStatus: "connected",
    lastContact: new Date()
  },
  aiRepairModule: {
    anomaliesDetected: Array.from({ length: 5 }, generateRandomAnomaly),
    aiStatus: "monitoring",
    confidenceScore: 0.94
  },
  missionSummary: {
    missionTime: 1247, // ~52 days
    totalAnomalies: 23,
    repairedAnomalies: 21
  },
  lastUpdated: new Date()
};

// Generate updated telemetry data with realistic variations
export const generateTelemetry = (): CubeSatTelemetry => {
  // Power system variations
  const batteryDelta = randomBetween(
    TELEMETRY_RANGES.battery.delta.min,
    TELEMETRY_RANGES.battery.delta.max
  )
  const solarVariation = randomBetween(
    TELEMETRY_RANGES.solar.variation.min,
    TELEMETRY_RANGES.solar.variation.max
  )

  currentTelemetry.powerSystem.batteryLevel = clamp(
    currentTelemetry.powerSystem.batteryLevel + batteryDelta,
    TELEMETRY_RANGES.battery.min,
    TELEMETRY_RANGES.battery.max
  )

  // Solar output varies with orbital position (day/night cycle simulation)
  const orbitalPhase = (Date.now() / 1000) % TELEMETRY_RANGES.orbitalCycle
  const solarMultiplier = Math.max(
    0,
    Math.sin((orbitalPhase / TELEMETRY_RANGES.orbitalCycle) * 2 * Math.PI)
  )
  currentTelemetry.powerSystem.solarPanelOutput =
    randomBetween(TELEMETRY_RANGES.solar.min, TELEMETRY_RANGES.solar.max) *
    solarMultiplier *
    solarVariation

  currentTelemetry.powerSystem.powerConsumption = randomBetween(
    TELEMETRY_RANGES.power.min,
    TELEMETRY_RANGES.power.max
  )
  
  // Determine charging status based on power balance
  const powerBalance = currentTelemetry.powerSystem.solarPanelOutput - 
                     currentTelemetry.powerSystem.powerConsumption;
  
  if (powerBalance > 1) {
    currentTelemetry.powerSystem.chargingStatus = "charging";
  } else if (powerBalance < -1) {
    currentTelemetry.powerSystem.chargingStatus = "discharging";
  } else {
    currentTelemetry.powerSystem.chargingStatus = "idle";
  }

  // Thermal system variations
  currentTelemetry.thermalSystem.cpuTemp = randomBetween(35, 55);
  currentTelemetry.thermalSystem.batteryTemp = randomBetween(15, 25);
  currentTelemetry.thermalSystem.internalTemp = randomBetween(18, 28);

  // Communication system
  currentTelemetry.communicationSystem.signalStrength = randomBetween(-85, -65);
  currentTelemetry.communicationSystem.uplinkStatus = 
    Math.random() > 0.05 ? "connected" : "lost"; // 5% chance of loss
  currentTelemetry.communicationSystem.downlinkStatus = 
    Math.random() > 0.03 ? "connected" : "lost"; // 3% chance of loss
  
  if (currentTelemetry.communicationSystem.uplinkStatus === "connected") {
    currentTelemetry.communicationSystem.lastContact = new Date();
  }

  // AI Repair Module
  currentTelemetry.aiRepairModule.confidenceScore = randomBetween(0.85, 0.98);
  
  // Occasionally add new anomalies (5% chance)
  if (Math.random() < 0.05) {
    currentTelemetry.aiRepairModule.anomaliesDetected.unshift(generateRandomAnomaly());
    currentTelemetry.missionSummary.totalAnomalies++;
    
    // Keep only last 10 anomalies
    if (currentTelemetry.aiRepairModule.anomaliesDetected.length > 10) {
      currentTelemetry.aiRepairModule.anomaliesDetected.pop();
    }
  }

  // AI status based on recent anomalies
  const recentAnomalies = currentTelemetry.aiRepairModule.anomaliesDetected.filter(
    a => Date.now() - a.time.getTime() < 300000 // Last 5 minutes
  );
  
  if (recentAnomalies.length > 0) {
    currentTelemetry.aiRepairModule.aiStatus = "repairing";
    // Simulate repair completion
    if (Math.random() < 0.3) {
      currentTelemetry.missionSummary.repairedAnomalies++;
    }
  } else {
    currentTelemetry.aiRepairModule.aiStatus = "monitoring";
  }

  // Update mission time (increment by ~1 minute per update)
  currentTelemetry.missionSummary.missionTime += randomBetween(0.8, 1.2) / 60;
  
  currentTelemetry.lastUpdated = new Date();
  
  return { ...currentTelemetry };
};

// Export current data
export const getCubeSatTelemetry = (): CubeSatTelemetry => currentTelemetry;

// Auto-update function for real-time simulation
let updateInterval: NodeJS.Timeout | null = null;

export const startTelemetryUpdates = (callback?: (data: CubeSatTelemetry) => void) => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  
  updateInterval = setInterval(() => {
    const newData = generateTelemetry();
    if (callback) {
      callback(newData);
    }
  }, 3000); // Update every 3 seconds
  
  return updateInterval;
};

export const stopTelemetryUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// Export initial data
export default currentTelemetry;