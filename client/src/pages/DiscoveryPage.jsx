import React, { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'

function SwipeCard({ user, style }) {
  if (!user) return null
  return (
    <div style={{ width: '320px', height: '420px', ...style }}>
      <Card>
        <img src={user.avatar} alt="avatar" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius:8 }} />
        <h4 className="mt-2">{user.firstName} {user.lastName}</h4>
        <div className="text-muted">{user.headline}</div>
        <p className="mt-2">{user.about}</p>
        <div>
          {user.skills?.map(s => <span key={s} className="me-2 badge bg-light text-dark skill-tag">{s}</span>)}
        </div>
      </Card>
    </div>
  )
}

export default function DiscoveryPage() {
  const [stack, setStack] = useState([])
  const [index, setIndex] = useState(0)
  const [matchModal, setMatchModal] = useState(null)

  useEffect(() => {
    async function load() {
      const res = await api.get('/discover/recommendations?limit=10')
      setStack(res.data)
      setIndex(0)
    }
    load()
  }, [])

  async function swipe(action) {
    const top = stack[index]
    if (!top) return
    const res = await api.post('/discover/swipe', { swipedId: top._id || top.id, action })
    if (res.data?.isMatch) setMatchModal(top)
    setIndex(i => i + 1)
  }

  const top = stack[index]
  const next = stack[index + 1]

  return (
    <div>
      <div className="d-flex justify-content-center mb-3">
        <div className="position-relative">
          {next && <div className="position-absolute" style={{ top: 12, left: 12, transform: 'scale(0.98)' }}><SwipeCard user={next} /></div>}
          <div><SwipeCard user={top} /></div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <Button variant="light" onClick={() => swipe('pass')}>Pass</Button>
        <Button onClick={() => swipe('like')}>Like</Button>
      </div>

      <Modal open={!!matchModal} onClose={() => setMatchModal(null)}>
        <h3>You matched!</h3>
        {matchModal && <p>Say hi to {matchModal.firstName}.</p>}
        <div className="d-flex gap-2">
          <Button onClick={() => setMatchModal(null)}>Close</Button>
        </div>
      </Modal>
    </div>
  )
}
