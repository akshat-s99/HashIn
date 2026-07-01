import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Card from '../components/Card'
import Button from '../components/Button'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  const params = useParams()

  useEffect(() => {
    async function load() {
      try {
        if (params.userId) {
          const res = await api.get(`/users/${params.userId}`)
          setProfile(res.data)
          setForm(res.data)
          setEditing(false)
        } else {
          const res = await api.get('/users/me')
          setProfile(res.data)
          setForm(res.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [params.userId])

  async function save() {
    const res = await api.put('/users/me', form)
    setProfile(res.data)
    setEditing(false)
  }

  async function sendConnectionRequest() {
    if (!params.userId) return
    try {
      await api.post(`/connections/request/${params.userId}`)
      alert('Connection request sent')
    } catch (e) {
      console.error(e)
      alert('Failed to send request')
    }
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div>
      <Card>
        <div className="d-flex align-items-center">
          <img src={profile.avatar} alt="avatar" style={{ width:96, height:96, borderRadius:12 }} />
          <div className="ms-3">
            <h3 style={{ fontFamily: 'Outfit, sans-serif' }}>{profile.firstName} {profile.lastName}</h3>
            <div className="text-muted">{profile.headline}</div>
          </div>
        </div>

        <hr />

        {!editing ? (
          <>
            <p>{profile.about}</p>
            <div className="mb-2">
              {profile.skills?.map(s => (
                <span key={s} className="me-2 badge bg-light text-dark skill-tag">{s}</span>
              ))}
            </div>
            {!params.userId ? (
              <Button onClick={() => setEditing(true)}>Edit profile</Button>
            ) : (
              <Button onClick={sendConnectionRequest}>Connect</Button>
            )}
          </>
        ) : (
          <>
            <div className="mb-2">
              <label>Headline</label>
              <input className="form-control" value={form.headline || ''} onChange={e => setForm({ ...form, headline: e.target.value })} />
            </div>
            <div className="mb-2">
              <label>About</label>
              <textarea className="form-control" value={form.about || ''} onChange={e => setForm({ ...form, about: e.target.value })} />
            </div>
            <div className="mb-2">
              <label>Skills (comma separated)</label>
              <input className="form-control" value={form.skills?.join(',') || ''} onChange={e => setForm({ ...form, skills: e.target.value.split(',').map(s => s.trim()) })} />
            </div>
            <div className="d-flex gap-2">
              <Button onClick={save}>Save</Button>
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
