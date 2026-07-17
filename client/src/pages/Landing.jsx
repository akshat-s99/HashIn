import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CiSearch, CiBellOn, CiStar } from 'react-icons/ci'

export default function Landing() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/feed" replace />
  }

  return (
    <div className="bg-background text-on-background font-body-sm min-h-screen flex flex-col antialiased">
      
<div className="glow-bg"></div>
{/* TopNavBar (Intent: Linear/Transactional landing page - Navigation suppressed as per constraints, but keeping a minimal brand header) */}
<header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-margin-desktop md:px-margin-desktop">
<div className="font-headline-md text-headline-md text-primary font-bold tracking-tight">HashIn</div>
<div className="hidden md:flex gap-md items-center">
<a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm" href="#">Log In</a>
<a className="bg-primary-container text-on-primary-container px-md py-xs rounded-full font-body-sm text-body-sm font-bold" href="#">Sign Up</a>
</div>
</header>
<main className="relative z-10 pt-32 pb-xl px-margin-mobile md:px-margin-desktop flex flex-col items-center max-w-7xl mx-auto">
{/* Hero Section */}
<section className="text-center w-full max-w-4xl flex flex-col items-center gap-md mt-lg mb-xl">
<h1 className="font-headline-lg text-headline-lg md:text-[72px] md:leading-[1.1] font-bold text-on-background tracking-tight">
                Network for Builders.<br/ />Not Buzzwords.
            </h1>
<p className="font-headline-md text-headline-md text-on-surface-variant max-w-2xl mt-sm">
                HashIn is the professional platform built by engineers, for engineers.
            </p>
<div className="flex flex-col sm:flex-row gap-sm mt-lg">
<a className="bg-primary-container text-on-primary-container px-lg py-sm rounded-full font-body-lg text-body-lg font-bold hover:bg-primary transition-colors text-center w-full sm:w-auto" href="#">
                    Get Early Access
                </a>
<a className="glass-card text-on-background px-lg py-sm rounded-full font-body-lg text-body-lg hover:bg-white/5 transition-colors text-center w-full sm:w-auto" href="#">
                    See How It Works
                </a>
</div>
</section>
{/* Feed Preview Component */}
<div className="w-full md:w-3/4 max-w-5xl glass-card rounded-xl p-md mb-xl flex flex-col gap-md relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] z-10 pointer-events-none rounded-xl"></div>
{/* Mock Feed Item 1 */}
<div className="border border-white/5 rounded-lg p-sm bg-surface-dim/50">
<div className="flex items-center gap-sm mb-sm">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-label-mono text-label-mono text-on-surface">JD</div>
<div>
<div className="font-body-sm text-body-sm font-bold text-on-background">Jane Doe</div>
<div className="font-label-mono text-label-mono text-on-surface-variant">Senior Rust Engineer @ TechCorp</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-background mb-sm">Just open-sourced our new distributed caching layer built in Rust. Seeing 40% latency improvements across the board. Check out the repo.</p>
<div className="flex gap-xs">
<span className="glass-card px-xs py-[2px] rounded-full font-label-mono text-label-mono text-on-surface-variant">rust</span>
<span className="glass-card px-xs py-[2px] rounded-full font-label-mono text-label-mono text-on-surface-variant">distributed-systems</span>
</div>
</div>
{/* Mock Feed Item 2 */}
<div className="border border-white/5 rounded-lg p-sm bg-surface-dim/50 opacity-50">
<div className="flex items-center gap-sm mb-sm">
<div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center font-label-mono text-label-mono text-primary">AS</div>
<div>
<div className="font-body-sm text-body-sm font-bold text-on-background">Alex Smith</div>
<div className="font-label-mono text-label-mono text-on-surface-variant">DevOps Lead</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-background mb-sm">Migrating 500 microservices to a new Kubernetes cluster this weekend. Wish me luck.</p>
</div>
</div>
{/* Tech Stack Marquee */}
<div className="w-full mb-xl py-md border-y border-white/5 relative">
<div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
<div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
<div className="marquee-container">
<div className="marquee-content flex gap-md">
{/* Duplicate items for seamless scrolling */}
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">React</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">Rust</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">Go</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">DevOps</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">Kubernetes</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">TypeScript</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">GraphQL</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">PostgreSQL</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">React</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">Rust</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">Go</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">DevOps</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">Kubernetes</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">TypeScript</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">GraphQL</span>
<span className="glass-card px-md py-xs rounded-full font-label-mono text-label-mono text-on-surface-variant">PostgreSQL</span>
</div>
</div>
</div>
{/* Feature Strip */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg w-full max-w-6xl">
<div className="flex flex-col gap-sm">
<div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-primary mb-xs">
<CiSearch />
</div>
<h3 className="font-headline-md text-headline-md text-on-background">Discovery</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Find engineers based on their actual stack, contributions, and verified skills. No fluff, just code.</p>
</div>
<div className="flex flex-col gap-sm">
<div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-primary mb-xs">
<CiStar />
</div>
<h3 className="font-headline-md text-headline-md text-on-background">Technical Feed</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">A curated timeline of technical discussions, architectural debates, and open-source releases.</p>
</div>
<div className="flex flex-col gap-sm">
<div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-primary mb-xs">
<CiStar />
</div>
<h3 className="font-headline-md text-headline-md text-on-background">Smart Matching</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Connect with peers solving similar complex problems or seeking your exact expertise.</p>
</div>
</div>
</main>
{/* Footer Component */}
<footer className="w-full py-xl bg-surface-dim border-t border-white/5 mt-xl">
<div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-7xl mx-auto gap-md md:gap-0">
<div className="font-label-mono text-primary font-bold">
                © 2024 HashIn
            </div>
<div className="flex flex-wrap gap-md font-label-mono text-label-mono text-on-surface-variant">
<a className="underline-offset-4 hover:underline hover:text-on-surface transition-colors" href="#">About</a>
<a className="underline-offset-4 hover:underline hover:text-on-surface transition-colors" href="#">Privacy</a>
<a className="underline-offset-4 hover:underline hover:text-on-surface transition-colors" href="#">Terms</a>
<a className="underline-offset-4 hover:underline hover:text-on-surface transition-colors" href="#">Contact</a>
</div>
</div>
</footer>


    </div>
  )
}
