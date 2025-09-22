import { useMemo } from "react"
import { Link } from "react-router-dom"
import { auth } from "../lib/api"
import logo from "../assets/logo.png"

type Pin = {
  id: string
  title: string
  img: string
  author: string
  height: number
}

export default function HomePage() {
  // Mock pins with varying heights to emulate Pinterest
  const pins = useMemo<Pin[]>(() => {
    const imgs = [
      "https://images.unsplash.com/photo-1517816428104-797678c7cf0d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=1200&auto=format&fit=crop",
    ]
    return Array.from({ length: 24 }).map((_, i) => ({
      id: String(i + 1),
      title: `Inspiration ${i + 1}`,
      img: imgs[i % imgs.length],
      author: ["Alex", "Jordan", "Sam", "Taylor"][i % 4],
      height: 220 + ((i * 47) % 180),
    }))
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">ArtFit</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/projects/new" className="hover:text-blue-600">New project</Link>
              {auth.access ? (
                <Link to="/profile" className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 inline-flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">Me</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-600">Log in</Link>
                  <Link to="/register" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow">Join</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Search + filters */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <input
            placeholder="Search inspiration, styles, or tech…"
            className="w-full sm:max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <div className="flex gap-2 text-sm">
            <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">All</button>
            <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">Design</button>
            <button className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">Development</button>
          </div>
        </div>
      </div>

      {/* Masonry grid using CSS columns */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">{/* column-fill fix for Safari */}
          {pins.map((p) => (
            <article key={p.id} className="mb-4 break-inside-avoid rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
              <div className="relative w-full" style={{ height: p.height }}>
                <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                <div className="mt-1 text-xs text-gray-500">by {p.author}</div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
