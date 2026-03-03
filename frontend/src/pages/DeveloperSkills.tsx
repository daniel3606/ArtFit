import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import logo from "../assets/logo.png"

const developerCategories = [
  { title: "Languages", tags: ["JavaScript", "TypeScript", "Python", "Java", "C#", "Ruby", "PHP", "Swift"] },
  { title: "Frameworks / Libraries", tags: ["React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask"] },
  { title: "Tools / IDEs", tags: ["VSCode", "WebStorm", "IntelliJ IDEA", "Git", "GitHub", "Docker", "Kubernetes", "npm/yarn"] },
  { title: "Databases", tags: ["MySQL", "PostgreSQL", "MongoDB", "Firebase", "SQLite", "Redis", "Cassandra", "Elasticsearch"] },
  { title: "Cloud Services", tags: ["AWS", "Azure", "Google Cloud", "Heroku", "Netlify", "Vercel", "DigitalOcean", "Linode"] },
]

export default function DeveloperSkills() {
  const [selected, setSelected] = useState<string[]>([])
  const location = useLocation()
  const isBothFlow = location.state?.role === "BOTH"

  function toggleSkill(skill: string) {
    setSelected((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col px-6 py-8">
      <Link to="/" className="flex items-center space-x-2 mb-8">
        <img src={logo} alt="ArtFit" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
      </Link>

      <div className="flex flex-col items-center flex-1">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-10 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Select Your Developer Skills
        </motion.h2>

        <div className="w-full max-w-4xl space-y-8">
          {developerCategories.map((category, ci) => (
            <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">{category.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {category.tags.map((tag) => {
                  const active = selected.includes(tag)
                  return (
                    <button key={tag} type="button" aria-pressed={active} onClick={() => toggleSkill(tag)} className={cn(
                      "px-4 py-2.5 text-sm rounded-xl border-2 font-medium transition-all",
                      active ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                    )}>
                      {tag}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
          {isBothFlow ? (
            <Link to="/designskills" state={{ role: "BOTH" }} className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
              Next
            </Link>
          ) : (
            <Link to="/home" className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
              Continue
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}
