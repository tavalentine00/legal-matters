import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const matters = useQuery(api.matters.list)

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Legal Matters</h1>
      <p className="mt-2 text-gray-500">
        {matters === undefined
          ? 'Loading...'
          : matters.length === 0
            ? 'No matters yet.'
            : `${matters.length} matter(s)`}
      </p>
    </main>
  )
}