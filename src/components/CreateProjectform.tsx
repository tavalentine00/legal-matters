import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import type { Id } from '../../convex/_generated/dataModel'

export function CreateProjectForm({ matterId }: { matterId: Id<'matters'> }) {
  const createProject = useMutation(api.projects.create)

  const [name, setName] = useState('')
  const [status, setStatus] = useState<'active' | 'completed' | 'on_hold'>('active')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    await createProject({
      matterId,
      name,
      status,
    })

    setName('')
    setStatus('active')
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-gray-200 rounded-xl p-4">
      <h3 className="font-medium">New Project</h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Discovery"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'active' | 'completed' | 'on_hold')}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  )
}