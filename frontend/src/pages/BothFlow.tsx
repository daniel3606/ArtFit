import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import DeveloperSkills from "./DeveloperSkills"
import DesignSkills from "./DesignSkills"
import logo from "../assets/logo.png"

export default function BothFlow() {
  const [step, setStep] = useState<0 | 1>(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="ArtFit" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ArtFit</span>
            </Link>
            <span className="text-sm text-slate-400">
              Step {step + 1} of 2 — {step === 0 ? "Developer" : "Designer"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: "50%" }}
              animate={{ width: step === 0 ? "50%" : "100%" }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      <div className="pb-24">
        {step === 0 ? <DeveloperSkills /> : <DesignSkills />}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          {step === 1 ? (
            <button onClick={() => setStep(0)} className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors">
              Back
            </button>
          ) : <div />}
          {step === 0 ? (
            <button onClick={() => setStep(1)} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
              Next
            </button>
          ) : (
            <Link to="/home" className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
              Finish
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
