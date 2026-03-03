import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { api } from "../lib/api"
import { isAxiosError } from "axios"
import { motion } from "framer-motion"
import { Plus, X, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import logo from "../assets/logo.png"

type Skill = { id: number; name: string; kind: string }
type Role = "DEV" | "DES" | "BOTH"

export default function NewProject() {
  const nav = useNavigate()
  const [skills, setSkills] = useState<Skill[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [role, setRole] = useState<Role>("BOTH")
  const [tagIds, setTagIds] = useState<number[]>([])
  const [budgetMin, setBudgetMin] = useState<number | "">("")
  const [budgetMax, setBudgetMax] = useState<number | "">("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const [newTagKind, setNewTagKind] = useState<"ROLE" | "TOOL" | "STYLE" | "GENRE">("TOOL")

  useEffect(() => { api.get("/skills/").then((r) => setSkills(r.data)).catch(() => setSkills([])) }, [])

  function toggleTag(id: number) { setTagIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]) }

  async function addCustomTag(e: React.FormEvent) {
    e.preventDefault()
    if (!newTagName.trim()) return
    try {
      const r = await api.post("/skills/", { name: newTagName.trim(), kind: newTagKind })
      setSkills((prev) => [...prev, r.data].sort((a, b) => a.name.localeCompare(b.name)))
      setTagIds((prev) => [...prev, r.data.id])
      setNewTagName("")
    } catch { /* ignore duplicates */ }
  }

  function addImageUrl(e: React.FormEvent) {
    e.preventDefault()
    if (!newImageUrl.trim()) return
    setImageUrls((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl("")
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setLoading(true)
    try {
      const descWithImages = imageUrls.length ? `${description}\n\nImages:\n${imageUrls.join("\n")}` : description
      await api.post("/projects/", {
        title, description: descWithImages, looking_for_role: role, tag_ids: tagIds,
        budget_min: budgetMin === "" ? null : budgetMin, budget_max: budgetMax === "" ? null : budgetMax,
      })
      nav("/home")
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) setError("Please log in first.")
        else setError(err.response?.data?.detail ?? "Could not create project. Check required fields.")
      } else { setError("Unexpected error. Please try again.") }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="ArtFit" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
          </Link>
          <Link to="/home" className="text-sm text-slate-400 hover:text-white transition-colors">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Create a new project</h2>

          {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Label className="text-slate-200 mb-1">Title</Label>
              <Input className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11" placeholder="Project title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <Label className="text-slate-200 mb-1">Description</Label>
              <textarea className="block w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 px-4 py-3 text-sm min-h-[140px] focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="What are you building? Goals, scope, timelines..." value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div>
              <Label className="text-slate-200 mb-2">Looking for</Label>
              <div className="flex gap-3">
                {(["DEV", "DES", "BOTH"] as Role[]).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={cn(
                    "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                    role === r ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  )}>
                    {r === "DEV" ? "Developer" : r === "DES" ? "Designer" : "Both"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-slate-200">Tags</Label>
                <form className="flex items-center gap-2" onSubmit={addCustomTag}>
                  <Input className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-8 w-32 text-xs" placeholder="Custom tag" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                  <select className="rounded-xl bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-slate-300" value={newTagKind} onChange={(e) => setNewTagKind(e.target.value as typeof newTagKind)}>
                    <option value="ROLE" className="bg-slate-900">Role</option>
                    <option value="TOOL" className="bg-slate-900">Tool</option>
                    <option value="STYLE" className="bg-slate-900">Style</option>
                    <option value="GENRE" className="bg-slate-900">Genre</option>
                  </select>
                  <Button type="submit" size="sm" className="bg-white/10 text-white border border-white/10 rounded-xl h-8 text-xs"><Plus className="w-3 h-3" /></Button>
                </form>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <button key={s.id} type="button" onClick={() => toggleTag(s.id)} className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-all",
                    tagIds.includes(s.id) ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  )}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-200 mb-1">Budget min (optional)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11" placeholder="e.g. 1000" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
              <div>
                <Label className="text-slate-200 mb-1">Budget max (optional)</Label>
                <Input type="number" className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11" placeholder="e.g. 5000" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-slate-200 mb-2">Project images</Label>
              <form className="flex gap-2 mb-3" onSubmit={addImageUrl}>
                <Input className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-11" placeholder="Paste image URL and press Add" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                <Button type="submit" className="bg-white/10 text-white border border-white/10 rounded-xl"><Image className="w-4 h-4 mr-1" /> Add</Button>
              </form>
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10">
                      <img src={url} alt={`Project ${idx + 1}`} className="w-full h-32 object-cover" />
                      <button type="button" className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors" onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
