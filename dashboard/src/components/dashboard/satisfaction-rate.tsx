'use client'

import { memo } from 'react'
import type { SatisfactionRateProps } from '@/types'

export const SatisfactionRate = memo<SatisfactionRateProps>(({ rate, title, subtitle }) => {
  return (
    <div className="glass-panel p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative h-2 flex-1 rounded-full bg-secondary">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-foreground">{rate}%</span>
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
})

SatisfactionRate.displayName = 'SatisfactionRate'