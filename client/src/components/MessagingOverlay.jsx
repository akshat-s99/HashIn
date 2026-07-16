import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import { io } from 'socket.io-client'

export default function MessagingOverlay() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [unreadTotal, setUnreadTotal] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations')
        setConversations(res.data?.data?.conversations || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchConversations()

    // Simple poll for new messages in overlay (since socket might be on MessagingPage)
    // In a real app, socket connection would be at App level
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [user, isOpen])

  if (!user) return null

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        right: '24px',
        width: '300px',
        backgroundColor: '#fff',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        border: '1px solid var(--color-border)',
        borderBottom: 'none',
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s ease',
        height: isOpen ? '400px' : '48px',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          borderBottom: isOpen ? '1px solid var(--color-border)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
          backgroundColor: '#fff'
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user._id}`} alt="me" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
          <span>Messaging</span>
        </div>
        <div>
          <span style={{ fontSize: '18px' }}>{isOpen ? '↓' : '↑'}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff' }}>
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted" style={{ fontSize: '13px' }}>
            No recent conversations.<br/>
            Start a chat from someone's profile!
          </div>
        ) : (
          conversations.map(conv => (
            <div 
              key={conv._id}
              onClick={() => {
                navigate('/messaging')
              }}
              className="d-flex align-items-center gap-2 px-3 py-2 cursor-pointer hover-bg-light"
              style={{ borderBottom: '1px solid #f3f4f6' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img src={conv.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${conv._id}`} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                  {conv.firstName} {conv.lastName}
                </div>
                <div className="text-truncate" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {conv.lastMessage?.content || 'Started a conversation'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
