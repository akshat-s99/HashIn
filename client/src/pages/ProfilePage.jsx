import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Card from '../components/Card'
import { useToast } from '../contexts/ToastContext'
import { CiCamera, CiShuffle, CiLocationOn, CiBag1, CiBank } from 'react-icons/ci'

export default function ProfilePage() {
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = React.useRef(null)

  const params = useParams()
  const isOwn = !params.userId

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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: 'var(--color-primary)' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  if (editing) {
    return (
      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <Card style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
          <h3 className="mb-4" style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>Edit Profile</h3>
          
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-5 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={form.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${form._id}`} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg-card)', backgroundColor: 'var(--color-border)' }} />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary rounded-circle shadow-sm"
                style={{ position: 'absolute', bottom: '0', right: '0', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-primary)', border: '2px solid var(--bg-card)', color: '#fff' }}
                disabled={uploadingAvatar}
                title="Upload new avatar"
              >
                {uploadingAvatar ? '...' : <CiCamera size={16} />}
              </button>
            </div>
            <div>
              <h5 style={{ fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 8px 0' }}>Profile Photo</h5>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>Upload a professional headshot.</p>
              <button className="btn btn-sm mt-3 d-flex align-items-center" style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', fontWeight: 600, borderRadius: '50px', padding: '6px 16px' }} onClick={() => {
                const seed = encodeURIComponent((form.firstName || 'User') + Math.random().toString(36).substring(7));
                const newAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
                setForm({...form, avatar: newAvatar});
              }}>
                <CiShuffle size={14} style={{ marginRight: '6px' }} />
                Generate Random
              </button>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>First Name</label>
              <input className="form-control" placeholder="First Name" value={form.firstName || ''} onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div className="col-md-6">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Last Name</label>
              <input className="form-control" placeholder="Last Name" value={form.lastName || ''} onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Headline</label>
              <input className="form-control" placeholder="E.g. Software Engineer at HashIn" value={form.headline || ''} onChange={e => setForm({...form, headline: e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Location</label>
              <input className="form-control" placeholder="E.g. San Francisco, CA" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>About</label>
              <textarea className="form-control" placeholder="Tell us about yourself..." value={form.about || ''} onChange={e => setForm({...form, about: e.target.value})} style={{ minHeight: '120px' }} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Skills (comma separated)</label>
              <input className="form-control" placeholder="React, Node.js, Design" value={Array.isArray(form.skills) ? form.skills.join(', ') : (form.skills || '')} onChange={e => setForm({...form, skills: e.target.value})} />
            </div>
          </div>
          
          <h4 className="mb-3 mt-5" style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '18px' }}>Social Links</h4>
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>GitHub URL</label>
              <input className="form-control" placeholder="https://github.com/username" value={form.links?.github || ''} onChange={e => handleLinkChange(e, 'github')} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>LinkedIn URL</label>
              <input className="form-control" placeholder="https://linkedin.com/in/username" value={form.links?.linkedin || ''} onChange={e => handleLinkChange(e, 'linkedin')} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Portfolio URL</label>
              <input className="form-control" placeholder="https://yourwebsite.com" value={form.links?.portfolio || ''} onChange={e => handleLinkChange(e, 'portfolio')} />
            </div>
          </div>
          
          <div className="d-flex justify-content-end align-items-center mt-5 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="d-flex gap-3">
              <button className="btn-h-light" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-h-primary" onClick={save}>Save Changes</button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <div className="card p-0 mb-4 overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'none' }}>
        <div className="profile-banner" style={{ height: '160px', backgroundColor: '#e2e8f0', backgroundImage: 'url(https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=800&q=80)', backgroundSize: 'cover' }}></div>
        <div className="px-4 pb-4 position-relative">
          <div style={{ display: 'inline-block', position: 'relative', marginTop: '-65px', zIndex: 10 }}>
            <img src={profile.avatar} alt="avatar" className="shadow-sm" onError={e => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profile._id}` }} style={{ width: '130px', height: '130px', borderRadius: '50%', border: '4px solid var(--bg-card)', backgroundColor: 'var(--bg-card)', objectFit: 'cover', display: 'block' }} />
            {isOwn && (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary rounded-circle shadow"
                  style={{ position: 'absolute', bottom: '4px', right: '4px', width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-primary)', border: '3px solid var(--bg-card)', color: '#fff' }}
                  disabled={uploadingAvatar}
                  title="Upload new avatar"
                >
                  {uploadingAvatar ? '...' : <CiCamera size={18} />}
                </button>
              </>
            )}
          </div>
          <div className="mt-3">
            <h3 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
              {profile.firstName} {profile.lastName}
            </h3>
            <div className="text-muted" style={{ fontSize: '16px', marginTop: '6px', marginBottom: '8px', lineHeight: 1.4 }}>
              {profile.headline || 'No headline provided'}
            </div>
            {profile.location && (
              <div className="text-muted mb-2" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CiLocationOn size={14} />
                {profile.location}
              </div>
            )}
            
            <div className="d-flex gap-3 mb-3">
              {profile.links?.github && <a href={profile.links.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>GitHub</a>}
              {profile.links?.linkedin && <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>LinkedIn</a>}
              {profile.links?.portfolio && <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>Portfolio</a>}
            </div>
            
            <div className="d-flex gap-2 mt-2">
              {isOwn ? (
                <button className="btn-h-primary" onClick={() => setEditing(true)} style={{ borderRadius: '50px', fontWeight: 600, padding: '8px 24px' }}>Edit Profile</button>
              ) : (
                <button className="btn-h-primary" onClick={sendConnectionRequest} style={{ borderRadius: '50px', fontWeight: 600, padding: '8px 24px' }}>Connect</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <Card className="mb-4" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
            <h4 className="mb-3" style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>About</h4>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '15px', color: 'var(--color-text-main)', margin: 0 }}>{profile.about || 'No about information provided.'}</p>
          </Card>

          <Card className="mb-4" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="m-0" style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Experience</h4>
            </div>
            {profile.experience && profile.experience.length > 0 ? (
              <div className="d-flex flex-column gap-4">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="d-flex gap-3">
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-overlay)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      <CiBag1 size={24} />
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontWeight: 600, fontSize: '16px', color: 'var(--color-text-main)' }}>{exp.title}</h5>
                      <div style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>{exp.company}</div>
                      <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                      {exp.description && <p className="mt-2 mb-0" style={{ fontSize: '14px', color: 'var(--color-text-main)', whiteSpace: 'pre-wrap' }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted m-0">No experience added yet.</p>
            )}
          </Card>

          <Card className="mb-4" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="m-0" style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Education</h4>
            </div>
            {profile.education && profile.education.length > 0 ? (
              <div className="d-flex flex-column gap-4">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="d-flex gap-3">
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-overlay)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                      <CiBank size={24} />
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontWeight: 600, fontSize: '16px', color: 'var(--color-text-main)' }}>{edu.school}</h5>
                      <div style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</div>
                      <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{edu.startDate} - {edu.endDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted m-0">No education added yet.</p>
            )}
          </Card>

          <Card className="mb-4" style={{ border: '1px solid var(--color-border)', boxShadow: 'none', borderRadius: '12px' }}>
            <h4 className="mb-4" style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Skills</h4>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {profile.skills.map(s => (
                  <span key={s} style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', padding: '6px 16px', borderRadius: '50px', fontSize: '14px', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted m-0">No skills added yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
