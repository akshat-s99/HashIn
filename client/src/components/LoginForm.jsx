import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/feed')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger p-2 small text-center" style={{ borderRadius: '16px' }}>{error}</div>}
      
      <div className="mb-3">
        <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px', color: 'var(--color-text-main)' }}>Email</label>
        <input className="form-control rounded-pill" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)' }} />
      </div>
      <div className="mb-4">
        <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px', color: 'var(--color-text-main)' }}>Password</label>
        <input className="form-control rounded-pill" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)' }} />
      </div>

      <div className="text-start mb-4 px-2">
        <Link to="/forgot-password" className="text-decoration-none" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Forgot your password?</Link>
      </div>

      <button className="w-100 mb-4" type="submit" disabled={loading} style={{ backgroundColor: '#e60023', color: '#fff', border: 'none', borderRadius: '24px', padding: '14px', fontSize: '16px', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#ad081b')} onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#e60023')}>
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      <div className="d-flex align-items-center mb-4">
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
        <div className="px-3 text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>OR</div>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
      </div>

      <button type="button" onClick={() => addToast("Google Authentication coming soon!", "info")} className="btn w-100 d-flex align-items-center justify-content-center gap-2 mb-4" style={{ borderRadius: '50px', padding: '12px', fontSize: '16px', border: '2px solid var(--color-border)', color: 'var(--color-text-main)', fontWeight: 600, backgroundColor: 'transparent', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-overlay-hover)'} onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" style={{ width: '20px', height: '20px' }} />
        Continue with Google
      </button>
      
      <div className="text-center mt-3">
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Not on HashIn yet? <Link to="/register" style={{ color: 'var(--color-text-main)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </span>
      </div>
    </form>
  )
}
