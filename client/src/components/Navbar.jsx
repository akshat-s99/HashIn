import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  CiHome, 
  CiCompass1, 
  CiBellOn, 
  CiBookmark, 
  CiSettings,
  CiSearch,
  CiUser,
  CiStar,
  CiMail,
  CiLogout
} from 'react-icons/ci'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Feed', path: '/feed', icon: CiHome },
    { name: 'Network', path: '/network', icon: CiStar },
    { name: 'Discover', path: '/explore', icon: CiCompass1 },
    { name: 'Messages', path: '/messaging', icon: CiMail },
    { name: 'Saved', path: '/saved', icon: CiBookmark },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Top Navbar (Desktop & Mobile combined logic) */}
      <header className="navbar" style={{ padding: '0 24px', justifyContent: 'space-between' }}>
        <div className="d-flex align-items-center h-100" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div className="d-flex align-items-center gap-4 h-100">
            <Link to="/feed" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-main)', textDecoration: 'none' }}>
              HashIn
            </Link>
            
            {/* Desktop Search (optional) */}
            <div className="d-none d-md-flex align-items-center" style={{ position: 'relative' }}>
              <CiSearch size={20} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)' }} />
              <input className="form-control rounded-pill" style={{ paddingLeft: '40px', width: '280px', height: '40px', backgroundColor: 'var(--bg-body)' }} placeholder="Search HashIn..." />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="d-none d-md-flex align-items-center h-100" style={{ gap: '8px' }}>
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className={`nav-link h-100 d-flex align-items-center gap-2 ${isActive(item.path) ? 'active' : ''}`}
                style={{ padding: '0 12px' }}
              >
                <item.icon size={22} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu & Mobile Actions */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-md-none">
              <button className="btn-action-minimal" style={{ padding: '8px' }}>
                <CiSearch size={24} />
              </button>
            </div>
            
            <Link to="/profile" className="text-decoration-none d-none d-md-flex align-items-center gap-2 hover-bg" style={{ padding: '4px 12px 4px 4px', borderRadius: 'var(--radius-pill)', border: '1px solid transparent', transition: 'all 0.2s ease' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: 600, fontSize: '13px', color: 'var(--color-text-main)' }}>
                {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" /> : <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>}
              </div>
              <span className="d-none d-lg-block" style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-main)' }}>{user?.firstName}</span>
            </Link>
            
            <button onClick={logout} className="btn-action-minimal d-none d-md-flex" title="Log out">
              <CiLogout size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Nav for Mobile */}
      <nav className="d-md-none" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '64px', backgroundColor: 'var(--color-overlay)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: '1px solid var(--color-border)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 16px' }}>
        {navItems.slice(0, 4).map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={`d-flex flex-column align-items-center justify-content-center`}
            style={{ width: '48px', height: '48px', borderRadius: '50%', color: isActive(item.path) ? 'var(--color-primary)' : 'var(--color-text-muted)', backgroundColor: isActive(item.path) ? 'var(--color-badge-bg)' : 'transparent', textDecoration: 'none', transition: 'all 0.2s ease' }}
          >
            <item.icon size={24} />
          </Link>
        ))}
        <Link to="/profile" className={`d-flex flex-column align-items-center justify-content-center`} style={{ width: '48px', height: '48px', borderRadius: '50%', color: isActive('/profile') ? 'var(--color-primary)' : 'var(--color-text-muted)', backgroundColor: isActive('/profile') ? 'var(--color-badge-bg)' : 'transparent', textDecoration: 'none', transition: 'all 0.2s ease' }}>
            <CiUser size={24} />
        </Link>
      </nav>
    </>
  )
}
