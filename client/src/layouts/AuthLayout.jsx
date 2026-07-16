import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

// Minimalist Auth Layout
export default function AuthLayout() {
  const location = useLocation()
  const isRegister = location.pathname === '/register'
  const title = isRegister ? 'Welcome to HashIn' : 'Welcome back'

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-body)' }}>

      {/* Center Modal */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '484px', borderRadius: '32px', padding: '40px 24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center mb-3">
              <img src="/logo.jpg" alt="HashIn Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
            <h2 style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '32px', margin: 0, letterSpacing: '-0.5px' }}>{title}</h2>
          </div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
