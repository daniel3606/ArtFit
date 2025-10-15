import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, auth } from '../lib/api'
import logo from '../assets/logo.png'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('recentSearches') || '[]') } catch { return [] }
  })

  useEffect(() => {
    if (searchTerm.length > 2) {
      setLoading(true)
      api.get(`/projects/?search=${encodeURIComponent(searchTerm)}`)
        .then(r => setResults(r.data?.results || r.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    } else {
      setResults([])
    }
  }, [searchTerm])

  function performSearch(term: string) {
    setSearchTerm(term)
    if (term.trim()) {
      setRecentSearches(prev => {
        const updated = [term, ...prev.filter(s => s !== term)].slice(0, 10)
        localStorage.setItem('recentSearches', JSON.stringify(updated))
        return updated
      })
    }
  }

  function clearRecentSearches() {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            
            <Link to="/search" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200 group">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-medium text-purple-700">Search</span>
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

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to={auth.access ? "/home" : "/"} className="flex items-center gap-2">
              <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">ArtFit</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/home" className="hover:text-blue-600">Home</Link>
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

      <main className="lg:ml-64 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Projects</h1>
          <p className="text-gray-600">Find the perfect collaboration opportunities</p>
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, description, skills, or role..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={searchTerm}
              onChange={(e) => performSearch(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && !searchTerm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent searches</h2>
              <button onClick={clearRecentSearches} className="text-sm text-gray-500 hover:text-gray-700">
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => performSearch(search)}
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchTerm && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
            </h2>
            
            {results.length === 0 && !loading ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500">No projects found matching "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or check your spelling</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        project.looking_for_role === 'DEV' ? 'bg-emerald-100 text-emerald-700' :
                        project.looking_for_role === 'DES' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {project.looking_for_role === 'DEV' ? 'Developer' :
                         project.looking_for_role === 'DES' ? 'Designer' : 'Both'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>by {project.owner.username}</span>
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        {(project.budget_min || project.budget_max) && (
                          <span>
                            ${project.budget_min || 0} - ${project.budget_max || '∞'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag.id} className="px-2 py-0.5 bg-gray-100 text-xs rounded">
                            {tag.name}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-xs rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
