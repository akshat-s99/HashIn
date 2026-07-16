import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CiTrash, CiHeart, CiChat1, CiBookmark } from 'react-icons/ci'
import Card from './Card'
import Avatar from './Avatar'
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
  
  // Bookmarks state (assume not bookmarked by default unless passed from parent or user context)
  // Actually, we can check if user.bookmarks contains the post id if we have user.bookmarks in context,
  // but let's just keep a local state for the UI toggle.
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
    <div className="card-minimal">
      <div className="d-flex align-items-start">
        <Link to={`/profile/${author._id}`}>
          <img src={author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${author._id}`} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
        </Link>
        <div className="ms-3" style={{ flex: 1 }}>
          <div className="d-flex justify-content-between align-items-start">
            <Link to={`/profile/${author._id}`} style={{ textDecoration: 'none' }}>
              <strong style={{ fontSize: '15px', color: 'var(--color-text-main)' }}>{author.firstName} {author.lastName}</strong>
              <div className="text-muted" style={{ fontSize: '13px', marginTop: '2px', lineHeight: 1.2 }}>{author.headline}</div>
            </Link>
            <div className="d-flex align-items-center gap-2">
              <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>{local.createdAt ? timeAgo(local.createdAt) : ''}</div>
              {isOwner && (
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="btn btn-sm text-danger p-0 ms-2" 
                  style={{ background: 'transparent', border: 'none' }}
                  title="Delete post"
                >
                  <CiTrash size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3" style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', color: 'var(--color-text-main)' }}>
        {local.content}
      </div>

      {local.mediaUrl && (
        <div className="mt-3">
          <img 
            src={local.mediaUrl} 
            alt="Post content" 
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--color-border)' }} 
            loading="lazy"
          />
        </div>
      )}

      <div className="d-flex align-items-center mt-3 gap-2">
        <button 
          className={`btn-action-minimal flex-fill justify-content-center ${local.liked ? 'active' : ''}`}
          onClick={toggleLike}
          disabled={loading}
        >
          <CiHeart size={20} />
          {local.likesCount || 0}
        </button>
        <button 
          className="btn-action-minimal flex-fill justify-content-center"
          onClick={async () => { setExpanded(!expanded); if (!expanded) await loadComments(); }}
        >
          <CiChat1 size={20} />
          {comments ? comments.length : (local.comments?.length || 0)}
        </button>
        <button 
          className={`btn-action-minimal flex-fill justify-content-center ${isBookmarked ? 'active' : ''}`}
          onClick={toggleBookmark}
        >
          <CiBookmark size={20} />
        </button>
      </div>

      {expanded && (
        <div className="mt-3">
          <div className="d-flex gap-2 align-items-center mb-4">
            <input 
              className="form-control rounded-pill" 
              value={commentInput} 
              onChange={e => setCommentInput(e.target.value)} 
              placeholder="Add a comment..." 
              style={{ fontSize: '14px', padding: '10px 20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}
            />
            <button className="btn-h-primary" onClick={submitComment} disabled={postingComment || !commentInput.trim()} style={{ borderRadius: '50px', padding: '8px 20px', fontWeight: 600, fontSize: '14px' }}>
              {postingComment ? '...' : 'Post'}
            </button>
          </div>

          <div>
            {(comments || []).map(c => (
              <div key={c._id} className="mb-3 d-flex align-items-start gap-2">
                <img src={c.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.author?.firstName}`} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1, backgroundColor: 'var(--bg-body)', padding: '12px 16px', borderRadius: '0px 12px 12px 12px', border: '1px solid var(--color-border)' }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <strong style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>{c.author?.firstName} {c.author?.lastName}</strong>
                    <div className="text-muted" style={{ fontSize: '11px' }}>{c.createdAt ? new Date(c.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                  </div>
                  <div className="mt-1" style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>{c.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
