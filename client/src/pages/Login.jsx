import React from 'react'
import LoginForm from '../components/LoginForm'

export default function Login() {
  return (
    <main className="flex-grow flex flex-col md:flex-row min-h-screen w-full bg-background">
      {/* Left Panel: Brand & Atmosphere */}
      <section className="hidden md:flex flex-col justify-center items-center w-1/2 bg-surface-container-lowest relative p-xl border-r border-white/5">
        <div className="absolute top-margin-desktop left-margin-desktop">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">HashIn</h1>
        </div>
        <div className="max-w-md text-center z-10">
          <p className="font-headline-md text-headline-md text-on-surface mb-md">
            "Where great engineers meet."
          </p>
          <div className="h-px w-16 bg-primary mx-auto opacity-50"></div>
        </div>
        <div className="absolute bottom-margin-desktop left-margin-desktop text-on-surface-variant font-label-mono text-label-mono opacity-70">
          // SYSTEM_READY
        </div>
      </section>

      {/* Right Panel: Login Form Area */}
      <section className="w-full md:w-1/2 bg-[#161B22] flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop relative">
        {/* Mobile Brand Logo */}
        <div className="md:hidden absolute top-margin-mobile left-margin-mobile">
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">HashIn</h1>
        </div>
        
        <LoginForm />
        
        {/* Subtle atmospheric overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-surface-dim/20 to-transparent z-0"></div>
      </section>
    </main>
  )
}
