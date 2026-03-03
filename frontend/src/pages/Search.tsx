import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { api, auth } from "../lib/api"
import { motion } from "framer-motion"
import { Search as SearchIcon, Compass, Plus, Settings as SettingsIcon, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import logo from "../assets/logo.png"

type SearchResult = {
  id: number
  title: string
  description: string
  looking_for_role: string
  budget_min?: number
  budget_max?: number
  tags: Array<{ id: number; name: string; kind: string }>
  owner: { username: string }
  created_at: string
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("recentSearches") || "[]") } catch { return [] }
  })

  useEffect(() => {
    if (searchTerm.length > 2) {
      setLoading(true)
      api.get(`/projects/?search=${encodeURIComponent(searchTerm)}`)
        .then((r) => setResults(r.data?.results || r.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    } else { setResults([]) }
  }, [searchTerm])

  function performSearch(term: string) {
    setSearchTerm(term)
    if (term.trim()) {
      setRecentSearches((prev) => {
        const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 10)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
        return updated
      })
    }
  }

  const navItems = [
    { icon: Compass, label: "Explore", to: "/home", active: false },
    { icon: SearchIcon, label: "Search", to: "/search", active: true },
    { icon: Plus, label: "Add Project", to: "/projects/new", active: false },
    { icon: SettingsIcon, label: "Settings", to: "/settings", active: false },
    { icon: User, label: "Profile", to: "/profile", active: false },
  ]

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
          <div className="flex items-center gap-3 text-sm">
            <Link to="/home" className="text-slate-400 hover:text-white">Home</Link>
            {auth.access && <Link to="/profile" className="text-slate-400 hover:text-white">Profile</Link>}
          </div>
        </div>
      </header>

      <main className="lg:ml-64 max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Search Projects</h1>
          <p className="text-slate-400 mb-8">Find the perfect collaboration opportunities</p>
        </motion.div>

        {/* Search bar */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by title, description, skills, or role..."
            className="w-full pl-12 pr-4 py-6 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-2xl focus:ring-2 focus:ring-purple-500/50"
            value={searchTerm}
            onChange={(e) => performSearch(e.target.value)}
          />
          {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-slate-600 border-t-purple-400 rounded-full animate-spin" />}
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && !searchTerm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent searches</h2>
              <button onClick={() => { setRecentSearches([]); localStorage.removeItem("recentSearches") }} className="text-sm text-slate-500 hover:text-slate-300">Clear all</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, i) => (
                <button key={i} onClick={() => performSearch(s)} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchTerm && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {loading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
            </h2>
            {results.length === 0 && !loading ? (
              <div className="text-center py-16">
                <SearchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No projects found matching "{searchTerm}"</p>
                <p className="text-sm text-slate-500 mt-1">Try different keywords or check your spelling</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((project) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        project.looking_for_role === "DEV" ? "bg-emerald-500/20 text-emerald-300" :
                        project.looking_for_role === "DES" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                      )}>
                        {project.looking_for_role === "DEV" ? "Developer" : project.looking_for_role === "DES" ? "Designer" : "Both"}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>by {project.owner.username}</span>
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        {(project.budget_min || project.budget_max) && <span>${project.budget_min || 0} - ${project.budget_max || "∞"}</span>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag.id} className="px-2 py-0.5 bg-white/5 border border-white/10 text-xs rounded-full text-slate-400">{tag.name}</span>
                        ))}
                        {project.tags.length > 3 && <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-xs rounded-full text-slate-400">+{project.tags.length - 3}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
