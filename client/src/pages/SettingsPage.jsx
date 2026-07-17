import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import { CiUser, CiLock, CiStar, CiBellOn } from 'react-icons/ci'
import { useToast } from '../contexts/ToastContext'

export default function SettingsPage() {
  const { logout } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleLogoutAll = async () => {
    try {
      setLoading(true)
      await api.delete('/auth/sessions')
      addToast('Successfully logged out of all other devices.', 'success')
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to logout from all devices', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      await api.delete('/users/me')
      logout()
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to delete account', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="w-full relative z-10">
      {/* Animated Background Element */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary-container/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-lg md:py-xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Settings Inner Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-sm sticky top-lg">
          <h2 className="font-headline-md font-bold text-on-surface mb-md">Settings</h2>
          <nav className="flex flex-col gap-2 font-body-sm text-body-sm">
            <a className="px-sm py-2 rounded-xl bg-surface-container border border-white/10 text-primary flex items-center gap-sm font-bold" href="#account">
              <span className="text-[18px]"><CiUser /></span>
              Account
            </a>
            <a className="px-sm py-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant flex items-center gap-sm" href="#privacy">
              <span className="text-[18px]"><CiLock /></span>
              Privacy
            </a>
            <a className="px-sm py-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant flex items-center gap-sm" href="#appearance">
              <span className="text-[18px]"><CiStar /></span>
              Appearance
            </a>
            <a className="px-sm py-2 rounded-xl hover:bg-surface-container transition-colors text-on-surface-variant flex items-center gap-sm" href="#notifications">
              <span className="text-[18px]"><CiBellOn /></span>
              Notifications
            </a>
          </nav>
        </div>
        
        {/* Settings Forms Canvas */}
        <div className="lg:col-span-9 flex flex-col gap-xl">
          {/* Account Section */}
          <section className="flex flex-col gap-md" id="account">
            <div>
              <h3 className="font-headline-md font-bold text-on-surface">Account Settings</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Manage your active sessions and security preferences.</p>
            </div>
            
            <div className="glass-panel rounded-xl p-md border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
              <div>
                <h4 className="font-body-sm font-bold text-on-surface">Log out everywhere</h4>
                <p className="font-body-sm text-on-surface-variant mt-1">Sign out of all devices, including this one.</p>
              </div>
              <button 
                className="shrink-0 px-4 py-2 rounded-full border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors font-label-mono text-label-mono bg-transparent disabled:opacity-50"
                onClick={handleLogoutAll}
                disabled={loading}
              >
                Log out all devices
              </button>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="flex flex-col gap-md" id="appearance">
            <div>
              <h3 className="font-headline-md font-bold text-on-surface">Appearance</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Customize the UI theme of HashIn.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
              <div className="glass-panel rounded-xl p-sm flex flex-col gap-sm cursor-pointer border-primary/50 bg-primary/5 group relative overflow-hidden">
                <div className="h-24 rounded-lg bg-[#121212] border border-white/10 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-x-0 top-0 h-4 bg-[#1f1f1f]/80 border-b border-white/5"></div>
                  <div className="absolute left-0 inset-y-0 w-8 bg-[#1f1f1f]/60 border-r border-white/5"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-mono text-label-mono text-primary font-bold">Dark (Default)</span>
                  <div className="w-4 h-4 rounded-full border border-primary bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <hr className="border-t border-white/10 w-full" />
          
          {/* Danger Zone Section */}
          <section className="flex flex-col gap-md" id="danger-zone">
            <div>
              <h3 className="font-headline-md font-bold text-error">Danger Zone</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Irreversible account actions.</p>
            </div>
            
            <div className="border border-error/30 bg-error/5 rounded-xl p-md flex flex-col gap-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md">
                <div>
                  <h4 className="font-body-sm font-bold text-error">Delete Account</h4>
                  <p className="font-body-sm text-on-surface-variant mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                {!showDeleteConfirm && (
                  <button 
                    className="shrink-0 px-4 py-2 rounded-full border border-error/50 text-error hover:bg-error/10 transition-colors font-label-mono text-label-mono bg-transparent"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                )}
              </div>
              
              {showDeleteConfirm && (
                <div className="mt-4 p-md bg-error/10 rounded-lg border border-error/20">
                  <h6 className="text-error font-bold mb-2">Are you absolutely sure?</h6>
                  <p className="text-on-surface-variant text-[13px] mb-4">
                    This action cannot be undone. This will permanently delete your account, posts, connections, and all associated data.
                  </p>
                  <div className="flex gap-sm">
                    <button 
                      className="px-4 py-2 rounded-full bg-error text-white hover:bg-error/80 transition-colors font-bold text-[13px]"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Yes, delete my account'}
                    </button>
                    <button 
                      className="px-4 py-2 rounded-full border border-white/10 text-on-surface hover:bg-white/5 transition-colors font-bold text-[13px]"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
