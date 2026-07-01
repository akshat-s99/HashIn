import React from 'react'

export default function Card({ children, className = '' }) {
  return <div className={`hashin-card ${className}`}>{children}</div>
}
