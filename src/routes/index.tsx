import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

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

      {matters === undefined ? (
        <p className="text-gray-500">Loading...</p>
      ) : matters.length === 0 ? (
        <p className="text-gray-500">No matters yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {matters.map((matter) => (
            <div
              key={matter._id}
              className="border border-gray-200 rounded-xl p-5"
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
            </div>
          ))}
        </div>
      )}
    </main>
  )
}