import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { isAxiosError } from 'axios'
import logo from '../assets/logo.png'


type Skill = { id: number; name: string; kind: string }
type Role = 'DEV' | 'DES' | 'BOTH'

export default function NewProject() {
  const nav = useNavigate()
  const [skills, setSkills] = useState<Skill[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [role, setRole] = useState<Role>('BOTH')
  const [tagIds, setTagIds] = useState<number[]>([])
  const [budgetMin, setBudgetMin] = useState<number | ''>('')
  const [budgetMax, setBudgetMax] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [newTagKind, setNewTagKind] = useState<'ROLE' | 'TOOL' | 'STYLE' | 'GENRE'>('TOOL')

  useEffect(() => {
    api.get('/skills/').then(r => setSkills(r.data)).catch(() => setSkills([]))
  }, [])

  function toggleTag(id: number) {
    setTagIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function addCustomTag(e: React.FormEvent) {
    e.preventDefault()
    const name = newTagName.trim()
    if (!name) return
    try {
      const r = await api.post('/skills/', { name, kind: newTagKind })
      const created: Skill = r.data
      setSkills(prev => [...prev, created].sort((a,b)=>a.name.localeCompare(b.name)))
      setTagIds(prev => [...prev, created.id])
      setNewTagName('')
    } catch (err) {
      // ignore duplicate errors silently; user can select existing
    }
  }

  function addImageUrl(e: React.FormEvent) {
    e.preventDefault()
    const url = newImageUrl.trim()
    if (!url) return
    setImageUrls(prev => [...prev, url])
    setNewImageUrl('')
  }

  function removeImageUrl(idx: number) {
    setImageUrls(prev => prev.filter((_, i) => i !== idx))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      // Append image URLs to description for now so they are saved
      const descWithImages = imageUrls.length
        ? `${description}\n\nImages:\n${imageUrls.join('\n')}`
        : description
      await api.post('/projects/', {
        title,
        description: descWithImages,
        looking_for_role: role,
        tag_ids: tagIds,
        budget_min: budgetMin === '' ? null : budgetMin,
        budget_max: budgetMax === '' ? null : budgetMax,
      })
      nav('/home')
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) setError('Please log in first.')
        else setError(err.response?.data?.detail ?? 'Could not create project. Check required fields.')
      } else {
        setError('Unexpected error. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="ArtFit Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-extrabold tracking-tight">ArtFit</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/home" className="hover:text-blue-600">Home</Link>
              <Link to="/projects/new" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow">New project</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a new project</h2>

          {error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                     placeholder="Project title"
                     value={title} onChange={e=>setTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm min-h-[140px] focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="What are you building? Goals, scope, timelines…"
                        value={description} onChange={e=>setDescription(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
              <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      value={role} onChange={e=>setRole(e.target.value as Role)}>
                <option value="DEV">Developer</option>
                <option value="DES">Designer</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <form className="flex items-center gap-2" onSubmit={addCustomTag}>
                  <input className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                         placeholder="Add custom tag"
                         value={newTagName}
                         onChange={e=>setNewTagName(e.target.value)} />
                  <select className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm" value={newTagKind} onChange={e=>setNewTagKind(e.target.value as any)}>
                    <option value="ROLE">Role</option>
                    <option value="TOOL">Tool</option>
                    <option value="STYLE">Style</option>
                    <option value="GENRE">Genre</option>
                  </select>
                  <button type="submit" className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Add</button>
                </form>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {skills.map(s => (
                  <label key={s.id} className={[
                    'flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm',
                    tagIds.includes(s.id) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                  ].join(' ')}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={tagIds.includes(s.id)} onChange={() => toggleTag(s.id)} />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{s.kind}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget min (optional)</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                       type="number"
                       placeholder="e.g. 1000"
                       value={budgetMin}
                       onChange={e=>setBudgetMin(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget max (optional)</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                       type="number"
                       placeholder="e.g. 5000"
                       value={budgetMax}
                       onChange={e=>setBudgetMax(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>

            {/* Images (URLs) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project images</label>
              <form className="flex gap-2 mb-3" onSubmit={addImageUrl}>
                <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Paste image URL and press Add"
                       value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} />
                <button className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50" type="submit">Add</button>
              </form>
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <img src={url} alt={`Project ${idx+1}`} className="w-full h-32 object-cover" />
                      <button type="button" className="absolute top-1 right-1 rounded bg-white/90 text-xs px-2 py-0.5 shadow hover:bg-white" onClick={()=>removeImageUrl(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">Images are saved as links inside the description for now.</p>
            </div>

            <div className="pt-2">
              <button className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
                      type="submit" disabled={loading}>
                {loading ? 'Creating…' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
