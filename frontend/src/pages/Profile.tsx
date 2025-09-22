import { useEffect, useState } from 'react'
import { api, auth } from '../lib/api'

type User = { id: number; username: string; email: string; role?: string }

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth.access) {
      setError('Not logged in')
      setLoading(false)
      return
    }
    api.get('/accounts/me/')
      .then(r => setUser(r.data))
      .catch(() => setError('Failed to load user'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!user) return null

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
        <div className="text-sm text-gray-500">Username</div>
        <div className="font-medium">{user.username}</div>
        <div className="mt-4 text-sm text-gray-500">Email</div>
        <div className="font-medium">{user.email}</div>
        {user.role && (
          <>
            <div className="mt-4 text-sm text-gray-500">Role</div>
            <div className="font-medium">{user.role}</div>
          </>
        )}
      </div>
    </div>
  )
}


