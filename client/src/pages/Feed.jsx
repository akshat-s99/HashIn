import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import { useAuth } from '../contexts/AuthContext'
import { CiMonitor } from 'react-icons/ci'

export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load(p = 1) {
    setLoading(true)
    try {
      const res = await api.get(`/posts?page=${p}&limit=10`)
      const postsArray = res.data?.data?.posts || res.data?.data || res.data || []
      if (p === 1) setPosts(postsArray)
      else setPosts(prev => [...prev, ...postsArray])
      setHasMore(postsArray.length === 10)
      setPage(p)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handlePosted(newPost) {
    setPosts(prev => [newPost, ...prev])
  }

  function handleLikeUpdate() {}

  function handlePostDelete(postId) {
    setPosts(prev => prev.filter(p => (p._id || p.id) !== postId))
  }

  return (
    <>
      {/* Center Column (Feed) */}
      <div style={{ width: '100%', maxWidth: '680px', paddingTop: '24px', paddingBottom: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <CreatePost onPosted={handlePosted} />

        {/* Filter Tabs */}
        <div className="segmented-control" style={{ overflowX: 'auto', marginBottom: '8px' }}>
          <button className="btn active">For You</button>
          <button className="btn">Projects</button>
          <button className="btn">Questions</button>
          <button className="btn">Achievements</button>
        </div>

        {posts.length === 0 && !loading ? (
        {posts.length === 0 && !loading ? (
          <div className="card-minimal d-flex flex-column align-items-center justify-content-center text-center" style={{ padding: '48px 24px' }}>
            <div style={{ color: 'var(--color-text-muted)', marginBottom: '16px', opacity: 0.5 }}>
              <CiMonitor size={48} />
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--color-text-main)', marginBottom: '8px' }}>Your feed is empty.</p>
            <Link to="/discover" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Discover people</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {posts.map((p, index) => (
              <React.Fragment key={p._id || p.id}>
                <PostCard post={p} onLike={handleLikeUpdate} onDelete={handlePostDelete} />
                {index === 2 && (
                {index === 2 && (
                  <div className="card-minimal" style={{ padding: '24px 0' }}>
                    <div className="d-flex justify-content-between align-items-center" style={{ padding: '0 24px', marginBottom: '16px' }}>
                      <h6 style={{ fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>Suggested Developers</h6>
                      <Link to="/discover" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>View all</Link>
                    </div>
                    <div className="d-flex gap-3" style={{ padding: '0 24px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flexShrink: 0, width: '160px', padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-body)', textAlign: 'center' }}>
                          <div style={{ width: '56px', height: '56px', margin: '0 auto 12px auto', borderRadius: '50%', backgroundColor: 'var(--bg-nav)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=dev${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
                          </div>
                          <div style={{ fontWeight: 600, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Developer {i}</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Software Engineer</div>
                          <button className="btn-h-light w-100" style={{ padding: '6px 0', fontSize: '13px' }}>Connect</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {hasMore && (
          <div 
            className="flex justify-center mt-4 mb-5" 
            ref={el => {
              if (el && !loading && hasMore) {
                const observer = new IntersectionObserver(
                  entries => {
                    if (entries[0].isIntersecting) {
                      load(page + 1)
                    }
                  },
                  { threshold: 0.5 }
                )
                observer.observe(el)
              }
            }}
          >
            <button className="btn-h-light" onClick={() => load(page + 1)} disabled={loading} style={{ padding: '8px 24px' }}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar (Suggested) */}
      <aside className="d-none d-xl-flex flex-column" style={{ width: '280px', padding: '24px 0', gap: '24px' }}>
        <div className="card-minimal">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>Trending Topics</h3>
          <div className="d-flex flex-column gap-3">
            <a href="#" className="text-decoration-none group">
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px', transition: 'color 0.2s ease' }} className="group-hover-primary">#rustlang</div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>Memory safety in embedded systems</div>
            </a>
            <a href="#" className="text-decoration-none group">
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px', transition: 'color 0.2s ease' }} className="group-hover-primary">#architecture</div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>Event-driven vs Polling</div>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
