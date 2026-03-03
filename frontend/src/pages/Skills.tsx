import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"
import { motion } from "framer-motion"
import logo from "../assets/logo.png"

type Skill = { id: number; name: string; kind: string }

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/skills/").then((r) => setSkills(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading skills...</div>

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.kind] ??= []).push(s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 py-8">
      <Link to="/" className="flex items-center space-x-2 mb-8">
        <img src={logo} alt="ArtFit" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
      </Link>

      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Skill Tags
        </motion.h2>

        <div className="space-y-6">
          {Object.entries(grouped).map(([kind, items], i) => (
            <motion.div key={kind} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{kind}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span key={s.id} className="px-3 py-1.5 rounded-full text-sm border border-white/10 bg-white/5 text-slate-300">{s.name}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
