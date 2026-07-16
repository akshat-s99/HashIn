import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { CiCircleCheck } from 'react-icons/ci'

export default function ResetPasswordPage() {
  const { resetToken } = useParams()
  const navigate = useNavigate()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (password !== confirmPassword) {
      return setError("Passwords don't match")
    }

    setLoading(true)

    try {
      await api.post(`/auth/reset-password/${resetToken}`, { password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. The link might be expired.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center w-100" style={{ maxWidth: '400px', padding: '2rem 0' }}>
        <div className="mb-4">
          <CiCircleCheck className="text-success mx-auto" style={{ width: '64px', height: '64px' }} />
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '24px', color: '#111827' }}>Password Reset Successful</h2>
        <p className="text-muted mt-2">You will be redirected to the login page shortly.</p>
        <Link to="/login" className="btn mt-3" style={{ backgroundColor: '#e60023', color: '#fff', borderRadius: '24px', padding: '10px 24px', fontWeight: 600 }}>Go to Login</Link>
      </div>
    )
  }

  return (
    <div className="w-100" style={{ maxWidth: '400px', padding: '2rem 0' }}>
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: 800, fontSize: '28px', color: '#111827', letterSpacing: '-0.5px' }}>Create new password</h2>
        <p className="text-muted mt-2" style={{ fontSize: '15px' }}>Your new password must be different from previous used passwords.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger p-2 small text-center" style={{ borderRadius: '16px' }}>{error}</div>}

        <div className="mb-3">
          <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>New Password</label>
          <input 
            className="form-control rounded-pill" 
            type="password" 
            placeholder="At least 8 characters" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: '#fff' }} 
          />
        </div>
        
        <div className="mb-4">
          <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>Confirm Password</label>
          <input 
            className="form-control rounded-pill" 
            type="password" 
            placeholder="Re-enter password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required 
            style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: '#fff' }} 
          />
        </div>

        <button 
          className="w-100 mb-4" 
          type="submit" 
          disabled={loading} 
          style={{ 
            backgroundColor: '#e60023', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '24px', 
            padding: '14px', 
            fontSize: '16px', 
            fontWeight: 600, 
            transition: 'background-color 0.2s' 
          }} 
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#ad081b')} 
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#e60023')}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}
