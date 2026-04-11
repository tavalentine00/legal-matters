import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import type { Id } from '../../convex/_generated/dataModel'

export function CreateTaskForm({ projectId }: { projectId: Id<'projects'> }) {
    const createTask = useMutation(api.tasks.create)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [dueDate, setDueDate] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)

        await createTask({
            projectId,
            title,
            description: description || undefined,
            status,
            priority,
            dueDate: dueDate || undefined,
          })

        setTitle('')
        setDescription('')
        setStatus('todo')
        setPriority('medium')
        setDueDate(null)
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-gray-200 rounded-xl p-4">
            <h3 className="font-medium">New Task</h3>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Research the law"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="Research the law and write a report"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'todo' | 'in_progress' | 'done')}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Due Date</label>
                <input
                    type="date"
                    value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value).getTime() : null)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
        </form>
    )
}