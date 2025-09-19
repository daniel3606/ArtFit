import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { isAxiosError } from 'axios'
import logo from '../assets/logo.png'

type Role = 'DEV' | 'DES' | 'BOTH'

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pickDev, setPickDev] = useState(false)
  const [pickDes, setPickDes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'ArtFit Design - Register'
  }, [])

  const role: Role | null = useMemo(() => {
    if (pickDev && pickDes) return 'BOTH'
    if (pickDev) return 'DEV'
    if (pickDes) return 'DES'
    return null
  }, [pickDev, pickDes])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!role) {
      setError('Please choose Developer and/or Designer.')
      return
    }

    setLoading(true)
    try {
      await api.post('/accounts/register/', { username, email, password, role })

      // ✅ redirect based on picked role(s)
      if (role === 'DEV') nav('/developerskills')
      else if (role === 'DES') nav('/designskills')
      else nav('/both') // shows Developer then Designer in sequence
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

  function onGoogleClick() {
    // TODO: wire to your backend OAuth start URL (example below):
    // window.location.href = 'http://localhost:8000/api/accounts/oauth/google/start/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header: logo + title top-left (bigger) */}
      <header className="absolute top-4 left-4 flex items-center gap-3">
        <img src={logo} alt="ArtFit Logo" className="w-12 h-12 object-contain" />
        <span className="text-3xl font-extrabold text-gray-900">ArtFit</span>
      </header>

      {/* Centered auth card */}
      <main className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full px-4">
          <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Create account</h2>

            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role toggles */}
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  I am a…
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPickDev((v) => !v)}
                    className={[
                      'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition',
                      pickDev
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                    ].join(' ')}
                    aria-pressed={pickDev}
                  >
                    Developer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickDes((v) => !v)}
                    className={[
                      'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition',
                      pickDes
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                    ].join(' ')}
                    aria-pressed={pickDes}
                  >
                    Designer
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Select one or both. Selecting both sets your role to <span className="font-medium">Both</span>.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Creating…' : 'Create account'}
              </button>

              {/* Google under submit */}
              <button
                type="button"
                onClick={onGoogleClick}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                {/* Minimal Google “G” placeholder; swap for the official SVG if you like */}
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gray-300 text-xs">
                  G
                </span>
                Continue with Google
              </button>
            </form>

            {/* Link */}
            <div className="mt-6 flex justify-between text-sm text-gray-700">
              <Link to="/login" className="hover:text-blue-600">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
