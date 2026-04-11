import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const listByProject = query({
    args:{ projectId: v.id('projects') },
    handler: async (ctx, args) => {
        return await ctx.db.query('tasks').filter((q) => q.eq(q.field('projectId'), args.projectId)).collect()
    }
})

export const create = mutation({
    args: {
        projectId: v.id('projects'),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done')),
        priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
        dueDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const taskId = await ctx.db.insert('tasks', args)
        return taskId
    }
})

export const update = mutation({
    args: {
        taskId: v.id('tasks'),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done'))),
        priority: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'))),
        dueDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { taskId, ...fields } = args
        return await ctx.db.patch(taskId, fields)
    }
});

export const remove = mutation({
    args: {
        taskId: v.id('tasks'),
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.taskId)
    },
});

export const get = query({
    args: { taskId: v.id('tasks') },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.taskId)
    },
  })