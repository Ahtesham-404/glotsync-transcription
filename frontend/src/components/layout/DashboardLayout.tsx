import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardTopNav } from './DashboardTopNav'

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface-950 flex">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div
        className={[
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-60',
        ].join(' ')}
      >
        <DashboardTopNav />
        <main
          className="flex-1 overflow-auto p-6"
          id="dashboard-content"
          aria-label="Dashboard content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
