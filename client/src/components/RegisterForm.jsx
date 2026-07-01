import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await register({ firstName, lastName, email, password })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-3">Create account</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col mb-3">
          <input className="form-control" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div className="col mb-3">
          <input className="form-control" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
      </div>
      <div className="mb-3">
        <input className="form-control" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button className="btn-h-primary" type="submit">Register</button>
    </form>
  )
}
