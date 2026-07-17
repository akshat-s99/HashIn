import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useToast } from '../contexts/ToastContext'
import { CiCamera, CiShuffle, CiLocationOn, CiBag1, CiBank, CiStar, CiLink, CiSettings } from 'react-icons/ci'

export default function ProfilePage() {
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  const params = useParams()
  const isOwn = !params.userId

  useEffect(() => {
    async function load() {
      try {
        if (params.userId) {
          const res = await api.get(`/users/${params.userId}`)
          const pData = res.data?.data?.user || res.data?.data || res.data
          setProfile(pData)
          setForm(pData)
          setEditing(false)
        } else {
          const res = await api.get('/users/me')
          const pData = res.data?.data?.user || res.data?.data || res.data
          setProfile(pData)
          setForm(pData)
        }
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [params.userId])

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const updatedUser = res.data?.data?.user || res.data?.user || res.data
      setProfile(updatedUser)
      setForm(updatedUser)
    } catch (error) {
      console.error(error)
      addToast('Failed to upload avatar', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function save() {
    try {
      const res = await api.put('/users/me', form)
      const pData = res.data?.data?.user || res.data?.data || res.data
      setProfile(pData)
      setEditing(false)
    } catch (e) {
      console.error('Save failed:', e)
      addToast(e?.response?.data?.message || 'Failed to save profile. Please try again.', 'error')
    }
  }

  async function sendConnectionRequest() {
    if (!params.userId) return
    try {
      await api.post(`/connections/request/${params.userId}`)
      addToast('Connection request sent', 'success')
    } catch (e) {
      console.error(e)
      addToast('Failed to send request', 'error')
    }
  }

  const handleLinkChange = (e, field) => {
    setForm(prev => ({
      ...prev,
      links: { ...(prev.links || {}), [field]: e.target.value }
    }))
  }

  if (!profile) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  )

  if (editing) {
    return (
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
        <div className="card-minimal" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '32px' }}>Edit Profile</h3>
          
          <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-nav)', border: '4px solid var(--bg-card)', overflow: 'hidden' }}>
                <img src={form.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${form._id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" style={{ display: 'none' }} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '2px solid var(--bg-card)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? '...' : <CiCamera size={16} />}
              </button>
            </div>
            <div>
              <h5 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', margin: '0 0 4px 0' }}>Profile Photo</h5>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>Upload a professional headshot.</p>
              <button 
                className="btn-action-minimal d-flex align-items-center gap-2"
                style={{ padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)', fontSize: '13px' }}
                onClick={() => {
                  const seed = encodeURIComponent((form.firstName || 'User') + Math.random().toString(36).substring(7));
                  const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
                  setForm({...form, avatar: newAvatar});
                }}
              >
                <CiShuffle size={14} /> Generate Random
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>First Name</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.firstName || ''} onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div className="col-12 col-md-6 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Last Name</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.lastName || ''} onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
            <div className="col-12 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Headline</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.headline || ''} onChange={e => setForm({...form, headline: e.target.value})} placeholder="Software Engineer @ HashIn" />
            </div>
            <div className="col-12 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Location</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} placeholder="San Francisco, CA" />
            </div>
            <div className="col-12 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>About</label>
              <textarea className="form-control" style={{ minHeight: '96px', resize: 'vertical', backgroundColor: 'var(--bg-body)' }} value={form.about || ''} onChange={e => setForm({...form, about: e.target.value})} placeholder="Tell us about yourself..." />
            </div>
            <div className="col-12 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Skills (comma separated)</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={Array.isArray(form.skills) ? form.skills.join(', ') : (form.skills || '')} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Node.js, Go" />
            </div>
          </div>
          
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '16px' }}>Social Links</h4>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>GitHub</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.links?.github || ''} onChange={e => handleLinkChange(e, 'github')} />
            </div>
            <div className="col-12 col-md-6 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>LinkedIn</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.links?.linkedin || ''} onChange={e => handleLinkChange(e, 'linkedin')} />
            </div>
            <div className="col-12 col-md-6 d-flex flex-column gap-2">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Portfolio</label>
              <input className="form-control" style={{ height: '40px', backgroundColor: 'var(--bg-body)' }} value={form.links?.portfolio || ''} onChange={e => handleLinkChange(e, 'portfolio')} />
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button className="btn-h-outline" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn-h-primary" onClick={save}>Save Changes</button>
          </div>
        </div>
      </div>
    )
  }

  const skillsArr = Array.isArray(profile.skills) ? profile.skills : (profile.skills ? profile.skills.split(',').map(s => s.trim()) : [])

  return (
    <div className="w-full">
      {/* Profile Header Section */}
      <div className="card-minimal" style={{ padding: 0, overflow: 'hidden', borderBottom: 'none' }}>
        {/* Banner */}
        <div className="profile-banner"></div>
        
        {/* Profile Info Container */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          {/* Avatar (Overlapping) */}
          <img src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile._id}`} alt="avatar" className="profile-avatar" />
          
          {/* Header Actions & Info */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start" style={{ padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-main)', margin: '0 0 8px 0' }}>{profile.firstName} {profile.lastName}</h1>
              <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>{profile.headline || 'No headline provided'}</p>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                {profile.location && (
                  <div className="d-flex align-items-center gap-1">
                    <CiLocationOn size={16} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.links?.github && (
                  <>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <div className="d-flex align-items-center gap-1">
                      <CiLink size={16} />
                      <a href={profile.links.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>GitHub</a>
                    </div>
                  </>
                )}
                {profile.links?.linkedin && (
                  <>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <div className="d-flex align-items-center gap-1">
                      <CiLink size={16} />
                      <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>LinkedIn</a>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex gap-3 mt-3 mt-md-0">
              {isOwn ? (
                <button onClick={() => setEditing(true)} className="btn-h-outline">
                  Edit Profile
                </button>
              ) : (
                <button onClick={sendConnectionRequest} className="btn-h-primary">
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bento Grid Layout for Content */}
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Skills & Info (4 cols) */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">
            {/* Skills Card */}
            <div className="card-minimal">
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-primary)' }}><CiStar /></span>
                Skills
              </h2>
              <div className="d-flex flex-wrap gap-2">
                {skillsArr.length > 0 ? skillsArr.map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                )) : <span style={{ color: 'var(--color-text-muted)' }}>No skills added yet.</span>}
              </div>
            </div>
            
            {/* About Card */}
            <div className="card-minimal">
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-primary)' }}><CiSettings /></span>
                About
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {profile.about || 'No about information provided.'}
              </p>
            </div>
          </div>
          
          {/* Right Column: Experience (8 cols) */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">
            {/* Experience Card */}
            <div className="card-minimal">
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-primary)' }}><CiBag1 /></span>
                Experience
              </h2>
              <div className="d-flex flex-column gap-4">
                {profile.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingLeft: '32px' }}>
                      {/* Timeline line */}
                      {idx !== profile.experience.length - 1 && (
                        <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', backgroundColor: 'var(--color-border)' }}></div>
                      )}
                      {/* Timeline node */}
                      <div style={{ position: 'absolute', left: '6px', top: '6px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '2px solid var(--bg-card)' }}></div>
                      
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-2">
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 4px 0' }}>{exp.title}</h3>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary)', marginBottom: '8px' }}>{exp.company}</div>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)', backgroundColor: 'var(--bg-body)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No experience added yet.</p>
                )}
              </div>
            </div>
            
            {/* Education Card */}
            <div className="card-minimal">
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-primary)' }}><CiBank /></span>
                Education
              </h2>
              <div className="d-flex flex-column gap-3">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="d-flex gap-3 align-items-start" style={{ padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--bg-body)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-nav)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                        <CiBank size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 4px 0' }}>{edu.school}</h3>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', opacity: 0.7 }}>{edu.startDate} - {edu.endDate}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No education added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
