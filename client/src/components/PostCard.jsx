import React, { useState } from 'react'
import Card from './Card'
import Button from './Button'
import Avatar from './Avatar'
import api from '../api/axios'

export default function PostCard({ post, onLike }) {
  const [local, setLocal] = useState(post)
  const [loading, setLoading] = useState(false)

  async function toggleLike() {
    setLoading(true)
    try {
      const res = await api.put(`/posts/${post._id || post.id}/like`)
      // if API returns updated fields
      if (res.data && (res.data.likesCount !== undefined || res.data.liked !== undefined)) {
        setLocal(prev => ({ ...prev, likesCount: res.data.likesCount ?? prev.likesCount, liked: res.data.liked ?? !prev.liked }))
        onLike && onLike(res.data)
      } else {
        // fallback: toggle locally
        setLocal(prev => ({ ...prev, liked: !prev.liked, likesCount: (prev.liked ? (prev.likesCount - 1) : (prev.likesCount + 1)) }))
        onLike && onLike(null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-3">
      <div className="d-flex align-items-start">
        <Avatar src={local.author?.avatar} />
        <div className="ms-3" style={{ flex: 1 }}>
          <div className="d-flex justify-content-between">
            <div>
              <strong>{local.author?.firstName} {local.author?.lastName}</strong>
              <div className="text-muted" style={{ fontSize: 12 }}>{local.author?.headline}</div>
            </div>
          </div>

          <div className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>{local.content}</div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="text-muted">{local.createdAt ? new Date(local.createdAt).toLocaleString() : ''}</div>
            <div>
              <button className={`btn btn-sm me-2 ${local.liked ? 'btn-primary' : 'btn-outline-primary'}`} onClick={toggleLike} disabled={loading}>
                ❤️ {local.likesCount || 0}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
