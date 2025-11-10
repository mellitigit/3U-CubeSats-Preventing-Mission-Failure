'use client'

import { memo, useMemo } from 'react'
import type { TelemetryDisplayProps, ThermalSystem } from '@/types'
import {
  getTempColor,
  getTempStatus,
  formatNumber,
  textColorToBg,
} from '@/lib/utils'
import { DISPLAY_CONFIG } from '@/lib/constants'

export const ThermalSystemDisplay = memo<TelemetryDisplayProps<ThermalSystem>>(
  ({ data }) => {

    const cpuColor = useMemo(() => getTempColor(data.cpuTemp, 'cpu'), [data.cpuTemp])
    const batteryColor = useMemo(() => getTempColor(data.batteryTemp, 'battery'), [data.batteryTemp])
    const internalColor = useMemo(() => getTempColor(data.internalTemp, 'internal'), [data.internalTemp])
    const avgTemp = useMemo(
      () => (data.cpuTemp + data.batteryTemp + data.internalTemp) / 3,
      [data.cpuTemp, data.batteryTemp, data.internalTemp]
    )

    return (
    <div className="glass-panel p-6 floating" style={{ animationDelay: '2s' }}>
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
        <span className="mr-2">🌡️</span>
        Thermal System
      </h3>
      
      <div className="space-y-4">
        {/* CPU Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-300">CPU Temperature</span>
            <span className={`text-xs ${cpuColor}`}>
              {getTempStatus(data.cpuTemp, 'cpu')}
            </span>
          </div>
          <span className={`font-mono text-lg ${cpuColor}`}>
            {formatNumber(data.cpuTemp, DISPLAY_CONFIG.temperatureDecimalPlaces)}°C
          </span>
        </div>

        {/* Temperature Bar for CPU */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${textColorToBg(cpuColor)}`}
            style={{ width: `${Math.min(100, (data.cpuTemp / 70) * 100)}%` }}
          />
        </div>

        {/* Battery Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-300">Battery Temperature</span>
            <span className={`text-xs ${batteryColor}`}>
              {getTempStatus(data.batteryTemp, 'battery')}
            </span>
          </div>
          <span className={`font-mono text-lg ${batteryColor}`}>
            {formatNumber(data.batteryTemp, DISPLAY_CONFIG.temperatureDecimalPlaces)}°C
          </span>
        </div>

        {/* Temperature Bar for Battery */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${textColorToBg(batteryColor)}`}
            style={{ width: `${Math.min(100, (data.batteryTemp / 35) * 100)}%` }}
          />
        </div>

        {/* Internal Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-300">Internal Temperature</span>
            <span className={`text-xs ${internalColor}`}>
              {getTempStatus(data.internalTemp, 'internal')}
            </span>
          </div>
          <span className={`font-mono text-lg ${internalColor}`}>
            {formatNumber(data.internalTemp, DISPLAY_CONFIG.temperatureDecimalPlaces)}°C
          </span>
        </div>

        {/* Temperature Bar for Internal */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${textColorToBg(internalColor)}`}
            style={{ width: `${Math.min(100, (data.internalTemp / 35) * 100)}%` }}
          />
        </div>

        {/* Average Temperature */}
        <div className="pt-2 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Average Temp</span>
            <span className="font-mono text-lg text-blue-400">
              {formatNumber(avgTemp, DISPLAY_CONFIG.temperatureDecimalPlaces)}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

ThermalSystemDisplay.displayName = 'ThermalSystemDisplay'