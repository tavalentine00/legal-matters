import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { CreateTaskForm } from '../components/CreateTaskForm'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetail,
})

function ProjectDetail() {
  const { projectId } = Route.useParams()
  const project = useQuery(api.projects.get, {
    projectId: projectId as Id<'projects'>
  })
  const tasks = useQuery(api.tasks.listByProject, {
    projectId: projectId as Id<'projects'>
  })

  if (project === undefined || tasks === undefined) {
    return <main className="p-8">Loading...</main>
  }

  if (project === null) {
    return <main className="p-8">Project not found.</main>
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">Project</p>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {project.status}
        </span>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Tasks</h2>

        <CreateTaskForm projectId={project._id} />

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm mt-4">No tasks yet.</p>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{task.title}</span>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {task.priority}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}