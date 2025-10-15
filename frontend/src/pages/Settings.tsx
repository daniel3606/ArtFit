import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, auth } from '../lib/api'
import logo from '../assets/logo.png'

type User = { id: number; username: string; email: string; role?: string }

export default function Settings() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectMatches: true,
    messages: true,
    weeklyDigest: false
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    allowMessages: true
  })

  useEffect(() => {
    if (!auth.access) {
      nav('/login')
      return
    }
    api.get('/accounts/me/')
      .then(r => setUser(r.data))
      .catch(() => setError('Failed to load user'))
      .finally(() => setLoading(false))
  }, [nav])

  function handleLogout() {
    auth.clear()
    nav('/login')
  }

  function updateNotifications(setting: string, value: boolean) {
    setNotifications(prev => ({ ...prev, [setting]: value }))
    // TODO: Save to backend
  }

  function updatePrivacy(setting: string, value: string | boolean) {
    setPrivacy(prev => ({ ...prev, [setting]: value }))
    // TODO: Save to backend
  }

  if (loading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
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
            
            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Settings</span>
            </Link>
            
            {auth.access && (
              <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300">
                  <span className="text-xs font-semibold text-gray-700">Me</span>
                </div>
                <span className="font-medium">Profile</span>
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
              <Link to="/profile" className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 inline-flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">Me</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="lg:ml-64 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy</p>
        </div>

        <div className="space-y-8">
          {/* Account Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="text-gray-900">{user.username}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="text-gray-900">{user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="text-gray-900">
                  {user.role === 'DEV' ? 'Developer' :
                   user.role === 'DES' ? 'Designer' : 'Both'}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { key: 'emailUpdates', label: 'Email updates', desc: 'Receive updates about your account and platform changes' },
                { key: 'projectMatches', label: 'Project matches', desc: 'Get notified when new projects match your skills' },
                { key: 'messages', label: 'Messages', desc: 'Notify me when I receive new messages' },
                { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Get a weekly summary of activity and opportunities' }
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{label}</div>
                    <div className="text-sm text-gray-500">{desc}</div>
                  </div>
                  <button
                    onClick={() => updateNotifications(key, !notifications[key as keyof typeof notifications])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Privacy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => updatePrivacy('profileVisibility', e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="public">Public - Anyone can see your profile</option>
                  <option value="members">Members only - Only logged in users</option>
                  <option value="private">Private - Only you can see your profile</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Show email address</div>
                  <div className="text-sm text-gray-500">Allow others to see your email on your profile</div>
                </div>
                <button
                  onClick={() => updatePrivacy('showEmail', !privacy.showEmail)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.showEmail ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Allow messages</div>
                  <div className="text-sm text-gray-500">Let other users send you direct messages</div>
                </div>
                <button
                  onClick={() => updatePrivacy('allowMessages', !privacy.allowMessages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.allowMessages ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-red-700">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Log out</div>
                  <div className="text-sm text-gray-500">Sign out of your account on this device</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
