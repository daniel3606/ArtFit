import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, auth } from '../lib/api'
import { isAxiosError } from 'axios' 

export default function Login() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      const { data } = await api.post('/token/', { username, password })
      auth.access = data.access
      auth.refresh = data.refresh
      nav('/skills')
    } catch (err: unknown) {
      if (isAxiosError(err)) setError('Invalid username or password.')
      else setError('Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-6 max-w-sm mx-auto space-y-3">
      <h2 className="text-2xl font-semibold">Log in</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input className="border p-2 w-full" placeholder="Username"
             value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password"
             value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="border px-3 py-2 w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <div className="text-sm">
        Don’t have an account? <Link className="underline" to="/register">Register</Link>
      </div>
    </form>
  )
}
