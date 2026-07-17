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
      <div className="w-full max-w-3xl mx-auto py-lg px-margin-mobile">
        <div className="glass-panel rounded-xl p-md border border-white/10">
          <h3 className="font-headline-md font-bold text-on-surface mb-xl">Edit Profile</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-md mb-xl pb-md border-b border-white/10">
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full bg-surface-container border-4 border-background overflow-hidden">
                <img src={form.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${form._id}`} className="w-full h-full object-cover" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-2 border-background text-on-primary flex items-center justify-center disabled:opacity-50"
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? '...' : <CiCamera size={16} />}
              </button>
            </div>
            <div>
              <h5 className="font-body-lg font-bold text-on-surface mb-1">Profile Photo</h5>
              <p className="font-body-sm text-on-surface-variant mb-3">Upload a professional headshot.</p>
              <button 
                className="flex items-center gap-xs px-4 py-1.5 rounded-full border border-white/10 text-on-surface text-[13px] hover:bg-white/5 transition-colors"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">First Name</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.firstName || ''} onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">Last Name</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.lastName || ''} onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">Headline</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.headline || ''} onChange={e => setForm({...form, headline: e.target.value})} placeholder="Software Engineer @ HashIn" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">Location</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} placeholder="San Francisco, CA" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">About</label>
              <textarea className="w-full p-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none h-24 resize-none" value={form.about || ''} onChange={e => setForm({...form, about: e.target.value})} placeholder="Tell us about yourself..." />
            </div>
            <div className="md:col-span-2 flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">Skills (comma separated)</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={Array.isArray(form.skills) ? form.skills.join(', ') : (form.skills || '')} onChange={e => setForm({...form, skills: e.target.value})} placeholder="React, Node.js, Go" />
            </div>
          </div>
          
          <h4 className="font-headline-sm font-bold text-on-surface mb-md">Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-xl">
            <div className="flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">GitHub</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.links?.github || ''} onChange={e => handleLinkChange(e, 'github')} />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">LinkedIn</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.links?.linkedin || ''} onChange={e => handleLinkChange(e, 'linkedin')} />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-mono text-on-surface-variant">Portfolio</label>
              <input className="w-full h-10 px-sm bg-surface border border-white/10 rounded-lg text-on-surface focus:border-primary outline-none" value={form.links?.portfolio || ''} onChange={e => handleLinkChange(e, 'portfolio')} />
            </div>
          </div>
          
          <div className="flex justify-end gap-sm pt-md border-t border-white/10">
            <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-on-surface transition-colors font-bold" onClick={() => setEditing(false)}>Cancel</button>
            <button className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container hover:bg-primary transition-colors font-bold" onClick={save}>Save Changes</button>
          </div>
        </div>
      </div>
    )
  }

  const skillsArr = Array.isArray(profile.skills) ? profile.skills : (profile.skills ? profile.skills.split(',').map(s => s.trim()) : [])

  return (
    <div className="w-full">
      {/* Profile Header Section */}
      <div className="relative w-full">
        {/* Banner Gradient */}
        <div className="h-[200px] w-full bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #dc143c 0%, transparent 50%), radial-gradient(circle at 80% 30%, #414a53 0%, transparent 40%)'}}></div>
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        </div>
        
        {/* Profile Info Container */}
        <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop relative">
          {/* Avatar (Overlapping) */}
          <div className="absolute -top-16 left-margin-mobile md:left-margin-desktop">
            <div className="w-[130px] h-[130px] rounded-full bg-surface border-4 border-background flex items-center justify-center relative overflow-hidden">
              <img src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile._id}`} alt="avatar" className="w-full h-full object-cover bg-surface-container-high" />
              {/* Status indicator */}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-tertiary rounded-full border-2 border-background"></div>
            </div>
          </div>
          
          {/* Header Actions & Info */}
          <div className="pt-20 pb-lg flex flex-col md:flex-row md:justify-between md:items-start gap-md border-b border-white/10">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">{profile.firstName} {profile.lastName}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-2">{profile.headline || 'No headline provided'}</p>
              <div className="flex items-center gap-xs text-on-surface-variant font-label-mono text-label-mono mb-4">
                {profile.location && (
                  <>
                    <span className="text-[16px]"><CiLocationOn /></span>
                    <span>{profile.location}</span>
                    <span className="mx-2 opacity-30">|</span>
                  </>
                )}
                {profile.links?.github && (
                  <>
                    <span className="text-[16px]"><CiLink /></span>
                    <a className="hover:text-primary transition-colors text-decoration-none text-on-surface-variant" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                    <span className="mx-2 opacity-30">|</span>
                  </>
                )}
                {profile.links?.linkedin && (
                  <>
                    <span className="text-[16px]"><CiLink /></span>
                    <a className="hover:text-primary transition-colors text-decoration-none text-on-surface-variant" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-sm">
              {isOwn ? (
                <button onClick={() => setEditing(true)} className="h-[40px] px-lg rounded-full border border-white/10 bg-transparent text-on-surface font-body-sm text-body-sm glass-panel hover:bg-white/5 transition-colors active:scale-95">
                  Edit Profile
                </button>
              ) : (
                <button onClick={sendConnectionRequest} className="h-[40px] px-lg rounded-full border border-primary/20 bg-primary/10 text-primary font-body-sm text-body-sm hover:bg-primary hover:text-on-primary transition-colors active:scale-95">
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
          <div className="lg:col-span-4 flex flex-col gap-gutter">
            {/* Skills Card */}
            <div className="glass-panel rounded-xl p-md border border-white/10">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4 pb-2 border-b border-white/5 flex items-center gap-xs">
                <span className="text-primary"><CiStar /></span>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsArr.length > 0 ? skillsArr.map(s => (
                  <span key={s} className="font-code-block text-code-block px-3 py-1 rounded-full border border-white/10 bg-surface-container-high text-on-surface">{s}</span>
                )) : <span className="text-on-surface-variant font-body-sm">No skills added yet.</span>}
              </div>
            </div>
            
            {/* About Card */}
            <div className="glass-panel rounded-xl p-md border border-white/10">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4 pb-2 border-b border-white/5 flex items-center gap-xs">
                <span className="text-primary"><CiSettings /></span>
                About
              </h2>
              <p className="font-body-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                {profile.about || 'No about information provided.'}
              </p>
            </div>
          </div>
          
          {/* Right Column: Experience (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {/* Experience Card */}
            <div className="glass-panel rounded-xl p-md border border-white/10">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 pb-2 border-b border-white/5 flex items-center gap-xs">
                <span className="text-primary"><CiBag1 /></span>
                Experience
              </h2>
              <div className="flex flex-col gap-lg">
                {profile.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-8">
                      {/* Timeline line */}
                      {idx !== profile.experience.length - 1 && (
                        <div className="absolute left-3 top-8 bottom-[-24px] w-px bg-white/10"></div>
                      )}
                      {/* Timeline node */}
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-high"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <div>
                          <h3 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">{exp.title}</h3>
                          <div className="font-label-mono text-label-mono text-primary mb-2">{exp.company}</div>
                        </div>
                        <div className="font-label-mono text-label-mono text-on-surface-variant bg-white/5 px-2 py-1 rounded border border-white/10 inline-block self-start">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant font-body-sm">No experience added yet.</p>
                )}
              </div>
            </div>
            
            {/* Education Card */}
            <div className="glass-panel rounded-xl p-md border border-white/10">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6 pb-2 border-b border-white/5 flex items-center gap-xs">
                <span className="text-primary"><CiBank /></span>
                Education
              </h2>
              <div className="flex flex-col gap-md">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-sm rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-white/10 flex items-center justify-center text-on-surface-variant flex-shrink-0">
                        <CiBank size={24} />
                      </div>
                      <div>
                        <h3 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">{edu.school}</h3>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</div>
                        <div className="font-label-mono text-label-mono text-on-surface-variant opacity-70">{edu.startDate} - {edu.endDate}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant font-body-sm">No education added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
