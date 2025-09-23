import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, auth } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

type User = { id: number; username: string; email: string; role?: string }
type Work = { id: number; title: string; image: string }

export default function Profile() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [works, setWorks] = useState<Work[]>([])
  const [newWorkTitle, setNewWorkTitle] = useState('')
  const [newWorkFile, setNewWorkFile] = useState<File | null>(null)

  useEffect(() => {
    if (!auth.access) {
      setError('Not logged in')
      setLoading(false)
      return
    }
    api.get('/accounts/me/')
      .then(r => {
        console.log('User data:', r.data)
        setUser(r.data)
        // Set current avatar preview if present
        const avatarUrl = r.data?.profile?.avatar
        if (avatarUrl) setAvatarPreview(avatarUrl)
        // Works come embedded
        if (Array.isArray(r.data?.works)) setWorks(r.data.works)
      })
      .catch(err => {
        console.error('Profile API error:', err)
        setError(`Failed to load user: ${err.response?.data?.detail || err.message}`)
      })
      .finally(() => setLoading(false))
  }, [])

  // no localStorage persistence; using backend now

  const roleBadge = useMemo(() => {
    const role = user?.role
    if (!role) return null
    const base = 'inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium'
    const dev = <span className={[base,'bg-emerald-100 text-emerald-700 border-emerald-200'].join(' ')}>Developer</span>
    const des = <span className={[base,'bg-purple-100 text-purple-700 border-purple-200'].join(' ')}>Designer</span>
    if (role === 'BOTH') return <div className="flex items-center gap-2">{dev}{des}</div>
    return role === 'DEV' ? dev : des
  }, [user?.role])

  async function addWork(e: React.FormEvent) {
    e.preventDefault()
    const title = newWorkTitle.trim()
    if (!title || !newWorkFile) return
    const fd = new FormData()
    fd.append('title', title)
    fd.append('image', newWorkFile)
    try {
      const r = await api.post('/accounts/works/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const created: Work = r.data
      setWorks(prev => [created, ...prev])
      setNewWorkTitle(''); setNewWorkFile(null)
    } catch (err) {
      console.error('Failed to upload work', err)
    }
  }
  async function removeWork(id: number) {
    try {
      await api.delete(`/accounts/works/${id}/`)
      setWorks(prev => prev.filter(w => w.id !== id))
    } catch (err) {
      console.error('Failed to delete work', err)
    }
  }

  async function onAvatarFileChange(file: File | null) {
    if (!file) return
    // local preview
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(String(reader.result))
    reader.readAsDataURL(file)
    // upload
    const fd = new FormData()
    fd.append('avatar', file)
    try {
      await api.patch('/accounts/profile/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } catch (err) {
      console.error('Failed to update avatar', err)
    }
  }

  if (loading) return <div className="p-6">Loading…</div>
  if (error) return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-4 text-red-600">{error}</div>
      <button
        className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
        onClick={() => nav('/login')}
      >
        Go to Login
      </button>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <div className="p-6">
          {/* Logo */}
          <Link to={auth.access ? "/home" : "/"} className="flex items-center gap-3 mb-8">
            <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-extrabold tracking-tight">ArtFit</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to="/home" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <span className="font-medium">Explore</span>
            </Link>
            
            <Link to="/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-medium">Search</span>
            </Link>
            
            <Link to="/projects/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium">Add Project</span>
            </Link>
            
            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium">Settings</span>
            </Link>
            
            {auth.access && (
              <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 group">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">Me</span>
                </div>
                <span className="font-medium text-gray-700">Profile</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to={auth.access ? "/home" : "/"} className="flex items-center gap-2">
              <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">ArtFit</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/home" className="hover:text-blue-600">Home</Link>
              <Link to="/settings" className="hover:text-blue-600">Settings</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="lg:ml-64">
        <div className="max-w-4xl mx-auto p-6">
        {/* Header card */}
        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6 flex items-start gap-5">
          <div className="shrink-0">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Photo</div>
              )}
            </div>
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                <span className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">Upload photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e)=>onAvatarFileChange(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              {roleBadge}
            </div>
            <div className="text-sm text-gray-600">{user.email}</div>

            <div className="mt-4">
              <button
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => { auth.clear(); nav('/login') }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* Works grid */}
        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Work</h2>
            <form className="flex items-center gap-2" onSubmit={addWork}>
              <input className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm" placeholder="Title"
                     value={newWorkTitle} onChange={e=>setNewWorkTitle(e.target.value)} />
              <label className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e)=>setNewWorkFile(e.target.files?.[0] || null)} />
                Choose image
              </label>
              <button className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50" type="submit" disabled={!newWorkTitle || !newWorkFile}>Add</button>
            </form>
          </div>
          {works.length === 0 ? (
            <div className="text-sm text-gray-500">No work added yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {works.map(w => (
                <div key={w.id} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                  <div className="relative h-32 w-full bg-gray-100">
                    <img src={w.image} alt={w.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-sm font-medium line-clamp-1">{w.title}</div>
                    <button className="text-xs text-gray-500 hover:text-red-600" onClick={()=>removeWork(w.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}


