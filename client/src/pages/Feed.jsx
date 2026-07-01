import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'

export default function Feed() {
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
      if (p === 1) setPosts(res.data)
      else setPosts(prev => [...prev, ...(res.data || [])])
      setHasMore((res.data || []).length === 10)
      setPage(p)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function handlePosted(newPost) {
    // prepend
    setPosts(prev => [newPost, ...prev])
  }

  function handleLikeUpdate() {
    // no-op for now; PostCard updates itself
  }

  return (
    <div>
      <h2>Feed</h2>
      <CreatePost onPosted={handlePosted} />

      {posts.map(p => <PostCard key={p._id || p.id} post={p} onLike={handleLikeUpdate} />)}

      <div className="d-flex justify-content-center mt-3">
        {hasMore ? (
          <button className="btn btn-outline-light" onClick={() => load(page + 1)} disabled={loading}>{loading ? 'Loading...' : 'Load more'}</button>
        ) : (
          <div className="text-muted">No more posts</div>
        )}
      </div>
    </div>
  )
}
