'use client'

import { memo, useMemo, useState, useEffect } from 'react'
import type { TelemetryDisplayProps, AIRepairModule, Anomaly } from '@/types'
import {
  getAIStatusColor,
  getConfidenceColor,
  getSeverityColor,
  formatTimeAgo,
  textColorToBg,
} from '@/lib/utils'

export const AIRepairModuleDisplay = memo<TelemetryDisplayProps<AIRepairModule>>(
  ({ data }) => {
    const [mounted, setMounted] = useState(false)

    const statusColor = useMemo(
      () => getAIStatusColor(data.aiStatus),
      [data.aiStatus]
    )
    const confidenceColor = useMemo(
      () => getConfidenceColor(data.confidenceScore),
      [data.confidenceScore]
    )

    // Fix hydration issue by only rendering anomalies on client
    useEffect(() => {
      setMounted(true)
    }, [])

    return (
    <div className="glass-panel p-6 floating" style={{ animationDelay: '1s' }}>
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
        <span className="mr-2">🤖</span>
        AI Self-Repair Module
      </h3>
      
      <div className="space-y-4">
        {/* AI Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">AI Status</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${textColorToBg(statusColor)} animate-pulse`} />
            <span className={`font-mono text-sm uppercase tracking-wider ${statusColor}`}>
              {data.aiStatus}
            </span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Confidence Score</span>
          <span className={`font-mono text-lg ${confidenceColor}`}>
            {(data.confidenceScore * 100).toFixed(1)}%
          </span>
        </div>

        {/* Confidence Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${textColorToBg(confidenceColor)}`}
            style={{ width: `${data.confidenceScore * 100}%` }}
          />
        </div>

        {/* Recent Anomalies */}
        <div className="pt-2 border-t border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Recent Anomalies</span>
            <span className="text-xs text-gray-400">
              {data.anomaliesDetected.length} detected
            </span>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {!mounted ? (
              <div className="text-center text-gray-400 py-4">
                Loading anomalies...
              </div>
            ) : data.anomaliesDetected.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No recent anomalies detected
              </div>
            ) : (
              data.anomaliesDetected.slice(0, 5).map((anomaly: Anomaly, index: number) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{anomaly.system}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                      <span className="text-gray-400">{formatTimeAgo(anomaly.time)}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs">{anomaly.actionTaken}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="pt-2 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">System Health</span>
            <span className={`text-sm font-medium ${confidenceColor}`}>
              {data.confidenceScore > 0.9 ? 'OPTIMAL' :
               data.confidenceScore > 0.7 ? 'GOOD' : 'DEGRADED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

AIRepairModuleDisplay.displayName = 'AIRepairModuleDisplay'