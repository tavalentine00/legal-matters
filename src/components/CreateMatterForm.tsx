import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'

export function CreateMatterForm() {
  const createMatter = useMutation(api.matters.create)

  const [name, setName] = useState('')
  const [matterNumber, setMatterNumber] = useState('')
  const [jurisdiction, setJurisdiction] = useState('')
  const [status, setStatus] = useState<'active' | 'closed' | 'pending'>('active')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    await createMatter({
      name,
      matterNumber,
      jurisdiction,
      status,
      description: description || undefined,
    })

    setName('')
    setMatterNumber('')
    setJurisdiction('')
    setStatus('active')
    setDescription('')
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">New Matter</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Matter Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Smith vs. Johnson"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Matter Number</label>
        <input
          type="text"
          value={matterNumber}
          onChange={(e) => setMatterNumber(e.target.value)}
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="2024-001"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Jurisdiction</label>
        <input
          type="text"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="California"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'active' | 'closed' | 'pending')}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Brief description of the matter..."
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Matter'}
      </button>
    </form>
  )
}