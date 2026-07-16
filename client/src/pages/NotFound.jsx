import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'

export default function NotFound() {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <Card className="text-center p-5" style={{ maxWidth: '500px', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🗺️</div>
        <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
          We couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
        <Link to="/" className="btn-h-primary text-decoration-none" style={{ padding: '12px 32px', borderRadius: '50px', fontWeight: 600, display: 'inline-block' }}>
          Go to Homepage
        </Link>
      </Card>
    </div>
  )
}
