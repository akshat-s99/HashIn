import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import Card from '../components/Card'
import { CiBookmark } from 'react-icons/ci'

export default function SavedPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSavedPosts()
  }, [])

  async function loadSavedPosts() {
    setLoading(true)
    try {
      const res = await api.get('/posts/bookmarks')
      const postsArray = res.data?.data?.posts || []
      setPosts(postsArray)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handlePostDelete(postId) {
    setPosts(prev => prev.filter(p => (p._id || p.id) !== postId))
  }

  return (
    <div className="container-fluid" style={{ maxWidth: '800px', paddingTop: '24px', paddingBottom: '48px' }}>
      <div className="mb-4 d-flex align-items-center">
        <h2 style={{ fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>Saved Posts</h2>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', marginLeft: '16px' }}></div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
          <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: 'var(--color-primary)' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <Card className="text-center py-5" style={{ border: '1px solid var(--color-border)', boxShadow: 'none' }}>
          <div style={{ marginBottom: '16px', color: 'var(--color-border)' }}>
            <CiBookmark size={48} />
          </div>
          You haven't saved any posts yet.<br/>
          <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Go back to your feed</Link>
        </Card>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map(p => (
            <PostCard 
              key={p._id || p.id} 
              post={p} 
              onDelete={handlePostDelete} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
