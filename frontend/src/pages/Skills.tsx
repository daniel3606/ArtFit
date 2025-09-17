import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Skill = { id: number; name: string; kind: string }

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/skills/')
      .then(r => setSkills(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading skills…</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-3">Skill Tag List</h2>
      <ul className="list-disc pl-5 space-y-1">
        {skills.map(s => <li key={s.id}>{s.name} <span className="text-gray-500">({s.kind})</span></li>)}
      </ul>
    </div>
  )
}
