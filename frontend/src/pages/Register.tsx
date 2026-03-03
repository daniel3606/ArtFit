import { useEffect, useMemo, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api, auth } from "../lib/api"
import { isAxiosError } from "axios"
import { renderGoogleButton } from "../lib/google-auth"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react"
import logo from "../assets/logo.png"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Role = "DEV" | "DES" | "BOTH"

function BGPattern() {
  return (
    <div
      className="absolute inset-0 z-0 size-full [mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]"
      style={{
        backgroundImage: "radial-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  )
}

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [pickDev, setPickDev] = useState(false)
  const [pickDes, setPickDes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = "ArtFit - Create Account"
  }, [])

  useEffect(() => {
    if (googleButtonRef.current) {
      const timer = setTimeout(() => {
        if (googleButtonRef.current) {
          renderGoogleButton(
            googleButtonRef.current,
            (response) => {
              if (response.is_new_user) {
                nav("/")
              } else {
                nav("/")
              }
            },
            () => setError("Google login failed. Please try again.")
          )
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [nav])

  const role: Role | null = useMemo(() => {
    if (pickDev && pickDes) return "BOTH"
    if (pickDev) return "DEV"
    if (pickDes) return "DES"
    return null
  }, [pickDev, pickDes])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!role) {
      setError("Please choose Developer and/or Designer.")
      return
    }

    setLoading(true)
    try {
      const response = await api.post("/accounts/register/", { username, email, password, role })
      const { access, refresh } = response.data
      if (access && refresh) {
        auth.access = access
        auth.refresh = refresh
      }
      if (role === "DEV") nav("/developerskills")
      else if (role === "DES") nav("/designskills")
      else nav("/both")
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.username?.[0] ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.detail ||
          "Could not register. Try a different username/email."
        setError(errorMessage)
      } else {
        setError("Unexpected error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <BGPattern />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)]" />

      {/* Logo */}
      <Link to="/" className="absolute top-6 left-6 z-10 flex items-center space-x-2">
        <img src={logo} alt="ArtFit" className="h-10 w-10 object-contain" />
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ArtFit
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="relative backdrop-blur-xl bg-white/5 border-2 border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-slate-300 text-sm">Join the creative community</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2">
                <Label htmlFor="username" className="text-slate-200 text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl"
                  />
                </div>
              </motion.div>

              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }} className="space-y-2">
                <Label className="text-slate-200 text-sm font-medium">I am a...</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPickDev((v) => !v)}
                    className={cn(
                      "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                      pickDev
                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                    )}
                    aria-pressed={pickDev}
                  >
                    Developer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickDes((v) => !v)}
                    className={cn(
                      "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                      pickDes
                        ? "border-pink-500 bg-pink-500/20 text-pink-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                    )}
                    aria-pressed={pickDes}
                  >
                    Designer
                  </button>
                </div>
                <p className="text-xs text-slate-500">Select one or both.</p>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-slate-400">Or continue with</span>
                </div>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                <div ref={googleButtonRef} className="w-full" />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm text-slate-300">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Sign In
                </Link>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
