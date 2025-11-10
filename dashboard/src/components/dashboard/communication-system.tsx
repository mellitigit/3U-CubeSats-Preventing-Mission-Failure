'use client'

import { memo, useMemo, useState, useEffect } from 'react'
import type { TelemetryDisplayProps, CommunicationSystem } from '@/types'
import {
  getSignalColor,
  getSignalQuality,
  getSignalBars,
  getStatusColor,
  formatTimeSince,
  textColorToBg,
} from '@/lib/utils'

export const CommunicationSystemDisplay = memo<TelemetryDisplayProps<CommunicationSystem>>(
  ({ data }) => {
    const [lastContactText, setLastContactText] = useState<string>('')

    const signalColor = useMemo(
      () => getSignalColor(data.signalStrength),
      [data.signalStrength]
    )
    const signalQuality = useMemo(
      () => getSignalQuality(data.signalStrength),
      [data.signalStrength]
    )
    const signalBars = useMemo(
      () => getSignalBars(data.signalStrength),
      [data.signalStrength]
    )
    const uplinkColor = useMemo(
      () => getStatusColor(data.uplinkStatus),
      [data.uplinkStatus]
    )
    const downlinkColor = useMemo(
      () => getStatusColor(data.downlinkStatus),
      [data.downlinkStatus]
    )
    const overallStatus = useMemo(
      () =>
        data.uplinkStatus === 'connected' && data.downlinkStatus === 'connected'
          ? 'text-green-400'
          : 'text-yellow-400',
      [data.uplinkStatus, data.downlinkStatus]
    )

    // Fix hydration issue by calculating time on client side only
    useEffect(() => {
      setLastContactText(formatTimeSince(data.lastContact))
    }, [data.lastContact])

    return (
    <div className="glass-panel p-6 floating" style={{ animationDelay: '4s' }}>
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
        <span className="mr-2">📡</span>
        Communication System
      </h3>
      
      <div className="space-y-4">
        {/* Signal Strength */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Signal Strength</span>
          <div className="flex items-center space-x-2">
            <span className={`font-mono text-lg ${signalColor}`}>
              {data.signalStrength} dBm
            </span>
            
            {/* Signal Bars */}
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 h-3 rounded ${
                    bar <= signalBars 
                      ? textColorToBg(signalColor)
                      : 'bg-gray-600'
                  }`}
                  style={{ height: `${bar * 3 + 6}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Uplink Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Uplink Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${textColorToBg(uplinkColor)}`} />
            <span className={`font-mono text-sm uppercase tracking-wider ${uplinkColor}`}>
              {data.uplinkStatus}
            </span>
          </div>
        </div>

        {/* Downlink Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Downlink Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${textColorToBg(downlinkColor)}`} />
            <span className={`font-mono text-sm uppercase tracking-wider ${downlinkColor}`}>
              {data.downlinkStatus}
            </span>
          </div>
        </div>

        {/* Last Contact */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Last Contact</span>
          <span className="font-mono text-sm text-blue-400">
            {lastContactText || '...'} 
          </span>
        </div>

        {/* Connection Quality */}
        <div className="pt-2 border-t border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Connection Quality</span>
            <span className={`text-sm ${signalColor}`}>
              {signalQuality}
            </span>
          </div>
          
          {/* Quality Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${textColorToBg(signalColor)}`}
              style={{ width: `${Math.max(0, Math.min(100, (data.signalStrength + 120) * 100 / 60))}%` }}
            />
          </div>
        </div>

        {/* Link Status Summary */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Overall Status</span>
          <span className={`font-mono text-sm ${overallStatus}`}>
            {data.uplinkStatus === 'connected' && data.downlinkStatus === 'connected' 
              ? 'OPERATIONAL' : 'DEGRADED'}
          </span>
        </div>
      </div>
    </div>
  )
})

CommunicationSystemDisplay.displayName = 'CommunicationSystemDisplay'