import { useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api, auth } from "../lib/api"
import { motion } from "framer-motion"
import { Camera, Trash2, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import logo from "../assets/logo.png"

type User = { id: number; username: string; email: string; role?: string }
type Work = { id: number; title: string; image: string }

export default function Profile() {
  const nav = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [works, setWorks] = useState<Work[]>([])
  const [newWorkTitle, setNewWorkTitle] = useState("")
  const [newWorkFile, setNewWorkFile] = useState<File | null>(null)

  useEffect(() => {
    if (!auth.access) { setError("Not logged in"); setLoading(false); return }
    api.get("/accounts/me/")
      .then((r) => {
        setUser(r.data)
        if (r.data?.profile?.avatar) setAvatarPreview(r.data.profile.avatar)
        if (Array.isArray(r.data?.works)) setWorks(r.data.works)
      })
      .catch((err) => setError(`Failed to load user: ${err.response?.data?.detail || err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const roleBadge = useMemo(() => {
    const role = user?.role
    if (!role) return null
    const dev = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Developer</span>
    const des = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">Designer</span>
    if (role === "BOTH") return <div className="flex items-center gap-2">{dev}{des}</div>
    return role === "DEV" ? dev : des
  }, [user?.role])

  async function addWork(e: React.FormEvent) {
    e.preventDefault()
    if (!newWorkTitle.trim() || !newWorkFile) return
    const fd = new FormData()
    fd.append("title", newWorkTitle.trim())
    fd.append("image", newWorkFile)
    try {
      const r = await api.post("/accounts/works/", fd, { headers: { "Content-Type": "multipart/form-data" } })
      setWorks((prev) => [r.data, ...prev])
      setNewWorkTitle(""); setNewWorkFile(null)
    } catch { /* ignore */ }
  }

  async function removeWork(id: number) {
    try { await api.delete(`/accounts/works/${id}/`); setWorks((prev) => prev.filter((w) => w.id !== id)) } catch { /* ignore */ }
  }

  async function onAvatarFileChange(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(String(reader.result))
    reader.readAsDataURL(file)
    const fd = new FormData()
    fd.append("avatar", file)
    try { await api.patch("/accounts/profile/", fd, { headers: { "Content-Type": "multipart/form-data" } }) } catch { /* ignore */ }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>
  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => nav("/login")} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">Go to Login</Button>
      </div>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="ArtFit" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/home" className="text-sm text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/settings" className="text-sm text-slate-400 hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {avatarPreview ? <AvatarImage src={avatarPreview} alt="Avatar" /> : null}
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
                    {user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatarFileChange(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                {roleBadge}
              </div>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <div className="mt-4">
                <button
                  onClick={() => { auth.clear(); nav("/login") }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Works grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">My Work</h2>
            <form className="flex items-center gap-2" onSubmit={addWork}>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-9 w-40" placeholder="Title" value={newWorkTitle} onChange={(e) => setNewWorkTitle(e.target.value)} />
              <label className="px-3 py-2 rounded-xl text-sm border border-white/10 text-slate-400 hover:text-white hover:border-white/20 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewWorkFile(e.target.files?.[0] || null)} />
                Choose
              </label>
              <Button type="submit" disabled={!newWorkTitle || !newWorkFile} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl disabled:opacity-40">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </div>
          {works.length === 0 ? (
            <p className="text-slate-500 text-sm">No work added yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {works.map((w) => (
                <div key={w.id} className="group rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <div className="relative h-36 w-full">
                    <img src={w.image} alt={w.title} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{w.title}</span>
                    <button onClick={() => removeWork(w.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
