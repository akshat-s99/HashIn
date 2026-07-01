import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'
import api from '../api/axios'

export default function CreatePost({ onPosted }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!content.trim()) return
    if (content.length > 500) return alert('Max 500 characters')
    setLoading(true)
    try {
      const res = await api.post('/posts', { content })
      setContent('')
      onPosted && onPosted(res.data)
    } catch (e) {
      console.error(e)
      alert('Failed to post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-3">
      <div className="mb-2">
        <Input value={content} onChange={e => setContent(e.target.value)} placeholder="Share something with your network..." />
      </div>
      <div className="d-flex justify-content-end">
        <Button onClick={submit} disabled={loading || !content.trim()}>{loading ? 'Posting...' : 'Post'}</Button>
      </div>
    </div>
  )
}
