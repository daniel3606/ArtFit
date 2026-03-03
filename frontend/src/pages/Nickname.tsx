import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import logo from "../assets/logo.png"

export default function Nickname() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center px-6">
      <Link to="/" className="absolute top-6 left-6 flex items-center space-x-2">
        <img src={logo} alt="ArtFit" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Choose Nickname</h2>
        <p className="text-slate-400">This page is coming soon.</p>
      </motion.div>
    </div>
  )
}
