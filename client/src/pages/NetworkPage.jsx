import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import { CiMail, CiUser } from 'react-icons/ci'

function UserRow({ user, onAccept, onReject, onRemove, itemId }) {
  if (!user) return null;
  return (
    <div className="glass-panel p-4 mb-3 border border-white/10 rounded-xl flex items-center justify-between">
      <Link to={`/profile/${user._id}`} className="flex items-center text-decoration-none group flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full bg-surface-container border border-white/10 flex-shrink-0 flex items-center justify-center font-label-mono text-label-mono text-on-surface text-uppercase overflow-hidden mr-3">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</>}
        </div>
        <div className="min-w-0 pr-3">
          <strong className="block text-[16px] text-on-surface font-bold truncate group-hover:text-primary transition-colors">{user.firstName} {user.lastName}</strong>
          <div className="text-on-surface-variant mt-1 text-[13px] truncate">{user.headline || 'HashIn Member'}</div>
        </div>
      </Link>
      <div className="flex gap-2 flex-shrink-0">
        {onAccept && <button className="bg-primary text-on-primary rounded-full px-4 py-1.5 font-bold text-[13px] hover:bg-primary/90 transition-colors" onClick={() => onAccept(itemId)}>Accept</button>}
        {onReject && <button className="border border-white/10 bg-white/5 text-on-surface-variant rounded-full px-4 py-1.5 font-bold text-[13px] hover:bg-white/10 hover:text-on-surface transition-colors" onClick={() => onReject(itemId)}>Ignore</button>}
        {onRemove && <button className="border border-error/50 bg-error/10 text-error rounded-full px-4 py-1.5 font-bold text-[13px] hover:bg-error/20 transition-colors" onClick={() => onRemove(itemId)}>Remove</button>}
      </div>
    </div>
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
    <div className="w-full max-w-3xl mx-auto py-lg px-margin-mobile relative z-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-md pb-sm border-b border-white/10">
        <h3 className="font-headline-md font-bold text-on-surface m-0">My Network</h3>
        <div className="flex bg-surface-container rounded-lg p-1 border border-white/10">
          <button 
            className={`px-4 py-1.5 rounded-md font-body-sm transition-colors ${tab === 'pending' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setTab('pending')} 
          >
            Invitations ({pending.length})
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md font-body-sm transition-colors ${tab === 'accepted' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => setTab('accepted')} 
          >
            Connections ({accepted.length})
          </button>
        </div>
      </div>

      <div className="mt-md">
        {tab === 'pending' ? (
          <div>
            {pending.length === 0 ? (
              <div className="glass-panel text-center py-5 border border-white/10 rounded-xl flex flex-col items-center">
                <div className="text-on-surface-variant opacity-50 mb-4">
                  <CiMail size={48} />
                </div>
                <div className="text-on-surface font-body-sm font-medium">No pending invitations</div>
              </div>
            ) : (
              pending.map(p => <UserRow key={p._id || p.id} user={p.senderId} itemId={p._id || p.id} onAccept={() => setStatus(p._id || p.id, 'accepted')} onReject={() => setStatus(p._id || p.id, 'rejected')} />)
            )}
          </div>
        ) : (
          <div>
            {accepted.length === 0 ? (
              <div className="glass-panel text-center py-5 border border-white/10 rounded-xl flex flex-col items-center">
                <div className="text-on-surface-variant opacity-50 mb-4">
                  <CiUser size={48} />
                </div>
                <div className="text-on-surface font-body-sm font-medium">You don't have any connections yet.</div>
              </div>
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
