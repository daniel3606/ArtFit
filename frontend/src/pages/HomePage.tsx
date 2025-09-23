import { useMemo, useState } from "react"
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
  const [menuOpen, setMenuOpen] = useState(false)
  
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <div className="p-6">
          {/* Logo */}
          <Link to={auth.access ? "/home" : "/"} className="flex items-center gap-3 mb-8">
            <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-extrabold tracking-tight">ArtFit</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to="/home" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <span className="font-medium">Explore</span>
            </Link>
            
            <Link to="/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-medium">Search</span>
            </Link>
            
            <Link to="/projects/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium">Add Project</span>
            </Link>
            
            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium">Settings</span>
            </Link>
            
            {auth.access && (
              <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300">
                  <span className="text-xs font-semibold text-gray-700">Me</span>
                </div>
                <span className="font-medium">Profile</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navbar */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to={auth.access ? "/home" : "/"} className="flex items-center gap-2">
              <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">ArtFit</span>
            </Link>
            <div className="flex items-center gap-4">
              {/* Hamburger menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1">
                  <div className={`h-0.5 bg-gray-600 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`h-0.5 bg-gray-600 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`h-0.5 bg-gray-600 transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="space-y-4">
                <Link to="/home" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Explore</span>
                </Link>
                
                <Link to="/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Search</span>
                </Link>
                
                <Link to="/projects/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="font-medium">Add Project</span>
                </Link>
                
                <Link to="/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Settings</span>
                </Link>
                
                {auth.access && (
                  <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-700">Me</span>
                    </div>
                    <span className="font-medium">Profile</span>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content with sidebar offset */}
      <div className="lg:ml-64">
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
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">{/* column-fill fix for Safari */}
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
    </div>
  )
}
