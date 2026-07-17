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
      <div className="w-full max-w-[680px] py-md flex flex-col gap-md">
        <CreatePost onPosted={handlePosted} />

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-mono text-label-mono whitespace-nowrap">For You</button>
          <button className="px-4 py-1.5 rounded-full bg-transparent border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors font-label-mono text-label-mono whitespace-nowrap">Projects</button>
          <button className="px-4 py-1.5 rounded-full bg-transparent border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors font-label-mono text-label-mono whitespace-nowrap">Questions</button>
          <button className="px-4 py-1.5 rounded-full bg-transparent border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors font-label-mono text-label-mono whitespace-nowrap">Achievements</button>
        </div>

        {posts.length === 0 && !loading ? (
          <div className="glass-panel text-center py-5 border border-white/10 rounded-xl flex flex-col items-center">
            <div className="text-on-surface-variant mb-4 opacity-50">
              <CiMonitor size={48} />
            </div>
            <p className="font-body-lg text-body-lg text-on-surface mb-2">Your feed is empty.</p>
            <Link to="/discover" className="text-primary font-bold hover:underline">Discover people</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {posts.map((p, index) => (
              <React.Fragment key={p._id || p.id}>
                <PostCard post={p} onLike={handleLikeUpdate} onDelete={handlePostDelete} />
                {index === 2 && (
                  <div className="glass-panel py-4 px-0 border border-white/10 rounded-xl">
                    <div className="px-4 mb-3 flex justify-between items-center">
                      <h6 className="font-body-sm font-bold text-on-surface m-0">Suggested Developers</h6>
                      <Link to="/discover" className="text-[13px] font-bold text-primary text-decoration-none hover:underline">View all</Link>
                    </div>
                    <div className="flex gap-3 px-4 overflow-auto pb-2 no-scrollbar">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="text-center p-3 flex-shrink-0 w-[160px] border border-white/10 rounded-xl bg-surface/50">
                          <div className="w-14 h-14 mx-auto rounded-full bg-surface-container flex items-center justify-center mb-3">
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=dev${i}`} className="w-full h-full rounded-full object-cover" />
                          </div>
                          <div className="truncate font-body-sm font-bold text-on-surface">Developer {i}</div>
                          <div className="truncate text-[12px] text-on-surface-variant mb-3">Software Engineer</div>
                          <button className="w-full text-[13px] p-1.5 rounded-md border border-white/10 text-on-surface font-medium hover:bg-white/5 transition-colors">Connect</button>
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
            <button className="rounded-full px-6 py-2 border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors font-label-mono" onClick={() => load(page + 1)} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar (Suggested) */}
      <aside className="hidden xl:flex w-[280px] p-md flex-col gap-md">
        <div className="glass-panel rounded-xl p-md border border-white/10">
          <h3 className="font-body-sm font-bold text-on-surface mb-sm border-b border-white/10 pb-xs">Trending Topics</h3>
          <div className="flex flex-col gap-sm">
            <a className="group" href="#">
              <div className="font-label-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">#rustlang</div>
              <div className="font-body-sm text-on-surface">Memory safety in embedded systems</div>
            </a>
            <a className="group" href="#">
              <div className="font-label-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">#architecture</div>
              <div className="font-body-sm text-on-surface">Event-driven vs Polling</div>
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
