import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CiTrash, CiHeart, CiChat1, CiBookmark, CiMenuKebab, CiShare1 } from 'react-icons/ci'
import api from '../api/axios'
import { timeAgo } from '../utils/timeAgo'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function PostCard({ post, onLike, onDelete }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [local, setLocal] = useState(post)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [commentInput, setCommentInput] = useState('')
  const [postingComment, setPostingComment] = useState(false)
  
  const [isBookmarked, setIsBookmarked] = useState(
    user?.bookmarks?.includes(post._id || post.id) || false
  )

  const author = local.author || local.authorId || {};
  const isOwner = user && author._id === user._id;

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setLoading(true);
    try {
      await api.delete(`/posts/${post._id || post.id}`);
      onDelete && onDelete(post._id || post.id);
    } catch (e) {
      console.error(e);
      addToast('Failed to delete post', 'error');
      setLoading(false);
    }
  }

  async function toggleLike() {
    const prev = { liked: local.liked, likesCount: local.likesCount || 0 }
    setLocal(prevState => ({ ...prevState, liked: !prevState.liked, likesCount: prevState.liked ? (prevState.likesCount - 1) : (prevState.likesCount + 1) }))
    setLoading(true)
    try {
      const res = await api.put(`/posts/${post._id || post.id}/like`)
      const updatedPost = res.data?.data?.post || res.data?.post || res.data
      if (updatedPost && (updatedPost.likesCount !== undefined || updatedPost.liked !== undefined)) {
        setLocal(prevState => ({ ...prevState, likesCount: updatedPost.likesCount ?? prevState.likesCount, liked: updatedPost.liked ?? prevState.liked }))
        onLike && onLike(updatedPost)
      }
    } catch (e) {
      console.error(e)
      setLocal(prevState => ({ ...prevState, liked: prev.liked, likesCount: prev.likesCount }))
    } finally {
      setLoading(false)
    }
  }

  async function toggleBookmark() {
    setIsBookmarked(!isBookmarked)
    try {
      const res = await api.post(`/posts/${post._id || post.id}/bookmark`)
      setIsBookmarked(res.data?.data?.isBookmarked)
    } catch (e) {
      console.error(e)
      setIsBookmarked(isBookmarked) // revert on error
    }
  }

  async function loadComments() {
    if (comments !== null) return
    try {
      const res = await api.get(`/posts/${post._id || post.id}`)
      const fetchedPost = res.data?.data?.post || res.data?.post || res.data
      setComments(fetchedPost.comments || [])
    } catch (e) {
      console.error(e)
      setComments([])
    }
  }

  async function submitComment() {
    if (!commentInput.trim()) return
    setPostingComment(true)
    const temp = { _id: `temp-${Date.now()}`, content: commentInput, author: { firstName: 'You', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=You` }, createdAt: new Date().toISOString() }
    setComments(prev => (prev || []).concat([temp]))
    setCommentInput('')
    try {
      const res = await api.post(`/posts/${post._id || post.id}/comments`, { content: temp.content })
      const newComment = res.data?.data?.comment || res.data?.comment || res.data
      if (newComment) {
        setComments(prev => prev.map(c => c._id === temp._id ? newComment : c))
      }
    } catch (e) {
      console.error(e)
      addToast('Failed to post comment', 'error')
    } finally {
      setPostingComment(false)
    }
  }

  if (!local) return null;

  return (
    <article className="card-minimal mb-4" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-card)' }}>
      {/* Header */}
      <div className="d-flex align-items-start mb-3" style={{ gap: '16px' }}>
        <Link to={`/profile/${author._id}`} className="text-decoration-none">
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--bg-body)' }}>
            {author.avatar ? <img src={author.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="d-flex align-items-center justify-content-center h-100 text-uppercase fw-bold text-muted">{author.firstName?.charAt(0)}{author.lastName?.charAt(0)}</div>}
          </div>
        </Link>
        <div style={{ flex: 1 }}>
          <div className="d-flex justify-content-between align-items-start">
            <Link to={`/profile/${author._id}`} className="text-decoration-none" style={{ color: 'var(--color-text-main)' }}>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{author.firstName} {author.lastName}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{author.headline || 'Developer'} • {local.createdAt ? timeAgo(local.createdAt) : ''}</div>
            </Link>
            
            <div className="d-flex align-items-center gap-2">
              {isOwner && (
                <button onClick={handleDelete} disabled={loading} className="btn-action-minimal" style={{ color: 'var(--color-danger)' }} title="Delete post">
                  <CiTrash size={18} />
                </button>
              )}
              <button className="btn-action-minimal" title="More">
                <CiMenuKebab size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ fontSize: '15px', color: 'var(--color-text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
        {local.content}
      </div>

      {/* Media */}
      {local.mediaUrl && (
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
          <img src={local.mediaUrl} alt="Post content" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} loading="lazy" />
        </div>
      )}

      {/* Stats */}
      <div className="d-flex align-items-center gap-4 py-2" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
        <span>{local.likesCount || 0} likes</span>
        <span>{comments ? comments.length : (local.comments?.length || 0)} comments</span>
        <div className="flex-grow-1"></div>
        <button onClick={toggleBookmark} className="btn-action-minimal" style={{ padding: 0 }}>
          <CiBookmark size={18} style={{ color: isBookmarked ? 'var(--color-primary)' : 'inherit' }} />
        </button>
      </div>

      {/* Action Bar */}
      <div className="d-flex justify-content-around">
        <button onClick={toggleLike} disabled={loading} className={`btn-action-minimal flex-grow-1 justify-content-center ${local.liked ? 'active' : ''}`} style={{ padding: '8px' }}>
          <CiHeart size={20} /> Like
        </button>
        <button onClick={async () => { setExpanded(!expanded); if (!expanded) await loadComments(); }} className={`btn-action-minimal flex-grow-1 justify-content-center ${expanded ? 'active' : ''}`} style={{ padding: '8px' }}>
          <CiChat1 size={20} /> Comment
        </button>
        <button className="btn-action-minimal flex-grow-1 justify-content-center" style={{ padding: '8px' }}>
          <CiShare1 size={20} /> Share
        </button>
      </div>

      {/* Comments Section */}
      {expanded && (
      {expanded && (
        <div style={{ backgroundColor: 'var(--bg-body)', margin: '-24px', marginTop: '16px', padding: '24px', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)', borderTop: '1px solid var(--color-border)' }}>
          <div className="d-flex gap-2 align-items-center mb-4">
            <input 
              className="form-control rounded-pill"
              value={commentInput} 
              onChange={e => setCommentInput(e.target.value)} 
              placeholder="Add a comment..." 
            />
            <button className="btn-h-primary" onClick={submitComment} disabled={postingComment || !commentInput.trim()} style={{ padding: '8px 20px' }}>
              {postingComment ? '...' : 'Reply'}
            </button>
          </div>

          <div className="d-flex flex-column gap-3">
            {(comments || []).map(c => (
              <div key={c._id} className="d-flex gap-3 align-items-start">
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-nav)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '12px', fontWeight: 600 }}>
                  {c.author?.avatar ? <img src={c.author.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <>{c.author?.firstName?.charAt(0)}{c.author?.lastName?.charAt(0)}</>}
                </div>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '12px 16px', borderRadius: 'var(--radius-md)', borderTopLeftRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-text-main)' }}>{c.author?.firstName} {c.author?.lastName}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{c.createdAt ? timeAgo(c.createdAt) : ''}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-main)', lineHeight: 1.5 }}>{c.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
