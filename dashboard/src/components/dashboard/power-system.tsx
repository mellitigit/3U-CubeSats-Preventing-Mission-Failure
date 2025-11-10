'use client'

import { memo, useMemo } from 'react'
import type { TelemetryDisplayProps, PowerSystem } from '@/types'
import {
  getBatteryColor,
  getChargingStatusColor,
  formatNumber,
  textColorToBg,
} from '@/lib/utils'
import { DISPLAY_CONFIG } from '@/lib/constants'

export const PowerSystemDisplay = memo<TelemetryDisplayProps<PowerSystem>>(
  ({ data }) => {
    const batteryColor = useMemo(
      () => getBatteryColor(data.batteryLevel),
      [data.batteryLevel]
    )
    const chargingColor = useMemo(
      () => getChargingStatusColor(data.chargingStatus),
      [data.chargingStatus]
    )
    const netPower = useMemo(
      () => data.solarPanelOutput - data.powerConsumption,
      [data.solarPanelOutput, data.powerConsumption]
    )
    const netPowerColor = useMemo(
      () => (netPower > 0 ? 'text-green-400' : 'text-red-400'),
      [netPower]
    )

    return (
      <div className="glass-panel p-6 floating">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
          <span className="mr-2">⚡</span>
          Power System (EPS)
        </h3>

        <div className="space-y-4">
          {/* Battery Level */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Battery Level</span>
            <span className={`font-mono text-lg ${batteryColor}`}>
              {formatNumber(data.batteryLevel, DISPLAY_CONFIG.percentageDecimalPlaces)}%
            </span>
          </div>

          {/* Battery Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${textColorToBg(batteryColor)}`}
              style={{ width: `${data.batteryLevel}%` }}
            />
          </div>

          {/* Solar Panel Output */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Solar Output</span>
            <span className="font-mono text-lg text-blue-400">
              {formatNumber(data.solarPanelOutput, DISPLAY_CONFIG.powerDecimalPlaces)}W
            </span>
          </div>

          {/* Power Consumption */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Consumption</span>
            <span className="font-mono text-lg text-orange-400">
              {formatNumber(data.powerConsumption, DISPLAY_CONFIG.powerDecimalPlaces)}W
            </span>
          </div>

          {/* Charging Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Status</span>
            <span
              className={`font-mono text-sm uppercase tracking-wider ${chargingColor}`}
            >
              {data.chargingStatus}
            </span>
          </div>

          {/* Power Balance */}
          <div className="pt-2 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Net Power</span>
              <span className={`font-mono text-lg ${netPowerColor}`}>
                {formatNumber(netPower, DISPLAY_CONFIG.powerDecimalPlaces)}W
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PowerSystemDisplay.displayName = 'PowerSystemDisplay'