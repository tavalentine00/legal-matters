import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Legal Matters</h1>
      <p className="mt-2 text-gray-500">Your matters will appear here.</p>
    </main>
  )
}