import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useToast } from '../contexts/ToastContext'
import { CiUser, CiCircleRemove, CiHeart } from 'react-icons/ci'

function SwipeCard({ user, style, animatingAction }) {
  if (!user) return null

  let animClass = '';
  if (animatingAction === 'like') animClass = 'swipe-out-right';
  if (animatingAction === 'pass') animClass = 'swipe-out-left';

  return (
    <div className={`swipe-card ${animClass}`} style={{ width: '320px', height: '440px', transition: 'all 0.3s ease', ...style }}>
      <Card className="h-100 overflow-hidden d-flex flex-column p-0" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '16px' }}>
        <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user._id}`} alt="avatar" style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
        <div className="p-4 flex-grow-1 overflow-auto d-flex flex-column" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="mb-2">
            <h4 className="mb-1" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-main)' }}>{user.firstName} {user.lastName}</h4>
            <div className="text-muted" style={{ fontSize: '14px', lineHeight: 1.3 }}>{user.headline || 'HashIn Member'}</div>
          </div>
          <p className="mb-3 flex-grow-1" style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--color-text-main)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {user.about || 'No bio provided.'}
          </p>
          <div className="d-flex flex-wrap gap-2 mt-auto">
            {(user.skills || []).slice(0, 3).map(s => <span key={s} style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: 600 }}>{s}</span>)}
            {(user.skills || []).length > 3 && <span style={{ padding: '4px 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>+{user.skills.length - 3}</span>}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function DiscoveryPage() {
  const [stack, setStack] = useState([])
  const [index, setIndex] = useState(0)
  const [matchModal, setMatchModal] = useState(null)
  const [animatingAction, setAnimatingAction] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    async function load() {
      const res = await api.get('/discover/recommendations?limit=10')
      const stackArr = res.data?.data?.recommendations || res.data?.data?.users || []
      setStack(stackArr)
      setIndex(0)
    }
    load()
  }, [])

  async function swipe(action) {
    const top = stack[index]
    if (!top || animatingAction) return

    setAnimatingAction(action)
    
    setTimeout(async () => {
      try {
        const res = await api.post('/discover/swipe', { swipedId: top._id || top.id, action })
        const matchData = res.data?.data || res.data
        if (matchData?.isMatch) setMatchModal(top)
        
        const nextIndex = index + 1;
        setIndex(nextIndex)

        // Load more when we're near the end of the stack
        if (nextIndex >= stack.length - 2) {
          try {
            const moreRes = await api.get('/discover/recommendations?limit=10')
            const moreUsers = moreRes.data?.data?.recommendations || moreRes.data?.data?.users || []
            // Filter out users we already have in the stack
            const newUsers = moreUsers.filter(u => !stack.some(existing => existing._id === u._id))
            if (newUsers.length > 0) {
              setStack(prev => [...prev, ...newUsers])
            }
          } catch (err) {
            console.error('Failed to load more users:', err)
          }
        }
      } catch (e) {
        console.error('Swipe failed:', e)
        addToast('Something went wrong. Please try again.', 'error')
      } finally {
        setAnimatingAction(null)
      }
    }, 300)
  }

  const top = stack[index]
  const next = stack[index + 1]

  return (
    <div className="mx-auto" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <h3 className="mb-4 align-self-start" style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Discover Connections</h3>
      
      <div className="d-flex justify-content-center mb-4" style={{ width: '100%', height: '440px' }}>
        {!top ? (
          <Card className="text-center py-5 h-100 d-flex flex-column align-items-center justify-content-center w-100" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '16px' }}>
            <div style={{ marginBottom: '16px', color: 'var(--color-border)' }}>
              <CiUser size={48} />
            </div>
            <div style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>No more people to discover.<br/>Check back later!</div>
          </Card>
        ) : (
          <div className="position-relative" style={{ width: '320px', height: '440px' }}>
            {stack.map((u, i) => {
              if (i < index || i > index + 1) return null;
              
              const isTop = i === index;
              
              return (
                <div 
                  key={u._id || u.id}
                  style={{ 
                    position: 'absolute', 
                    top: isTop ? 0 : 8, 
                    left: isTop ? 0 : 8, 
                    transform: isTop ? 'scale(1)' : 'scale(0.95)', 
                    zIndex: isTop ? 1 : 0, 
                    opacity: isTop ? 1 : 0.8,
                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <SwipeCard user={u} animatingAction={isTop ? animatingAction : null} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {top && (
        <div className="d-flex justify-content-center gap-3 mt-3 w-100" style={{ maxWidth: '320px' }}>
          <button 
            className="btn flex-fill d-flex align-items-center justify-content-center gap-2" 
            onClick={() => swipe('pass')} 
            disabled={!!animatingAction} 
            style={{ borderRadius: '50px', padding: '12px', fontWeight: 600, fontSize: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', transition: 'all 0.2s' }}
            onMouseOver={(e) => !animatingAction && (e.target.style.backgroundColor = 'var(--bg-body)')}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--bg-card)'}
          >
            <CiCircleRemove size={20} /> 
            <span className="ms-1">Pass</span>
          </button>
          <button 
            className="btn-h-primary flex-fill d-flex align-items-center justify-content-center gap-2" 
            onClick={() => swipe('like')} 
            disabled={!!animatingAction} 
            style={{ borderRadius: '50px', padding: '12px', fontWeight: 600, fontSize: '16px' }}
          >
            <CiHeart size={20} />
            <span className="ms-1">Connect</span>
          </button>
        </div>
      )}

      <Modal open={!!matchModal} onClose={() => setMatchModal(null)}>
        <div className="text-center py-3">
          <div style={{ marginBottom: '24px', color: 'var(--color-primary)' }}>
            <CiHeart size={64} />
          </div>
          <h3 style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: '8px' }}>It's a Match!</h3>
          {matchModal && <p className="mb-4 text-muted" style={{ fontSize: '15px' }}>You and {matchModal.firstName} have both swiped right on each other. A connection request has been accepted automatically.</p>}
          <button className="btn-h-primary w-100" onClick={() => setMatchModal(null)} style={{ borderRadius: '50px', padding: '10px', fontWeight: 600 }}>Awesome</button>
        </div>
      </Modal>
    </div>
  )
}
