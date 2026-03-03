import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, auth } from "../lib/api"
import { motion } from "framer-motion"
import { Compass, Search, Plus, Settings as SettingsIcon, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "../assets/logo.png"

type UserData = { id: number; username: string; email: string; role?: string }

export default function Settings() {
  const nav = useNavigate()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({ emailUpdates: true, projectMatches: true, messages: true, weeklyDigest: false })
  const [privacy, setPrivacy] = useState({ profileVisibility: "public", showEmail: false, allowMessages: true })

  useEffect(() => {
    if (!auth.access) { nav("/login"); return }
    api.get("/accounts/me/").then((r) => setUser(r.data)).catch(() => setError("Failed to load user")).finally(() => setLoading(false))
  }, [nav])

  function handleLogout() { auth.clear(); nav("/login") }

  const navItems = [
    { icon: Compass, label: "Explore", to: "/home", active: false },
    { icon: Search, label: "Search", to: "/search", active: false },
    { icon: Plus, label: "Add Project", to: "/projects/new", active: false },
    { icon: SettingsIcon, label: "Settings", to: "/settings", active: true },
    { icon: User, label: "Profile", to: "/profile", active: false },
  ]

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">{error}</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800 z-20">
        <div className="p-6">
          <Link to="/home" className="flex items-center gap-3 mb-8">
            <img src={logo} alt="ArtFit" className="h-9 w-9 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                item.active ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.active && "bg-gradient-to-br from-purple-500 to-pink-500")}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="ArtFit" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
          </Link>
          <Link to="/home" className="text-sm text-slate-400 hover:text-white">Home</Link>
        </div>
      </header>

      <main className="lg:ml-64 max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400 mb-8">Manage your account preferences and privacy</p>
        </motion.div>

        <div className="space-y-6">
          {/* Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div><label className="block text-sm text-slate-400 mb-1">Username</label><div>{user.username}</div></div>
              <div><label className="block text-sm text-slate-400 mb-1">Email</label><div>{user.email}</div></div>
              <div><label className="block text-sm text-slate-400 mb-1">Role</label><div>{user.role === "DEV" ? "Developer" : user.role === "DES" ? "Designer" : "Both"}</div></div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-5">
              {[
                { key: "emailUpdates", label: "Email updates", desc: "Receive updates about your account and platform changes" },
                { key: "projectMatches", label: "Project matches", desc: "Get notified when new projects match your skills" },
                { key: "messages", label: "Messages", desc: "Notify me when I receive new messages" },
                { key: "weeklyDigest", label: "Weekly digest", desc: "Get a weekly summary of activity and opportunities" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div><div className="font-medium">{label}</div><div className="text-sm text-slate-500">{desc}</div></div>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      notifications[key as keyof typeof notifications] ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-700"
                    )}
                  >
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      notifications[key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Privacy</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Profile Visibility</label>
                <select value={privacy.profileVisibility} onChange={(e) => setPrivacy((p) => ({ ...p, profileVisibility: e.target.value }))}
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white">
                  <option value="public" className="bg-slate-900">Public - Anyone can see your profile</option>
                  <option value="members" className="bg-slate-900">Members only - Only logged in users</option>
                  <option value="private" className="bg-slate-900">Private - Only you can see your profile</option>
                </select>
              </div>
              {[
                { key: "showEmail", label: "Show email address", desc: "Allow others to see your email on your profile" },
                { key: "allowMessages", label: "Allow messages", desc: "Let other users send you direct messages" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div><div className="font-medium">{label}</div><div className="text-sm text-slate-500">{desc}</div></div>
                  <button
                    onClick={() => setPrivacy((p) => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      privacy[key as keyof typeof privacy] ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-slate-700"
                    )}
                  >
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      privacy[key as keyof typeof privacy] ? "translate-x-6" : "translate-x-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div><div className="font-medium">Log out</div><div className="text-sm text-slate-500">Sign out of your account on this device</div></div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
