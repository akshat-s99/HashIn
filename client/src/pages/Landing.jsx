import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Landing() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/feed" replace />
  }

  return (
    <div className="landing-page" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', overflow: 'hidden', position: 'relative' }}>
      {/* Transparent Navbar */}
      <nav className="d-flex justify-content-between align-items-center py-4 px-4 px-md-5 position-relative z-3">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>
          <img src="/logo.jpg" alt="HashIn Logo" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          HashIn
        </Link>
        <div className="d-flex align-items-center gap-4">
          <Link to="/login" className="text-decoration-none d-none d-sm-block" style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '15px' }}>Log in</Link>
          <Link to="/register" className="btn-h-primary" style={{ padding: '10px 24px', fontSize: '15px' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="position-relative z-2 text-center pt-5 pb-4 px-3">
        <div className="container" style={{ maxWidth: '900px', paddingTop: '60px' }}>
          
          <div className="d-flex justify-content-center mb-4">
            <div className="pill-badge">
              <span>✨</span> Introducing HashIn 2.0
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Outfit, sans-serif', letterSpacing: '-1.5px', color: 'var(--color-text-main)' }} className="mb-4">
            The professional network <br/>
            for the <span style={{ color: 'var(--color-primary)' }}>next generation.</span>
          </h1>

          <p style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto 40px auto' }}>
            Forget cold emails and cluttered feeds. Match with professionals based on skills, share your work beautifully, and grow your career.
          </p>

          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
            <Link to="/register" className="btn-h-primary d-flex align-items-center justify-content-center gap-2" style={{ padding: '16px 36px', fontSize: '18px', boxShadow: '0 8px 20px rgba(10,102,194,0.3)' }}>
              Start Swiping Free
              <span>👉</span>
            </Link>
            <Link to="/login" className="btn-h-outline d-flex align-items-center justify-content-center gap-2" style={{ padding: '16px 36px', fontSize: '18px', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Mockup Component */}
      <section className="position-relative z-3 px-4 px-md-5 mb-5 pb-5">
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="app-frame" style={{ height: '600px', position: 'relative' }}>
            <div className="app-frame-header">
              <div className="app-frame-dots">
                <span></span><span></span><span></span>
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>app.hashin.com</div>
            </div>
            
            <div style={{ width: '100%', height: 'calc(100% - 48px)', backgroundColor: 'var(--bg-body)', display: 'flex', overflow: 'hidden' }}>
              {/* Simulated Left Sidebar */}
              <div style={{ width: '240px', borderRight: '1px solid var(--color-border)', padding: '24px', backgroundColor: 'var(--bg-card)' }} className="d-none d-md-block">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-overlay)', marginBottom: '16px' }}></div>
                <div style={{ width: '120px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--color-overlay)', marginBottom: '8px' }}></div>
                <div style={{ width: '80px', height: '10px', borderRadius: '4px', backgroundColor: '#f3f4f6', marginBottom: '32px' }}></div>
                
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}></div>
                    <div style={{ width: '100px', height: '10px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}></div>
                  </div>
                ))}
              </div>
              
              {/* Simulated Center Feed */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                  {/* Fake Post 1 */}
                  <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-overlay)' }}></div>
                      <div>
                        <div style={{ width: '120px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--color-overlay)', marginBottom: '6px' }}></div>
                        <div style={{ width: '80px', height: '8px', borderRadius: '4px', backgroundColor: '#f3f4f6' }}></div>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '10px', borderRadius: '4px', backgroundColor: '#f3f4f6', marginBottom: '8px' }}></div>
                    <div style={{ width: '90%', height: '10px', borderRadius: '4px', backgroundColor: '#f3f4f6', marginBottom: '16px' }}></div>
                    <div style={{ width: '100%', height: '240px', borderRadius: '8px', backgroundColor: 'rgba(10,102,194,0.1)' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Gradient Fade to merge into background */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to bottom, transparent, var(--bg-body))' }}></div>
          </div>
        </div>
      </section>

      {/* Social Proof / Logo Ticker */}
      <section className="py-5 border-top border-bottom" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="container text-center mb-4">
          <p style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Trusted by professionals at top companies
          </p>
        </div>
        <div className="logo-ticker mx-auto" style={{ maxWidth: '1000px', opacity: 0.5 }}>
          <div className="logo-track">
            {/* We duplicate the logos twice for seamless looping */}
            {['Microsoft', 'Google', 'Amazon', 'Netflix', 'Meta', 'Stripe', 'Spotify'].map((logo, i) => (
              <h3 key={i} style={{ margin: 0, fontSize: '24px', color: 'var(--color-text-main)', fontFamily: 'Outfit, sans-serif' }}>{logo}</h3>
            ))}
            {['Microsoft', 'Google', 'Amazon', 'Netflix', 'Meta', 'Stripe', 'Spotify'].map((logo, i) => (
              <h3 key={`dup-${i}`} style={{ margin: 0, fontSize: '24px', color: 'var(--color-text-main)', fontFamily: 'Outfit, sans-serif' }}>{logo}</h3>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-5 my-5 position-relative z-2">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="text-center mb-5 pb-3">
            <h2 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-text-main)' }}>Everything you need to grow.</h2>
            <p style={{ fontSize: '18px', color: 'var(--color-text-muted)' }}>Powerful tools designed for the modern professional.</p>
          </div>

          <div className="row g-4">
            {/* Card 1: Large feature */}
            <div className="col-12 col-lg-8">
              <div className="bento-item h-100">
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Swipe Discovery Engine</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Find your next co-founder, client, or mentor by swiping through highly targeted profiles based on mutual skills.</p>
                <div style={{ height: '240px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '360px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--color-border)' }}></div>
                  <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%) rotate(5deg)', width: '280px', height: '360px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--color-border)', zIndex: 2 }}></div>
                </div>
              </div>
            </div>

            {/* Card 2: Small feature */}
            <div className="col-12 col-lg-4">
              <div className="bento-item h-100" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>Real-time Chat</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>Instant messaging overlay ensures you never miss an opportunity.</p>
                <div style={{ height: '160px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}></div>
              </div>
            </div>

            {/* Card 3: Medium feature */}
            <div className="col-12 col-md-6">
              <div className="bento-item h-100">
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Pinterest-Style Explore</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Discover trending thoughts and rich media in our visually stunning explore tab.</p>
              </div>
            </div>

            {/* Card 4: Medium feature */}
            <div className="col-12 col-md-6">
              <div className="bento-item h-100">
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>Rich Profiles</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Showcase your skills, headline, and avatar. First impressions matter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5 my-5 text-center position-relative z-2">
        <div className="container position-relative z-3">
          <h2 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '24px' }}>Ready to build your network?</h2>
          <Link to="/register" className="btn-h-primary" style={{ padding: '16px 48px', fontSize: '18px', boxShadow: '0 8px 25px rgba(10,102,194,0.4)' }}>
            Create free account
          </Link>
        </div>
      </section>
      
    </div>
  )
}
