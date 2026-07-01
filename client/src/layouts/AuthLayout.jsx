import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="auth-centered">
      <div style={{ width: 420 }}>
        <div className="hashin-card">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
