import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { DocumentUpload } from '#/components/DocumentUpload'

export const Route = createFileRoute('/tasks/$taskId')({
  component: TaskDetail,
})

function TaskDetail() {
  const { taskId } = Route.useParams()
  const task = useQuery(api.tasks.get, {
    taskId: taskId as Id<'tasks'>
  })
  const updateTask = useMutation(api.tasks.update)

  async function handleStatusChange(currentStatus: 'todo' | 'in_progress' | 'done') {
    const nextStatus = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    } as const

    await updateTask({
      taskId: taskId as Id<'tasks'>,
      status: nextStatus[currentStatus],
    })
  }

  if (task === undefined) {
    return <main className="p-8">Loading...</main>
  }

  if (task === null) {
    return <main className="p-8">Task not found.</main>
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">Task</p>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <div className="flex gap-2 mt-2">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {task.status}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-gray-500 mt-4">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="text-sm text-gray-500 mt-2">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <DocumentUpload taskId={task._id} />
      <button
        onClick={() => handleStatusChange(task.status)}
        className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700"
      >
        Move to {task.status === 'todo' ? 'In Progress' : task.status === 'in_progress' ? 'Done' : 'Todo'}
      </button>
    </main>
  )
}