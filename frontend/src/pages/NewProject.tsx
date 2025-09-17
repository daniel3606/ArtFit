import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { isAxiosError } from 'axios'


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

  useEffect(() => {
    api.get('/skills/').then(r => setSkills(r.data)).catch(() => setSkills([]))
  }, [])

  function toggleTag(id: number) {
    setTagIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      await api.post('/projects/', {
        title,
        description,
        looking_for_role: role,
        tag_ids: tagIds,
        budget_min: budgetMin === '' ? null : budgetMin,
        budget_max: budgetMax === '' ? null : budgetMax,
      })
      nav('/')
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
    <form onSubmit={onSubmit} className="p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">New Project</h2>
      {error && <div className="text-red-600">{error}</div>}

      <input className="border p-2 w-full" placeholder="Title"
             value={title} onChange={e=>setTitle(e.target.value)} />

      <textarea className="border p-2 w-full min-h-[120px]" placeholder="Description"
                value={description} onChange={e=>setDescription(e.target.value)} />

      <div>
        <label className="block font-medium mb-1">Looking for</label>
        <select className="border p-2" value={role} onChange={e=>setRole(e.target.value as Role)}>
          <option value="DEV">Developer</option>
          <option value="DES">Designer</option>
          <option value="BOTH">Both</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {skills.map(s => (
          <label key={s.id} className="flex items-center gap-2 border p-2 rounded">
            <input
              type="checkbox"
              checked={tagIds.includes(s.id)}
              onChange={() => toggleTag(s.id)}
            />
            <span>{s.name} <span className="text-gray-500">({s.kind})</span></span>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <input className="border p-2 w-1/2" placeholder="Budget min (optional)" type="number"
               value={budgetMin} onChange={e=>setBudgetMin(e.target.value === '' ? '' : Number(e.target.value))} />
        <input className="border p-2 w-1/2" placeholder="Budget max (optional)" type="number"
               value={budgetMax} onChange={e=>setBudgetMax(e.target.value === '' ? '' : Number(e.target.value))} />
      </div>

      <button className="border px-4 py-2" type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create Project'}
      </button>
    </form>
  )
}
