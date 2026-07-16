import React, { useState, useRef } from 'react'
import { CiImageOn, CiCalendarDate } from 'react-icons/ci'
import Card from './Card'
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
    <div className="card-minimal mb-4" style={{ padding: '16px' }}>
      <div className="d-flex align-items-start gap-3">
        <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?._id}`} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        <div style={{ flex: 1 }}>
          <textarea 
            className="form-control" 
            rows={expanded ? "3" : "1"} 
            style={{ 
              resize: 'none', 
              backgroundColor: 'var(--bg-body)', 
              border: '1px solid var(--color-border)', 
              color: 'var(--color-text-main)', 
              borderRadius: expanded ? '12px' : '20px', 
              padding: '10px 16px', 
              transition: 'all 0.2s ease', 
              minHeight: expanded ? '100px' : '40px', 
              cursor: 'text',
              fontSize: '14px'
            }} 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            onClick={() => setExpanded(true)}
            placeholder="What's on your mind?" 
          />
          {mediaPreview && (
            <div className="mt-2 position-relative" style={{ maxWidth: '300px' }}>
              <img src={mediaPreview} alt="preview" style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              <button 
                className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1 rounded-circle" 
                style={{ width: '28px', height: '28px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}
                onClick={() => { setMedia(null); setMediaPreview('') }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 d-flex justify-content-between align-items-center" style={{ paddingLeft: '56px' }}>
          <div className="d-flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <button 
              className="btn-action-minimal" 
              onClick={() => fileInputRef.current?.click()}
            >
              <CiImageOn size={20} />
              Media
            </button>
            <button className="btn-action-minimal">
              <CiCalendarDate size={20} />
              Event
            </button>
          </div>
          <button className="btn-h-primary" onClick={submit} disabled={loading || (!content.trim() && !media)} style={{ borderRadius: '50px', padding: '6px 20px', fontWeight: 600, fontSize: '13px' }}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      )}
    </div>
  )
}
