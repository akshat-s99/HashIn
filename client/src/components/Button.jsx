import React from 'react'

export default function Button({ children, className = '', ...props }) {
  return (
    <button className={`btn-h-primary ${className}`} {...props}>
      {children}
    </button>
  )
}
