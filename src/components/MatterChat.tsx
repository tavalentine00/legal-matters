import { useAction, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import type { Id } from '../../convex/_generated/dataModel'

export function MatterChat({ matterId }: { matterId: Id<'matters'> }) {
  const messages = useQuery(api.chat.listByMatter, { matterId })
  const sendMessage = useAction(api.actions.chat)

  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    setIsSending(true)
    const message = input
    setInput('')

    await sendMessage({ matterId, message })
    setIsSending(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages === undefined ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">
            Ask a question about this matter — tasks, projects, deadlines, anything.
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`rounded-xl p-3 text-sm ${
                message.role === 'user'
                  ? 'bg-gray-900 text-white ml-8'
                  : 'bg-gray-100 text-gray-800 mr-8'
              }`}
            >
              {message.content}
            </div>
          ))
        )}
        {isSending && (
          <div className="bg-gray-100 text-gray-500 rounded-xl p-3 text-sm mr-8">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
          placeholder="Ask about this matter..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}