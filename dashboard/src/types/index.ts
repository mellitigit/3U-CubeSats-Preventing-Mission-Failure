// Shared type definitions for the CubeSat dashboard

// Activity types
export interface Activity {
  id: string
  source: string
  destination: string
  date: string
  status: 'on-air' | 'taking-off' | 'cancelled' | 'arrived'
}

// Telemetry system types
export interface PowerSystem {
  batteryLevel: number // 0-100%
  solarPanelOutput: number // Watts
  powerConsumption: number // Watts
  chargingStatus: 'charging' | 'discharging' | 'idle'
}

export interface ThermalSystem {
  cpuTemp: number // °C
  batteryTemp: number // °C
  internalTemp: number // °C
}

export interface CommunicationSystem {
  signalStrength: number // dBm
  uplinkStatus: 'connected' | 'lost'
  downlinkStatus: 'connected' | 'lost'
  lastContact: Date
}

export interface Anomaly {
  time: Date
  system: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  actionTaken: string
}

export interface AIRepairModule {
  anomaliesDetected: Anomaly[]
  aiStatus: 'monitoring' | 'repairing' | 'idle'
  confidenceScore: number // 0-1
}

export interface MissionSummary {
  missionTime: number // hours since launch
  totalAnomalies: number
  repairedAnomalies: number
}

export interface CubeSatTelemetry {
  powerSystem: PowerSystem
  thermalSystem: ThermalSystem
  communicationSystem: CommunicationSystem
  aiRepairModule: AIRepairModule
  missionSummary: MissionSummary
  lastUpdated: Date
}

// Component prop types
export interface SatisfactionRateProps {
  rate: number
  title: string
  subtitle: string
}

export interface ActivitiesTableProps {
  activities: Activity[]
}

export interface TelemetryDisplayProps<T> {
  data: T
}

// Utility types
export type ChargingStatus = PowerSystem['chargingStatus']
export type ConnectionStatus = 'connected' | 'lost'
export type SeverityLevel = Anomaly['severity']
export type AIStatus = AIRepairModule['aiStatus']
export type ActivityStatus = Activity['status']
