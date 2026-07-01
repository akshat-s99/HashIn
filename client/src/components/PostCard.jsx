import React, { useState } from 'react'
import Card from './Card'
import Button from './Button'
import Avatar from './Avatar'
import api from '../api/axios'

export default function PostCard({ post, onLike }) {
  const [local, setLocal] = useState(post)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [postingComment, setPostingComment] = useState(false)

  async function toggleLike() {
    // optimistic update
    const prev = { liked: local.liked, likesCount: local.likesCount || 0 }
    setLocal(prevState => ({ ...prevState, liked: !prevState.liked, likesCount: prevState.liked ? (prevState.likesCount - 1) : (prevState.likesCount + 1) }))
    setLoading(true)
    try {
      const res = await api.put(`/posts/${post._id || post.id}/like`)
      if (res.data && (res.data.likesCount !== undefined || res.data.liked !== undefined)) {
        setLocal(prevState => ({ ...prevState, likesCount: res.data.likesCount ?? prevState.likesCount, liked: res.data.liked ?? prevState.liked }))
        onLike && onLike(res.data)
      }
    } catch (e) {
      console.error(e)
      // revert optimistic
      setLocal(prevState => ({ ...prevState, liked: prev.liked, likesCount: prev.likesCount }))
    } finally {
      setLoading(false)
      // brief animation by toggling a class via state update (handled by CSS)
      // we simply rely on the like button style change
    }
  }

  async function loadComments() {
    if (comments !== null) return
    try {
      const res = await api.get(`/posts/${post._id || post.id}`)
      setComments(res.data.comments || [])
    } catch (e) {
      console.error(e)
      setComments([])
    }
  }

  async function submitComment() {
    if (!commentInput.trim()) return
    setPostingComment(true)
    const temp = { _id: `temp-${Date.now()}`, content: commentInput, author: { firstName: 'You' }, createdAt: new Date().toISOString() }
    setComments(prev => (prev || []).concat([temp]))
    setCommentInput('')
    try {
      const res = await api.post(`/posts/${post._id || post.id}/comments`, { content: temp.content })
      // replace temp with server comment if returned
      if (res.data) {
        setComments(prev => prev.map(c => c._id === temp._id ? res.data : c))
      }
    } catch (e) {
      console.error(e)
      // leave temp comment but could mark as failed
      alert('Failed to post comment')
    } finally {
      setPostingComment(false)
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
              <button className={`btn btn-sm me-2 ${local.liked ? 'btn-primary like-animate' : 'btn-outline-primary'}`} onClick={toggleLike} disabled={loading}>
                ❤️ {local.likesCount || 0}
              </button>
              <button className="btn btn-sm btn-outline-light" onClick={async () => { setExpanded(e => !e); if (!expanded) await loadComments() }}>
                💬 {comments ? comments.length : ''}
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-3">
              <div>
                {(comments || []).map(c => (
                  <div key={c._id} className="mb-2">
                    <strong style={{ fontSize: 13 }}>{c.author?.firstName}</strong>
                    <div style={{ fontSize: 14 }}>{c.content}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 mt-2">
                <input className="form-control" value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Write a comment..." />
                <button className="btn btn-h-primary" onClick={submitComment} disabled={postingComment || !commentInput.trim()}>{postingComment ? 'Posting...' : 'Comment'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
