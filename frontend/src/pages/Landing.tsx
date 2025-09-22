import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { auth } from "../lib/api"
import logo from "../assets/logo.png"

export default function Landing() {
  const nav = useNavigate()
  useEffect(() => {
    if (auth.access) nav('/home')
  }, [nav])
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="ArtFit Logo" className="h-9 w-9 object-contain" />
              <span className="text-xl font-extrabold tracking-tight">ArtFit</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="hover:text-blue-600">Features</a>
              <a href="#how" className="hover:text-blue-600">How it works</a>
              <a href="#faq" className="hover:text-blue-600">FAQ</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Match <span className="text-blue-600">Developers</span> &{" "}
                <span className="text-blue-600">Designers</span> to build faster.
              </h1>
              <p className="mt-4 text-gray-600 text-lg">
                ArtFit connects creators by skills, style, and goals. Assemble the perfect duo for your next app,
                product, or brand—without the endless DMs.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
                >
                  Create your free account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Real-time matching
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                  Curated skill tags
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-500" />
                  Portfolio-first
                </div>
              </div>
            </div>

            {/* Mock preview card */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 h-56 w-56 bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
              <div className="absolute -bottom-8 -left-14 h-56 w-56 bg-indigo-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

              <div className="relative rounded-2xl border border-gray-200 shadow-lg overflow-hidden bg-white">
                <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-sm text-gray-500">ArtFit · Project Match</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-200 p-4">
                      <div className="text-xs text-gray-500">Developer</div>
                      <div className="mt-1 font-semibold">TypeScript · React · Django</div>
                      <div className="mt-3 text-sm text-gray-600">
                        Seeking a designer for a wellness app MVP.
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4">
                      <div className="text-xs text-gray-500">Designer</div>
                      <div className="mt-1 font-semibold">UI/UX · Design Systems · Figma</div>
                      <div className="mt-3 text-sm text-gray-600">
                        Looking for a dev to build a clean, accessible UI kit.
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-4 sm:col-span-2">
                      <div className="text-xs text-gray-500">Smart match</div>
                      <div className="mt-2 h-2 w-full rounded bg-gray-100 overflow-hidden">
                        <div className="h-2 bg-blue-600 w-2/3" />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">67% fit · based on skills & tags</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Preview UI. Replace with your screenshots later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Why teams start on ArtFit</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Skill-driven matching",
                desc: "Select languages, tools, and styles to find collaborators who fit your stack and aesthetic.",
              },
              {
                title: "Portfolio-first profiles",
                desc: "Showcase your best work and see others’ at a glance—no cold outreach guessing.",
              },
              {
                title: "Frictionless start",
                desc: "Kick off a project with clear roles, tags, and expectations right from the first chat.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">How it works</h2>
          <ol className="grid md:grid-cols-3 gap-6 text-sm">
            {[
              { step: "1", title: "Create your profile", desc: "Pick developer/designer (or both) and select tags." },
              { step: "2", title: "Get matched", desc: "Our engine surfaces high-fit collaborators and projects." },
              { step: "3", title: "Build together", desc: "Start fast with shared context and organized project spaces." },
            ].map((s) => (
              <li key={s.step} className="rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
                <div className="text-xs text-gray-500">Step {s.step}</div>
                <div className="mt-1 font-semibold">{s.title}</div>
                <p className="mt-2 text-gray-600">{s.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow"
            >
              Start for free
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Common questions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold">Is ArtFit free?</h3>
              <p className="text-gray-600 mt-2">Yes—get started free. We’ll add paid pro features later.</p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold">How do matches work?</h3>
              <p className="text-gray-600 mt-2">We blend your role, skills, and style tags to recommend collaborators.</p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold">Can I be both dev and designer?</h3>
              <p className="text-gray-600 mt-2">Absolutely. Pick BOTH and you’ll step through both skill screens.</p>
            </div>
            <div className="rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold">Can teams use ArtFit?</h3>
              <p className="text-gray-600 mt-2">Yes—form ad-hoc teams and invite collaborators to shared spaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-sm text-gray-500 flex flex-col md:flex-row items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ArtFit Logo" className="h-5 w-5 object-contain" />
            <span>© {new Date().getFullYear()} ArtFit</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#how" className="hover:text-blue-600">How it works</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
            <Link to="/login" className="hover:text-blue-600">Log in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
