import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Card from '../components/Card'
import Button from '../components/Button'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    async function load() {
      const res = await api.get('/users/me')
      setProfile(res.data)
      setForm(res.data)
    }
    load()
  }, [])

  async function save() {
    const res = await api.put('/users/me', form)
    setProfile(res.data)
    setEditing(false)
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
            <Button onClick={() => setEditing(true)}>Edit profile</Button>
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
