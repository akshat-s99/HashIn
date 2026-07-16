import React from 'react'

export default function Modal({ open, onClose, children }) {
  if (!open) return null

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
