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
    <div className="glass-panel rounded-xl p-md flex flex-col gap-md border border-white/10 bg-surface/50">
      <div className="flex gap-sm">
        <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex-shrink-0 flex items-center justify-center font-label-mono text-label-mono text-on-surface text-uppercase overflow-hidden">
          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</>}
        </div>
        <div className="flex-grow">
          <textarea 
            className={`w-full bg-transparent border-none text-body-lg font-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 p-0 resize-none transition-all outline-none ${expanded ? 'h-24' : 'h-10'}`} 
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            onClick={() => setExpanded(true)}
          />
          {mediaPreview && (
            <div className="relative mt-sm rounded-lg overflow-hidden border border-white/10 max-w-sm">
              <img src={mediaPreview} alt="Preview" className="w-full h-auto object-cover" />
              <button 
                onClick={() => { setMedia(null); setMediaPreview('') }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      
      {(expanded || content || media) && (
        <div className="flex justify-between items-center border-t border-white/5 pt-sm">
          <div className="flex gap-xs">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent text-on-surface-variant group">
              <span className="group-hover:text-primary transition-colors"><CiImageOn size={18} /></span>
              <span className="font-label-mono text-label-mono">Media</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent text-on-surface-variant group">
              <span className="group-hover:text-primary transition-colors"><CiCalendarDate size={18} /></span>
              <span className="font-label-mono text-label-mono">Event</span>
            </button>
          </div>
          <button 
            onClick={submit}
            disabled={loading || (!content.trim() && !media)}
            className="bg-primary-container text-on-primary-container font-label-mono text-label-mono px-4 py-2 rounded-full hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      )}
    </div>
  )
}
