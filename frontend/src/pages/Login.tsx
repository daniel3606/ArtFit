import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { api, auth } from "../lib/api"
import { isAxiosError } from "axios"
import logo from "../assets/logo.png"
import { renderGoogleButton } from "../lib/google-auth"

export default function Login() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const googleButtonRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    document.title = "ArtFit Design - Login"
  }, [])

  // If already logged in, go to homepage
  useEffect(() => {
    if (auth.access) nav('/')
  }, [nav])

  // Initialize Google Sign-In button
  useEffect(() => {
    if (googleButtonRef.current) {
      // Small delay to ensure Google library is loaded
      const timer = setTimeout(() => {
        if (googleButtonRef.current) {
          renderGoogleButton(
            googleButtonRef.current,
            () => {
              // Successfully logged in with Google
              nav('/');
            },
            () => {
              setError('Google login failed. Please try again.');
            }
          );
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [nav])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const username = String(fd.get("username") || "").trim()
    const password = String(fd.get("password") || "")

    if (!username || !password) return

    setLoading(true)
    api.post('/token/', { username, password })
      .then(r => {
        const { access, refresh } = r.data || {}
        if (access && refresh) {
          auth.access = access
          auth.refresh = refresh
          nav('/');
        } else {
          setError('Invalid response from server.')
        }
      })
      .catch(err => {
        if (isAxiosError(err)) {
          setError(err.response?.data?.detail || 'Invalid username or password.')
        } else {
          setError('Could not log in. Please try again.')
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header: logo + title top-left */}
      <header className="absolute top-4 left-4 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="ArtFit Logo" className="w-12 h-12 object-contain" />
          <span className="text-3xl font-extrabold text-gray-900">ArtFit</span>
        </Link>
      </header>

      {/* Centered auth card */}
      <main className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full px-4">
          <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Login</h2>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your username"
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
                  name="password"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>

              {/* Google button under login */}
              <div ref={googleButtonRef} className="w-full"></div>
            </form>

            {/* Links */}
            <div className="mt-6 flex justify-between text-sm text-gray-700">
              <Link to="/register" className="hover:text-blue-600">
                Register
              </Link>
              <Link to="/forgot-password" className="hover:text-blue-600">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
