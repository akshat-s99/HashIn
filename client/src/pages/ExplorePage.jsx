import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ExplorePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await api.get('/posts?limit=30') // Fetch many posts for explore
        // For explore, prioritize posts with images
        const allPosts = res.data?.data?.posts || res.data?.data || []
        const imagePosts = allPosts.filter(p => p.mediaUrl)
        const textPosts = allPosts.filter(p => !p.mediaUrl)
        
        // Interleave or just show image posts first
        setPosts([...imagePosts, ...textPosts])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchExplore()
  }, [])

  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(1)
      else if (window.innerWidth < 1024) setColumns(2)
      else if (window.innerWidth < 1280) setColumns(3)
      else setColumns(4)
    }
    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  // Distribute posts into columns
  const columnWrappers = Array.from({ length: columns }, () => [])
  posts.forEach((post, i) => {
    columnWrappers[i % columns].push(post)
  })

  return (
    <div className="container-fluid" style={{ maxWidth: '1400px', paddingTop: '24px', paddingBottom: '48px' }}>
      <div className="text-center mb-5">
        <h2 style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Explore the best of HashIn</h2>
        <p className="text-muted">Discover inspiring projects, thoughts, and ideas from the community.</p>
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
          <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: 'var(--color-primary)' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div 
          style={{ 
            display: 'flex', 
            gap: '20px',
            alignItems: 'flex-start'
          }}
        >
          {columnWrappers.map((col, colIndex) => (
            <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {col.map(post => (
                <div 
                  key={post._id} 
                  className="explore-card"
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    position: 'relative'
                  }}
                >
                  {post.mediaUrl ? (
                    <img 
                      src={post.mediaUrl} 
                      alt="Post content" 
                      style={{ width: '100%', display: 'block', objectFit: 'cover' }} 
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', fontSize: '15px', color: 'var(--color-text-main)', minHeight: '150px' }}>
                      {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
                    </div>
                  )}
                  
                  <div 
                    className="explore-overlay"
                    style={{
                      padding: '16px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      position: post.mediaUrl ? 'absolute' : 'static',
                      bottom: 0, left: 0, right: 0,
                      color: post.mediaUrl ? '#fff' : 'var(--color-text-main)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Link to={`/profile/${post.authorId?._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={post.authorId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorId?._id}`} 
                          alt="avatar" 
                          style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)' }} 
                        />
                        <span style={{ fontWeight: 600, fontSize: '13px', textShadow: post.mediaUrl ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}>
                          {post.authorId?.firstName} {post.authorId?.lastName}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
