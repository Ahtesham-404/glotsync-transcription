import React from 'react'
import { Outlet } from 'react-router-dom'
import { PublicNav } from './PublicNav'
import { Footer } from './Footer'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <PublicNav />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
