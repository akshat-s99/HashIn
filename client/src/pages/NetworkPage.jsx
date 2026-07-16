import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { CiMail, CiUser } from 'react-icons/ci'

function UserRow({ user, onAccept, onReject, onRemove, itemId }) {
  if (!user) return null;
  return (
    <Card className="mb-3" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', padding: '16px 20px', borderRadius: '12px' }}>
      <div className="d-flex align-items-center justify-content-between">
        <Link to={`/profile/${user._id}`} className="d-flex align-items-center text-decoration-none" style={{ color: 'var(--color-text-main)' }}>
          <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user._id}`} alt="avatar" className="me-3" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--color-border)' }} />
          <div>
            <strong style={{ fontSize: '16px', color: 'var(--color-text-main)', fontWeight: 600 }}>{user.firstName} {user.lastName}</strong>
            <div className="text-muted mt-1" style={{ fontSize: '14px', lineHeight: 1.3 }}>{user.headline || 'HashIn Member'}</div>
          </div>
        </Link>
        <div className="d-flex gap-2">
          {onAccept && <button className="btn-h-primary" onClick={() => onAccept(itemId)} style={{ borderRadius: '50px', padding: '6px 20px', fontWeight: 600, fontSize: '14px' }}>Accept</button>}
          {onReject && <button className="btn btn-sm" onClick={() => onReject(itemId)} style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-main)', borderRadius: '50px', padding: '6px 20px', fontWeight: 600, fontSize: '14px', border: '1px solid var(--color-border)' }}>Ignore</button>}
          {onRemove && <button className="btn btn-sm" onClick={() => onRemove(itemId)} style={{ backgroundColor: 'var(--bg-card)', color: '#dc2626', borderRadius: '50px', padding: '6px 20px', fontWeight: 600, fontSize: '14px', border: '1px solid #fca5a5' }}>Remove</button>}
        </div>
      </div>
    </Card>
  )
}

export default function NetworkPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('pending')
  const [pending, setPending] = useState([])
  const [accepted, setAccepted] = useState([])

  useEffect(() => { load(tab) }, [tab])

  async function load(status) {
    try {
      const res = await api.get(`/connections?status=${status}`)
      const dataArr = res.data?.data?.connections || res.data?.data || res.data || []
      if (status === 'pending') {
        const incoming = dataArr.filter(c => String(c.receiverId?._id || c.receiverId?.id || c.receiverId) === String(user?._id || user?.id))
        setPending(incoming)
      } else {
        setAccepted(dataArr)
      }
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
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-end mb-4 pb-2 border-bottom">
        <h3 className="m-0" style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>My Network</h3>
        <div className="segmented-control" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--bg-body)' }}>
          <button 
            className={`btn ${tab === 'pending' ? 'active' : ''}`}
            onClick={() => setTab('pending')} 
          >
            Invitations ({pending.length})
          </button>
          <button 
            className={`btn ${tab === 'accepted' ? 'active' : ''}`}
            onClick={() => setTab('accepted')} 
          >
            Connections ({accepted.length})
          </button>
        </div>
      </div>

      <div className="mt-4">
        {tab === 'pending' ? (
          <div>
            {pending.length === 0 ? (
              <Card className="text-center py-5" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px', color: 'var(--color-border)' }}>
                  <CiMail size={48} />
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>No pending invitations</div>
              </Card>
            ) : (
              pending.map(p => <UserRow key={p._id || p.id} user={p.senderId} itemId={p._id || p.id} onAccept={() => setStatus(p._id || p.id, 'accepted')} onReject={() => setStatus(p._id || p.id, 'rejected')} />)
            )}
          </div>
        ) : (
          <div>
            {accepted.length === 0 ? (
              <Card className="text-center py-5" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
                <div style={{ marginBottom: '16px', color: 'var(--color-border)' }}>
                  <CiUser size={48} />
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>You don't have any connections yet.</div>
              </Card>
            ) : (
              accepted.map(c => {
                const isSender = String(c.senderId?._id || c.senderId?.id || c.senderId) === String(user?._id || user?.id);
                const otherUser = isSender ? c.receiverId : c.senderId;
                return <UserRow key={c._id || c.id} user={otherUser} itemId={c._id || c.id} onRemove={() => remove(c._id || c.id)} />
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
