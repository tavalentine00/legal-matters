import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  matters: defineTable({
    name: v.string(),
    matterNumber: v.string(),
    jurisdiction: v.string(),
    status: v.union(
      v.literal('active'),
      v.literal('closed'),
      v.literal('pending')
    ),
    description: v.optional(v.string()),
  }),

  projects: defineTable({
    matterId: v.id('matters'),
    name: v.string(),
    status: v.union(
      v.literal('active'),
      v.literal('completed'),
      v.literal('on_hold')
    ),
  }),

  tasks: defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal('todo'),
      v.literal('in_progress'),
      v.literal('done')
    ),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    ),
    dueDate: v.optional(v.number()),
  }),

  documents: defineTable({
    taskId: v.id('tasks'),
    name: v.string(),
    storageId: v.string(),
    mimeType: v.string(),
    sizeBytes: v.number(),
    summary: v.optional(v.string()),
  }),

  messages: defineTable({
    matterId: v.id('matters'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
  }),
})