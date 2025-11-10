'use client'

import { useMemo } from 'react'
import { WorldMap } from '@/components/dashboard/world-map'
import { SatisfactionRate } from '@/components/dashboard/satisfaction-rate'
import { ActivitiesTable } from '@/components/dashboard/activities-table'
import { PowerSystemDisplay } from '@/components/dashboard/power-system'
import { ThermalSystemDisplay } from '@/components/dashboard/thermal-system'
import { CommunicationSystemDisplay } from '@/components/dashboard/communication-system'
import { AIRepairModuleDisplay } from '@/components/dashboard/ai-repair-module'
import { MissionSummaryDisplay } from '@/components/dashboard/mission-summary'
import { AnimatedSpaceBackground } from '@/components/ui/animated-space-background'
import { useTelemetry, useTemperatures } from '@/hooks'
import { calculateRepairRate } from '@/lib/utils'
import type { Activity } from '@/types'

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'AB 707',
    source: 'JP',
    destination: 'IN',
    date: 'May 6, 2025',
    status: 'on-air',
  },
  {
    id: 'JK 127',
    source: 'US',
    destination: 'BN',
    date: 'May 6, 2025',
    status: 'taking-off',
  },
  {
    id: 'NA 235',
    source: 'EU',
    destination: 'US',
    date: 'May 6, 2025',
    status: 'cancelled',
  },
] as const

export default function DashboardPage() {
  const { telemetryData, isLive } = useTelemetry()
  const temperatures = useTemperatures()

  // Memoize derived values
  const repairSuccessRate = useMemo(
    () =>
      calculateRepairRate(
        telemetryData.missionSummary.repairedAnomalies,
        telemetryData.missionSummary.totalAnomalies
      ),
    [telemetryData.missionSummary.repairedAnomalies, telemetryData.missionSummary.totalAnomalies]
  )
  return (
    <div className="min-h-screen relative p-8">
      <AnimatedSpaceBackground />
      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-linear-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🛰️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white space-glow">CubeSat Mission Control</h1>
              <p className="text-blue-300 text-sm">Real-time satellite monitoring & telemetry</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">LIVE</span>
            </div>
            <button className="glass-panel px-6 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-300 pulse-glow">
              🚀 Track Live
            </button>
          </div>
        </div>

        {/* Centered World Map */}
        <div className="flex justify-center mb-8">
          <div className="glass-panel p-6 w-fit">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-white">CubeSat Global Tracking</h2>
              <p className="text-sm text-gray-400">Real-time orbital position</p>
            </div>
            <WorldMap />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Telemetry Systems */}
          <div className="lg:col-span-8 space-y-6">
            {/* Activities Table */}
            <ActivitiesTable activities={MOCK_ACTIVITIES} />
            
            {/* Telemetry Systems Row */}
            <div className="grid gap-6 md:grid-cols-2">
              <PowerSystemDisplay data={telemetryData.powerSystem} />
              <ThermalSystemDisplay data={telemetryData.thermalSystem} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <CommunicationSystemDisplay data={telemetryData.communicationSystem} />
              <AIRepairModuleDisplay data={telemetryData.aiRepairModule} />
            </div>
          </div>

          {/* Right Column - Stats and Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Mission Summary */}
            <MissionSummaryDisplay data={telemetryData.missionSummary} />
            
            {/* Original Stats */}
            <div className="space-y-4">
              <SatisfactionRate
                rate={Math.round(telemetryData.powerSystem.batteryLevel)}
                title="Battery Level"
                subtitle="Current charge"
              />
              <SatisfactionRate
                rate={Math.round(telemetryData.aiRepairModule.confidenceScore * 100)}
                title="AI Confidence"
                subtitle="System health"
              />
              <SatisfactionRate
                rate={Math.round(repairSuccessRate)}
                title="Repair Success"
                subtitle="Auto-fixes"
              />
            </div>

            {/* Weather Status */}
            <div className="glass-panel p-6">
              <h2 className="mb-4 text-lg font-semibold">Orbital Weather</h2>
              <div className="grid grid-cols-2 gap-4">
                {[15, 16, 17, 18].map((hour, index) => (
                  <div
                    key={hour}
                    className="flex flex-col items-center space-y-2 rounded-lg bg-secondary/50 p-4"
                  >
                    <span className="text-sm text-muted-foreground">
                      {hour}:00
                    </span>
                    <span className="text-2xl font-semibold">
                      {temperatures[index]}°C
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Live Data Status */}
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Update:</span>
                <span className="text-green-400 font-mono">
                  {telemetryData.lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}
                />
                <span className="text-xs text-gray-400">
                  {isLive ? 'Live telemetry active' : 'Telemetry paused'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
