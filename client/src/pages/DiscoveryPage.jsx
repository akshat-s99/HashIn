import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import { useToast } from '../contexts/ToastContext'
import { CiUser, CiCircleRemove, CiHeart } from 'react-icons/ci'

function SwipeCard({ user, style, animatingAction }) {
  if (!user) return null

  let animClass = '';
  if (animatingAction === 'like') animClass = 'translate-x-full opacity-0 rotate-12';
  if (animatingAction === 'pass') animClass = '-translate-x-full opacity-0 -rotate-12';

  return (
    <div className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ${animClass}`} style={style}>
      <div className="glass-panel h-full overflow-hidden flex flex-col p-0 border border-white/10 rounded-2xl relative">
        <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user._id}`} alt="avatar" className="w-full h-[260px] object-cover bg-surface-container" />
        <div className="absolute top-[240px] left-0 w-full h-12 bg-gradient-to-t from-surface-dim to-transparent"></div>
        <div className="p-md flex-1 overflow-auto flex flex-col bg-surface-dim z-10">
          <div className="mb-2">
            <h4 className="font-headline-md font-bold text-on-surface mb-1">{user.firstName} {user.lastName}</h4>
            <div className="font-label-mono text-primary">{user.headline || 'HashIn Member'}</div>
          </div>
          <p className="mb-3 flex-1 font-body-sm text-on-surface-variant line-clamp-3">
            {user.about || 'No bio provided.'}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {(user.skills || []).slice(0, 3).map(s => <span key={s} className="font-code-block text-[11px] px-3 py-1 rounded-full border border-white/10 bg-surface-container-high text-on-surface">{s}</span>)}
            {(user.skills || []).length > 3 && <span className="text-[11px] text-on-surface-variant py-1">+{user.skills.length - 3}</span>}
          </div>
        </div>
      </div>
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
    <div className="w-full max-w-[400px] mx-auto py-xl px-margin-mobile flex flex-col items-center">
      <h3 className="mb-md self-start font-headline-md font-bold text-on-surface">Discover Connections</h3>
      
      <div className="flex justify-center mb-md w-full h-[460px] relative">
        {!top ? (
          <div className="glass-panel text-center py-5 h-full flex flex-col items-center justify-center w-full border border-white/10 rounded-2xl">
            <div className="text-on-surface-variant/50 mb-4">
              <CiUser size={48} />
            </div>
            <div className="text-on-surface-variant font-body-sm text-center">No more people to discover.<br/>Check back later!</div>
          </div>
        ) : (
          <div className="relative w-full h-full perspective-1000">
            {stack.map((u, i) => {
              if (i < index || i > index + 1) return null;
              
              const isTop = i === index;
              
              return (
                <SwipeCard 
                  key={u._id || u.id} 
                  user={u} 
                  animatingAction={isTop ? animatingAction : null} 
                  style={{ 
                    zIndex: isTop ? 10 : 0, 
                    transform: isTop ? 'scale(1)' : 'scale(0.95) translateY(10px)', 
                    opacity: isTop ? 1 : 0.8
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {top && (
        <div className="flex justify-center gap-md mt-sm w-full">
          <button 
            className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-4 font-bold text-[16px] glass-panel border border-white/10 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
            onClick={() => swipe('pass')} 
            disabled={!!animatingAction}
          >
            <CiCircleRemove size={24} /> 
            <span>Pass</span>
          </button>
          <button 
            className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-4 font-bold text-[16px] bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
            onClick={() => swipe('like')} 
            disabled={!!animatingAction}
          >
            <CiHeart size={24} />
            <span>Connect</span>
          </button>
        </div>
      )}

      <Modal open={!!matchModal} onClose={() => setMatchModal(null)}>
        <div className="text-center py-md flex flex-col items-center">
          <div className="text-primary mb-md animate-bounce">
            <CiHeart size={64} />
          </div>
          <h3 className="text-on-surface font-headline-md font-bold mb-2">It's a Match!</h3>
          {matchModal && <p className="mb-md text-on-surface-variant font-body-sm">You and {matchModal.firstName} have both swiped right on each other. A connection request has been accepted automatically.</p>}
          <button className="bg-primary text-on-primary font-bold rounded-full py-2 px-6 w-full" onClick={() => setMatchModal(null)}>Awesome</button>
        </div>
      </Modal>
    </div>
  )
}
