import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5" style={{ maxWidth: '1128px' }}>
        <Outlet />
      </div>
    </>
  )
}
