import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { CreateProjectForm } from '../components/CreateProjectform'

export const Route = createFileRoute('/matters/$matterId')({
  component: MatterDetail,
})

function MatterDetail() {
  const { matterId } = Route.useParams()
  const matter = useQuery(api.matters.get, { 
    matterId: matterId as Id<'matters'> 
  })
  const projects = useQuery(api.projects.listByMatter, {
    matterId: matterId as Id<'matters'>
  });

  if (matter === undefined) {
    return <main className="p-8">Loading...</main>
  }

  if (matter === null) {
    return <main className="p-8">Matter not found.</main>
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">Matter</p>
        <h1 className="text-3xl font-bold">{matter.name}</h1>
        <p className="text-gray-500 mt-1">
          {matter.matterNumber} · {matter.jurisdiction}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Projects</h2>
          <CreateProjectForm matterId={matter._id} />
          {projects === undefined ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500 text-sm">No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <div key={project._id}>{project.name}</div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}