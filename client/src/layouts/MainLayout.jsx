import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="bg-background text-on-background font-body-sm min-h-screen flex flex-col md:flex-row antialiased w-full">
      <Navbar />
      <main className="flex-grow md:ml-[240px] pt-16 md:pt-0 pb-24 md:pb-0 min-h-screen flex justify-center w-full">
        <Outlet />
      </main>
    </div>
  )
}
