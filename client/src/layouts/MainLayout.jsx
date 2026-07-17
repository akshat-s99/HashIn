import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div style={{ backgroundColor: 'var(--bg-body)', color: 'var(--color-text-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', width: '100%', paddingBottom: '64px' }}>
        <Outlet />
      </main>
    </div>
  )
}
