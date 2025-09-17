import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { isAxiosError } from 'axios'


type Role = 'DEV' | 'DES' | 'BOTH'

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('BOTH')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      await api.post('/accounts/register/', { username, email, password, role })
      nav('/login')
    } catch (err: unknown) {
      if (isAxiosError(err)) { 
        setError(err.response?.data?.detail ?? 'Could not register. Try a different username/email.')
      } else {
        setError('Unexpected error. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={onSubmit} className="p-6 max-w-sm mx-auto space-y-3">
      <h2 className="text-2xl font-semibold">Create account</h2>
      {error && <div className="text-red-600">{error}</div>}
      <input className="border p-2 w-full" placeholder="Username"
             value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Email"
             value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password"
             value={password} onChange={e=>setPassword(e.target.value)} />
      <select className="border p-2 w-full" value={role} onChange={e=>setRole(e.target.value as Role)}>
        <option value="DEV">Developer</option>
        <option value="DES">Designer</option>
        <option value="BOTH">Both</option>
      </select>
      <button className="border px-3 py-2 w-full" disabled={loading}>
        {loading ? 'Creating…' : 'Create account'}
      </button>
      <div className="text-sm">
        Already have an account? <Link className="underline" to="/login">Log in</Link>
      </div>
    </form>
  )
}
