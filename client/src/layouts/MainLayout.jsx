import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <>
      <div className="container py-3">
        <Navbar />
      </div>
      <div className="app-container">
        <Outlet />
      </div>
    </>
  )
}
