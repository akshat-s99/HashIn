import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import Avatar from '../components/Avatar'
import { CiBookmark, CiSettings, CiMonitor } from 'react-icons/ci'

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
    <div className="container-fluid" style={{ maxWidth: '1128px', paddingTop: '24px' }}>
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-lg-3 d-none d-lg-block">
          <div className="sticky-sidebar">
            <div className="card-minimal d-flex flex-column align-items-center text-center p-4 mb-4">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?._id}`} 
                alt="avatar" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid var(--color-border)', objectFit: 'cover', marginBottom: '16px' }} 
              />
              <h5 style={{ fontWeight: 600, margin: 0, color: 'var(--color-text-main)', fontSize: '16px' }}>
                {user?.firstName} {user?.lastName}
              </h5>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
                {user?.headline || 'Professional at HashIn'}
              </div>
            </div>
            
            <div className="card-minimal p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Connections</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>{user?.connectionsCount || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)' }}>Projects</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>{user?.projectsCount || 0}</span>
              </div>
            </div>

            <div className="card-minimal p-2">
              <Link to="/saved" className="d-flex align-items-center gap-3 p-2 text-decoration-none" style={{ borderRadius: '8px', color: 'var(--color-text-main)', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-overlay-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <CiBookmark size={18} style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Saved Posts</span>
              </Link>

              <Link to="/settings" className="d-flex align-items-center gap-3 p-2 text-decoration-none" style={{ borderRadius: '8px', color: 'var(--color-text-main)', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-overlay-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <CiSettings size={18} style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Settings</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div className="col-12 col-lg-9">
          <CreatePost onPosted={handlePosted} />

          <div className="mb-4 d-flex align-items-center gap-3 overflow-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="segmented-control flex-shrink-0" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--bg-body)' }}>
              <button className="btn active">For You</button>
              <button className="btn">Projects</button>
              <button className="btn">Questions</button>
              <button className="btn">Learning</button>
              <button className="btn">Achievements</button>
            </div>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', minWidth: '20px' }}></div>
          </div>

          {posts.length === 0 && !loading ? (
            <Card className="text-center py-5" style={{ border: '1px solid var(--color-border)', boxShadow: 'none' }}>
              <div style={{ marginBottom: '16px', color: 'var(--color-border)' }}>
                <CiMonitor size={48} />
              </div>
              Your feed is empty.<br/>
              <Link to="/discover" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Discover people</Link>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-3">
              {posts.map((p, index) => (
                <React.Fragment key={p._id || p.id}>
                  <PostCard post={p} onLike={handleLikeUpdate} onDelete={handlePostDelete} />
                  {index === 2 && (
                    <div className="card-minimal py-4 px-0">
                      <div className="px-4 mb-3 d-flex justify-content-between align-items-center">
                        <h6 style={{ fontWeight: 600, color: 'var(--color-text-main)', margin: 0, fontSize: '14px' }}>Suggested Developers</h6>
                        <Link to="/discover" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>View all</Link>
                      </div>
                      <div className="d-flex gap-3 px-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="text-center p-3 flex-shrink-0" style={{ width: '160px', border: '1px solid var(--color-border)', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=dev${i}`} alt="avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }} />
                            <div className="text-truncate" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Developer {i}</div>
                            <div className="text-truncate" style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Software Engineer</div>
                            <button className="btn w-100" style={{ fontSize: '13px', padding: '6px', borderRadius: '6px', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', fontWeight: 500, backgroundColor: 'transparent', transition: 'background-color 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-overlay-hover)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Connect</button>
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
              className="d-flex justify-content-center mt-4 mb-5" 
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
              <button className="btn-action-minimal" onClick={() => load(page + 1)} disabled={loading} style={{ borderRadius: '50px', padding: '8px 24px', border: '1px solid var(--color-border)' }}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
