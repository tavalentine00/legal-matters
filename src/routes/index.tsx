import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { CreateMatterForm } from '../components/CreateMatterForm'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const matters = useQuery(api.matters.list)

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Legal Matters</h1>
        <span className="text-sm text-gray-500">
          {matters === undefined ? '...' : `${matters.length} matter(s)`}
        </span>
      </div>

      <CreateMatterForm />

      {matters === undefined ? (
        <p className="text-gray-500">Loading...</p>
      ) : matters.length === 0 ? (
        <p className="text-gray-500">No matters yet.</p>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {matters.map((matter) => (
            
              <a key={matter._id}
              href={`/matters/${matter._id}`}
              className="border border-gray-200 rounded-xl p-5 block hover:border-gray-400 transition-colors no-underline text-inherit"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{matter.name}</h2>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {matter.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {matter.matterNumber} · {matter.jurisdiction}
              </p>
              {matter.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {matter.description}
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}