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
    <article className="glass-panel rounded-xl flex flex-col mb-4 border border-white/10 bg-surface/50">
      <div className="p-md flex flex-col gap-sm">
        {/* Author Row */}
        <div className="flex justify-between items-start">
          <Link to={`/profile/${author._id}`} className="flex gap-sm items-center text-decoration-none group">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex-shrink-0 flex items-center justify-center font-label-mono text-label-mono text-on-surface text-uppercase overflow-hidden">
              {author.avatar ? <img src={author.avatar} className="w-full h-full object-cover" /> : <>{author.firstName?.charAt(0)}{author.lastName?.charAt(0)}</>}
            </div>
            <div>
              <div className="font-body-sm text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">{author.firstName} {author.lastName}</div>
              <div className="font-label-mono text-label-mono text-on-surface-variant">{author.headline} • {local.createdAt ? timeAgo(local.createdAt) : ''}</div>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {isOwner && (
              <button onClick={handleDelete} disabled={loading} className="text-error hover:bg-error/10 p-1.5 rounded-full transition-colors" title="Delete post">
                <CiTrash size={20} />
              </button>
            )}
            <button className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-white/5 transition-colors">
              <CiMenuKebab size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">
          {local.content}
        </div>

        {/* Media */}
        {local.mediaUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
            <img src={local.mediaUrl} alt="Post content" className="w-full max-h-[400px] object-cover" loading="lazy" />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center gap-md mt-xs pt-sm border-t border-white/5">
          <button onClick={toggleLike} disabled={loading} className={`flex items-center gap-2 transition-colors group ${local.liked ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            <span className="group-hover:scale-110 transition-transform"><CiHeart size={20} /></span>
            <span className="font-label-mono text-label-mono">{local.likesCount || 0}</span>
          </button>
          <button onClick={async () => { setExpanded(!expanded); if (!expanded) await loadComments(); }} className={`flex items-center gap-2 transition-colors group ${expanded ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            <span className="group-hover:scale-110 transition-transform"><CiChat1 size={20} /></span>
            <span className="font-label-mono text-label-mono">{comments ? comments.length : (local.comments?.length || 0)}</span>
          </button>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors group">
            <span className="group-hover:scale-110 transition-transform"><CiShare1 size={20} /></span>
          </button>
          
          <div className="flex-grow"></div>
          
          <button onClick={toggleBookmark} className={`transition-colors group ${isBookmarked ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            <span className="group-hover:scale-110 transition-transform"><CiBookmark size={20} /></span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {expanded && (
        <div className="px-md pb-md bg-surface-container-lowest/50 rounded-b-xl border-t border-white/5">
          <div className="flex gap-2 align-items-center mb-4 mt-md">
            <input 
              className="w-full h-10 pl-sm pr-sm bg-surface border border-white/10 rounded-full text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder-on-surface-variant/50 transition-colors outline-none"
              value={commentInput} 
              onChange={e => setCommentInput(e.target.value)} 
              placeholder="Add a comment..." 
            />
            <button className="bg-primary/20 text-primary hover:bg-primary hover:text-on-primary font-label-mono text-label-mono px-4 py-2 rounded-full transition-colors disabled:opacity-50 font-bold" onClick={submitComment} disabled={postingComment || !commentInput.trim()}>
              {postingComment ? '...' : 'Reply'}
            </button>
          </div>

          <div className="flex flex-col gap-sm mt-md">
            {(comments || []).map(c => (
              <div key={c._id} className="flex gap-sm items-start">
                <div className="w-8 h-8 rounded-full bg-surface-container border border-white/10 flex-shrink-0 flex items-center justify-center font-label-mono text-label-mono text-on-surface text-uppercase overflow-hidden text-[10px]">
                  {c.author?.avatar ? <img src={c.author.avatar} className="w-full h-full object-cover" /> : <>{c.author?.firstName?.charAt(0)}{c.author?.lastName?.charAt(0)}</>}
                </div>
                <div className="flex-1 bg-surface-dim p-sm rounded-2xl rounded-tl-sm border border-white/5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-body-sm font-bold text-on-surface text-[13px]">{c.author?.firstName} {c.author?.lastName}</span>
                    <span className="font-label-mono text-on-surface-variant text-[11px]">{c.createdAt ? timeAgo(c.createdAt) : ''}</span>
                  </div>
                  <div className="font-body-sm text-on-surface text-[14px] leading-snug">{c.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
