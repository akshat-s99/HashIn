import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ firstName, lastName, email, password })
      navigate('/feed')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger p-2 small text-center" style={{ borderRadius: '16px' }}>{error}</div>}
      
      <div className="row g-2 mb-3">
        <div className="col">
          <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>First Name</label>
          <input className="form-control rounded-pill" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: 'var(--bg-card)' }} />
        </div>
        <div className="col">
          <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>Last Name</label>
          <input className="form-control rounded-pill" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: 'var(--bg-card)' }} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>Email</label>
        <input className="form-control rounded-pill" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: 'var(--bg-card)' }} />
      </div>
      <div className="mb-4">
        <label className="form-label" style={{ fontSize: '14px', fontWeight: 500, paddingLeft: '4px' }}>Password</label>
        <input className="form-control rounded-pill" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '14px 20px', border: '2px solid var(--color-border)', backgroundColor: 'var(--bg-card)' }} />
      </div>
      
      <button className="w-100 mb-4" type="submit" disabled={loading} style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '24px', padding: '14px', fontSize: '16px', fontWeight: 600, transition: 'background-color 0.2s' }} onMouseOver={(e) => !loading && (e.target.style.backgroundColor = 'var(--color-primary-hover)')} onMouseOut={(e) => !loading && (e.target.style.backgroundColor = 'var(--color-primary)')}>
        {loading ? 'Creating account...' : 'Sign up'}
      </button>

      <div className="d-flex align-items-center mb-4">
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
        <div className="px-3 text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>OR</div>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
      </div>

      <button type="button" onClick={() => addToast("Google Authentication coming soon!", "info")} className="btn w-100 d-flex align-items-center justify-content-center gap-2 mb-4" style={{ borderRadius: '50px', padding: '12px', fontSize: '16px', border: '2px solid var(--color-border)', color: 'var(--color-text-main)', fontWeight: 600, backgroundColor: 'var(--bg-card)', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-overlay-hover)'} onMouseOut={(e) => e.target.style.backgroundColor = 'var(--bg-card)'}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" style={{ width: '20px', height: '20px' }} />
        Continue with Google
      </button>
      
      <div className="text-center mt-3">
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Already on HashIn? <Link to="/login" style={{ color: 'var(--color-text-main)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </span>
      </div>
    </form>
  )
}
