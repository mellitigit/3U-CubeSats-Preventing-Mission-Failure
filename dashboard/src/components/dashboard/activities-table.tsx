'use client'

import { memo } from 'react'
import type { ActivitiesTableProps, Activity } from '@/types'
import { ACTIVITY_STATUS_COLORS } from '@/lib/constants'

const ActivityRow = memo<{ activity: Activity }>(({ activity }) => (
  <tr className="border-b border-white/5">
    <td className="py-3 text-sm">{activity.id}</td>
    <td className="py-3 text-sm">{activity.destination}</td>
    <td className="py-3 text-sm">{activity.date}</td>
    <td className="py-3 text-sm">
      <span className={`status-badge ${ACTIVITY_STATUS_COLORS[activity.status]}`}>
        {activity.status}
      </span>
    </td>
  </tr>
))

ActivityRow.displayName = 'ActivityRow'

export const ActivitiesTable = memo<ActivitiesTableProps>(({ activities }) => {
  return (
    <div className="glass-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activities</h2>
        <input
          type="search"
          placeholder="Search..."
          className="rounded-md bg-secondary/50 px-3 py-1 text-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-2 text-sm font-medium">Cargo ID</th>
              <th className="pb-2 text-sm font-medium">Destination</th>
              <th className="pb-2 text-sm font-medium">Date</th>
              <th className="pb-2 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

ActivitiesTable.displayName = 'ActivitiesTable'