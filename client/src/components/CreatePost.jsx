import React, { useState, useRef } from 'react'
import { CiImageOn, CiCalendarDate } from 'react-icons/ci'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function CreatePost({ onPosted }) {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [content, setContent] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setMedia(file)
      setMediaPreview(URL.createObjectURL(file))
      setExpanded(true)
    }
  }

  async function submit() {
    if (!content.trim() && !media) return
    if (content.length > 500) {
      addToast('Max 500 characters', 'error')
      return
    }
    setLoading(true)
    try {
      let reqBody;
      let headers = {};
      
      if (media) {
        reqBody = new FormData();
        reqBody.append('content', content);
        reqBody.append('media', media);
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        reqBody = { content };
      }

      const res = await api.post('/posts', reqBody, { headers })
      setContent('')
      setMedia(null)
      setMediaPreview('')
      setExpanded(false)
      const newPost = res.data?.data?.post || res.data?.post || res.data
      onPosted && onPosted(newPost)
      addToast('Post published', 'success')
    } catch (e) {
      console.error(e)
      addToast('Failed to post', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-minimal mb-4" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
      <div className="d-flex align-items-start" style={{ gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontWeight: 600, fontSize: '13px' }}>
          {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" /> : <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>}
        </div>
        <div style={{ flexGrow: 1 }}>
          <textarea 
            className="form-control"
            style={{ width: '100%', border: 'none', backgroundColor: 'transparent', resize: 'none', padding: 0, outline: 'none', boxShadow: 'none', fontSize: '15px', color: 'var(--color-text-main)', height: expanded ? '96px' : '40px', transition: 'height 0.2s ease' }} 
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            onClick={() => setExpanded(true)}
          />
          {mediaPreview && (
            <div style={{ position: 'relative', marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', maxWidth: '100%' }}>
              <img src={mediaPreview} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              <button 
                onClick={() => { setMedia(null); setMediaPreview('') }}
                style={{ position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      
      {(expanded || content || media) && (
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="d-flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            <button onClick={() => fileInputRef.current?.click()} className="btn-action-minimal">
              <CiImageOn size={18} />
              <span>Media</span>
            </button>
            <button className="btn-action-minimal">
              <CiCalendarDate size={18} />
              <span>Event</span>
            </button>
          </div>
          <button 
            onClick={submit}
            disabled={loading || (!content.trim() && !media)}
            className="btn-h-primary"
            style={{ padding: '8px 24px' }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      )}
    </div>
  )
}
