import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { CiMail, CiLock, CiCircleCheck } from 'react-icons/ci'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
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
    <div className="w-full max-w-sm flex flex-col gap-lg z-10">
      <div className="flex flex-col gap-xs text-left">
        <h2 className="font-headline-lg text-headline-lg md:text-headline-lg text-on-surface">Welcome back</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Sign in to your HashIn account</p>
      </div>

      <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
        {error && <div className="p-sm text-error bg-error-container/20 border border-error/50 rounded-lg font-body-sm text-center">{error}</div>}
        
        <div className="flex flex-col gap-sm">
          <div className="relative">
            <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"><CiMail /></span>
            <input 
              className="w-full h-[50px] pl-10 pr-sm bg-surface border border-white/10 rounded-lg text-on-surface font-code-block focus:border-primary focus:ring-1 focus:ring-primary placeholder-on-surface-variant/50 transition-colors outline-none" 
              id="email" type="email" placeholder="Email address" required 
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div className="relative">
            <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"><CiLock /></span>
            <input 
              className="w-full h-[50px] pl-10 pr-sm bg-surface border border-white/10 rounded-lg text-on-surface font-code-block focus:border-primary focus:ring-1 focus:ring-primary placeholder-on-surface-variant/50 transition-colors outline-none" 
              id="password" type="password" placeholder="Password" required 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-xs cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4 rounded-sm border border-white/20 bg-surface-container group-hover:border-primary/50 transition-colors">
              <input className="peer opacity-0 absolute w-full h-full cursor-pointer" type="checkbox" />
              <span className="text-[12px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"><CiCircleCheck /></span>
            </div>
            <span className="font-label-mono text-label-mono text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="font-label-mono text-label-mono text-primary hover:text-primary-fixed transition-colors">Forgot password?</Link>
        </div>

        <button 
          className="w-full h-[50px] rounded-full bg-primary-container text-on-primary-container font-body-sm text-body-sm font-semibold hover:bg-inverse-primary transition-colors active:scale-[0.98] disabled:opacity-50" 
          type="submit" disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="relative flex items-center py-sm">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink-0 mx-sm font-label-mono text-label-mono text-on-surface-variant uppercase tracking-wider">or</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <button className="w-full h-[50px] rounded-full border border-white/10 bg-transparent text-on-surface font-body-sm text-body-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-sm active:scale-[0.98]" type="button">
        Continue with GitHub
      </button>

      <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-sm">
        Don't have an account? <Link to="/register" className="text-primary hover:underline underline-offset-4">Sign up</Link>
      </p>
    </div>
  )
}
