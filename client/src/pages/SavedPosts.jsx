import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
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
    <div className="w-full max-w-[680px] py-md flex flex-col gap-md relative z-10">
      <div className="mb-4 pb-2 border-b border-white/10 flex items-center">
        <h3 className="font-headline-md font-bold text-on-surface m-0">Saved Posts</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-panel text-center py-10 border border-white/10 rounded-xl flex flex-col items-center">
          <div className="text-on-surface-variant opacity-50 mb-4">
            <CiBookmark size={48} />
          </div>
          <div className="text-on-surface font-body-sm mb-4">You haven't saved any posts yet.</div>
          <Link to="/" className="text-primary font-bold hover:underline">Go back to your feed</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
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
