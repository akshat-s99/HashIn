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
  CiMail
} from 'react-icons/ci'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/feed', icon: CiHome },
    { name: 'Network', path: '/network', icon: CiStar },
    { name: 'Explore', path: '/explore', icon: CiCompass1 },
    { name: 'Messaging', path: '/messaging', icon: CiMail },
    { name: 'Saved', path: '/saved', icon: CiBookmark },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* TopNavBar for Mobile */}
      <header className="md:hidden flex items-center justify-between px-margin-mobile w-full h-16 bg-surface/80 backdrop-blur-md border-b border-white/10 fixed top-0 z-50">
        <Link to="/feed" className="font-headline-md text-headline-md text-primary font-bold tracking-tight text-decoration-none">HashIn</Link>
        <div className="flex items-center gap-sm">
          <button className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-white/10 text-on-surface-variant hover:text-primary transition-colors">
            <CiSearch size={20} />
          </button>
          <Link to="/profile" className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-mono text-label-mono text-decoration-none">
            {user?.firstName?.charAt(0) || 'U'}
          </Link>
        </div>
      </header>

      {/* SideNavBar for Desktop */}
      <nav className="hidden md:flex flex-col py-md px-sm gap-xs fixed left-0 top-0 h-full w-[240px] bg-surface border-r border-white/10 z-40">
        <div className="mb-lg px-sm">
          <Link to="/feed" className="font-headline-md text-headline-md text-primary mb-xs text-decoration-none d-block">HashIn</Link>
          <div className="font-label-mono text-label-mono text-on-surface-variant">Engineer Network</div>
        </div>
        
        <div className="flex items-center gap-sm px-sm py-xs mb-md">
          <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center font-label-mono text-label-mono text-on-surface text-uppercase">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div>
            <Link to="/profile" className="font-body-lg text-body-lg text-on-surface text-decoration-none hover:text-primary">{user?.firstName} {user?.lastName}</Link>
            <div className="flex gap-sm font-label-mono text-label-mono text-on-surface-variant mt-1">
              <span><span className="text-on-surface">{user?.connections?.length || 0}</span> C</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-xs flex-grow">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex items-center gap-xs px-sm py-xs cursor-pointer rounded-xl group text-decoration-none transition-all ${isActive(item.path) ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:bg-white/5'}`}
            >
              <span className={`transition-colors ${isActive(item.path) ? 'text-primary' : 'group-hover:text-primary'}`}>
                <item.icon size={20} />
              </span>
              <span className="font-body-sm text-body-sm font-bold">{item.name}</span>
            </Link>
          ))}
          
          <div className="mt-auto flex flex-col gap-xs">
            <Link to="/settings" className="flex items-center gap-xs text-on-surface-variant px-sm py-xs hover:bg-white/5 transition-all cursor-pointer rounded-xl group text-decoration-none">
              <span className="group-hover:text-primary transition-colors"><CiSettings size={20} /></span>
              <span className="font-body-sm text-body-sm">Settings</span>
            </Link>
            <button onClick={logout} className="flex items-center gap-xs text-on-surface-variant px-sm py-xs hover:bg-error/10 hover:text-error transition-all cursor-pointer rounded-xl group bg-transparent border-0 text-left w-100">
              <span className="group-hover:text-error transition-colors"><CiUser size={20} /></span>
              <span className="font-body-sm text-body-sm">Log out</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface/90 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around px-sm">
        {navItems.slice(0, 4).map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${isActive(item.path) ? 'text-primary bg-primary/10' : 'text-on-surface-variant'}`}
          >
            <item.icon size={24} />
          </Link>
        ))}
        <Link to="/profile" className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${isActive('/profile') ? 'text-primary bg-primary/10' : 'text-on-surface-variant'}`}>
            <CiUser size={24} />
        </Link>
      </nav>
    </>
  )
}
