import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Card from '../components/Card'
import Button from '../components/Button'

function UserRow({ item, onAccept, onReject, onRemove }) {
  return (
    <Card className="mb-2">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <strong>{item.user?.firstName || item.firstName} {item.user?.lastName || item.lastName}</strong>
          <div className="text-muted">{item.user?.headline || item.headline}</div>
        </div>
        <div>
          {onAccept && <button className="btn btn-sm btn-primary me-2" onClick={() => onAccept(item._id || item.id)}>Accept</button>}
          {onReject && <button className="btn btn-sm btn-outline-light me-2" onClick={() => onReject(item._id || item.id)}>Reject</button>}
          {onRemove && <button className="btn btn-sm btn-danger" onClick={() => onRemove(item._id || item.id)}>Remove</button>}
        </div>
      </div>
    </Card>
  )
}

export default function NetworkPage() {
  const [tab, setTab] = useState('pending')
  const [pending, setPending] = useState([])
  const [accepted, setAccepted] = useState([])

  useEffect(() => { load(tab) }, [tab])

  async function load(status) {
    try {
      const res = await api.get(`/connections?status=${status}`)
      if (status === 'pending') setPending(res.data || [])
      else setAccepted(res.data || [])
    } catch (e) { console.error(e) }
  }

  async function setStatus(id, status) {
    try {
      await api.put(`/connections/${id}/status`, { status })
      load('pending')
      load('accepted')
    } catch (e) { console.error(e) }
  }

  async function remove(id) {
    try {
      await api.delete(`/connections/${id}`)
      load('accepted')
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <h2>Network</h2>
      <div className="mb-3">
        <button className={`btn btn-sm me-2 ${tab==='pending'? 'btn-h-primary' : 'btn-outline-light'}`} onClick={() => setTab('pending')}>Pending Requests</button>
        <button className={`btn btn-sm ${tab==='accepted'? 'btn-h-primary' : 'btn-outline-light'}`} onClick={() => setTab('accepted')}>My Connections</button>
      </div>

      {tab === 'pending' ? (
        <div>
          {pending.length === 0 ? <div className="text-muted">No pending requests</div> : pending.map(p => <UserRow key={p._id || p.id} item={p} onAccept={() => setStatus(p._id || p.id, 'accepted')} onReject={() => setStatus(p._id || p.id, 'rejected')} />)}
        </div>
      ) : (
        <div>
          {accepted.length === 0 ? <div className="text-muted">No connections yet</div> : accepted.map(c => <UserRow key={c._id || c.id} item={c} onRemove={() => remove(c._id || c.id)} />)}
        </div>
      )}
    </div>
  )
}
