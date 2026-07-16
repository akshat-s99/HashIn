import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

export default function SettingsPage() {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleLogoutAll = async () => {
    try {
      setLoading(true)
      await api.delete('/auth/sessions')
      setMessage('Successfully logged out of all other devices.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to logout from all devices')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setLoading(true)
      await api.delete('/users/me')
      logout() // This will clear local state and redirect to login
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, fontSize: '28px', color: '#111827' }}>Settings</h1>
      
      {error && <div className="alert alert-danger p-3 mb-4" style={{ borderRadius: '12px' }}>{error}</div>}
      {message && <div className="alert alert-success p-3 mb-4" style={{ borderRadius: '12px' }}>{message}</div>}

      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="card-header bg-white border-bottom p-4">
          <h5 className="mb-0" style={{ fontWeight: 700 }}>Security & Sessions</h5>
        </div>
        <div className="card-body p-4">
          <p className="text-muted mb-4">Manage your active sessions and security preferences.</p>
          
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 p-3 bg-light rounded-3 mb-3">
            <div>
              <h6 className="mb-1" style={{ fontWeight: 600 }}>Log out everywhere</h6>
              <p className="mb-0 text-muted small">Sign out of all devices, including this one.</p>
            </div>
            <button 
              className="btn btn-outline-secondary" 
              onClick={handleLogoutAll}
              disabled={loading}
              style={{ borderRadius: '20px', fontWeight: 600, padding: '8px 20px' }}
            >
              Log out all devices
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 border-danger" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="card-header bg-white border-bottom p-4">
          <h5 className="mb-0 text-danger" style={{ fontWeight: 700 }}>Danger Zone</h5>
        </div>
        <div className="card-body p-4">
          <p className="text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          
          {!showDeleteConfirm ? (
            <button 
              className="btn btn-outline-danger" 
              onClick={() => setShowDeleteConfirm(true)}
              style={{ borderRadius: '20px', fontWeight: 600, padding: '10px 24px' }}
            >
              Delete Account
            </button>
          ) : (
            <div className="p-4 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-25">
              <h6 className="text-danger fw-bold mb-3">Are you absolutely sure?</h6>
              <p className="small mb-4">
                This action cannot be undone. This will permanently delete your account, posts, connections, and all associated data.
              </p>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-danger" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  style={{ borderRadius: '20px', fontWeight: 600, padding: '8px 24px' }}
                >
                  {loading ? 'Deleting...' : 'Yes, delete my account'}
                </button>
                <button 
                  className="btn btn-light" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  style={{ borderRadius: '20px', fontWeight: 600, padding: '8px 24px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
