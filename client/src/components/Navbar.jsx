import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="d-flex align-items-center py-2 hashin-navbar">
      <div className="me-auto">
        <Link to="/" className="h5 mb-0" style={{ fontFamily: 'Outfit, sans-serif' }}>HashIn</Link>
      </div>
      <div>
        <Link to="/discover" className="me-3">Discover</Link>
        <Link to="/feed" className="me-3">Feed</Link>
        <Link to="/network" className="me-3">Network</Link>
        <Link to="/profile" className="me-3">Profile</Link>
      </div>
    </nav>
  )
}
