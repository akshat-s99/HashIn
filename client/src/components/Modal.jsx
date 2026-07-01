import React from 'react'

export default function Modal({ children }) {
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}
