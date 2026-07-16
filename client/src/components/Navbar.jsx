import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CiSearch, CiCloudMoon, CiSun, CiMonitor } from 'react-icons/ci'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ... existing states
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      const notifs = res.data?.data?.notifications || []
      setNotifications(notifs)
      setUnreadCount(notifs.filter(n => !n.read).length)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return
    try {
      await api.put('/notifications/read')
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await api.get(`/users/search?q=${searchQuery}`)
        setSearchResults(res.data?.data?.users || res.data?.users || res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  if (!user) return null // Only show full navbar for logged in users, Landing page has its own

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container d-flex align-items-center" style={{ maxWidth: '1200px', width: '100%', padding: '0 24px' }}>
        <div className="d-flex align-items-center gap-3 me-auto">
          <Link to="/feed" className="text-decoration-none d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>
            <img src="/logo.jpg" alt="HashIn Logo" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          </Link>

          <div className="position-relative d-none d-md-block" ref={searchRef} style={{ width: '280px' }}>
            <div className="position-relative">
              <CiSearch className="position-absolute" size={18} style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                className="form-control rounded-pill" 
                placeholder="Search HashIn" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                style={{ paddingLeft: '36px', height: '40px', backgroundColor: '#eef3f8', border: 'none', fontSize: '14px' }}
              />
            </div>
            
            {showResults && searchQuery && (
              <div className="position-absolute bg-white w-100 mt-2 py-2" style={{ borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                {isSearching ? (
                  <div className="text-center p-3 text-muted" style={{ fontSize: '13px' }}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(result => (
                    <div 
                      key={result._id} 
                      className="d-flex align-items-center gap-2 px-3 py-2 cursor-pointer hover-bg-light"
                      onClick={() => {
                        setShowResults(false)
                        setSearchQuery('')
                        navigate(`/profile/${result._id}`)
                      }}
                      style={{ cursor: 'pointer' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <img src={result.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${result._id}`} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>{result.firstName} {result.lastName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }} className="text-truncate">{result.headline}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-muted" style={{ fontSize: '13px' }}>No results found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <NavLink to="/feed" className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : 'fw-medium'}`} style={{ fontSize: '15px', padding: '8px 4px' }}>
            Home
          </NavLink>
          <NavLink to="/network" className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : 'fw-medium'}`} style={{ fontSize: '15px', padding: '8px 4px' }}>
            Network
          </NavLink>
          <NavLink to="/explore" className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : 'fw-medium'}`} style={{ fontSize: '15px', padding: '8px 4px' }}>
            Explore
          </NavLink>
          <NavLink to="/messaging" className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : 'fw-medium'}`} style={{ fontSize: '15px', padding: '8px 4px' }}>
            Messaging
          </NavLink>
          
          <div className="position-relative" ref={notifRef}>
            <button 
              className="nav-link fw-medium d-flex align-items-center" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '8px 4px' }}
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (!showNotifications) handleMarkAsRead()
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: '11px', padding: '3px 6px' }}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="position-absolute bg-white mt-2 py-2" style={{ width: '320px', right: 0, borderRadius: '12px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                <div className="px-3 pb-2 mb-2" style={{ borderBottom: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text-main)' }}>Notifications</div>
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif._id} className="d-flex gap-3 px-3 py-2 cursor-pointer hover-bg-light" style={{ opacity: notif.read ? 0.7 : 1, cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-overlay-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => navigate(notif.type === 'NEW_MESSAGE' ? '/messaging' : notif.type.includes('CONNECTION') ? '/network' : '/feed')}>
                      <img src={notif.sender?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${notif.sender?._id}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>
                          <span style={{ fontWeight: 600 }}>{notif.sender?.firstName} {notif.sender?.lastName}</span> {notif.content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted" style={{ fontSize: '14px' }}>No notifications yet</div>
                )}
              </div>
            )}
          </div>
          
          <div className="d-flex align-items-center ms-2">
            <button 
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ background: 'transparent', border: '1px solid var(--color-border)', cursor: 'pointer', padding: '8px', color: 'var(--color-text-main)', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-overlay-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => {
                if (theme === 'light') setTheme('dark')
                else if (theme === 'dark') setTheme('system')
                else setTheme('light')
              }}
              title={`Current Theme: ${theme}`}
            >
              {theme === 'dark' ? (
                <CiCloudMoon size={18} />
              ) : theme === 'light' ? (
                <CiSun size={18} />
              ) : (
                <CiMonitor size={18} />
              )}
            </button>
          </div>
          
          <div className="position-relative" style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '16px' }} ref={dropdownRef}>
            <div className="dropdown">
              <button 
                className="d-flex align-items-center justify-content-center" 
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, padding: '8px 16px', borderRadius: '50px' }}
              >
                Profile
              </button>
              {showDropdown && (
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 show" style={{ width: '280px', borderRadius: '12px', marginTop: '12px', position: 'absolute', right: 0, display: 'block' }}>
                  <li>
                    <div className="px-3 py-2 d-flex align-items-center gap-3">
                      <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?._id}`} alt="profile" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div className="overflow-hidden">
                        <div className="text-truncate" style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-text-main)' }}>{user?.firstName} {user?.lastName}</div>
                        <div className="text-truncate" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{user?.headline}</div>
                      </div>
                    </div>
                  </li>
                  <li><Link to="/profile" className="dropdown-item mt-2 text-center text-primary fw-bold" style={{ border: '1px solid var(--color-primary)', borderRadius: '50px', width: 'calc(100% - 32px)', margin: '0 16px' }} onClick={() => setShowDropdown(false)}>View Profile</Link></li>
                  <li><hr className="dropdown-divider my-3" /></li>
                  <li><h6 className="dropdown-header">Account</h6></li>
                  <li><Link className="dropdown-item py-2" to="/saved" onClick={() => setShowDropdown(false)}>Saved Posts</Link></li>
                  <li><Link className="dropdown-item py-2" to="/settings" onClick={() => setShowDropdown(false)}>Settings & Privacy</Link></li>
                  <li><a className="dropdown-item py-2" href="#">Help Center</a></li>
                  <li><a className="dropdown-item py-2" href="#">Language</a></li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li><button className="dropdown-item py-2 text-danger" onClick={logout}>Sign Out</button></li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
