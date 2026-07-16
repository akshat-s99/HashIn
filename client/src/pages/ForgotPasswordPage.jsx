import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage('')
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setMessage('If an account with that email exists, a reset link has been sent.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-100" style={{ maxWidth: '400px', padding: '2rem 0' }}>
      <div className="text-center mb-4">
        <h2 style={{ fontWeight: 800, fontSize: '28px', color: '#111827', letterSpacing: '-0.5px' }}>Reset your password</h2>
        <p className="text-muted mt-2" style={{ fontSize: '15px' }}>Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger p-2 small text-center" style={{ borderRadius: '16px' }}>{error}</div>}
        {message && <div className="alert alert-success p-2 small text-center" style={{ borderRadius: '16px' }}>{message}</div>}

        <div className="mb-4">
          <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>Email</label>
          <input 
            className="form-control rounded-pill" 
            type="email" 
            placeholder="name@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
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
          {loading ? 'Sending...' : 'Send reset link'}
        </button>

        <div className="text-center mt-3">
          <Link to="/login" style={{ color: '#111827', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>
            Back to login
          </Link>
        </div>
      </form>
    </div>
  )
}
