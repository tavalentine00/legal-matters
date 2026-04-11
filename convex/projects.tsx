import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const listByMatter = query({
  args: { matterId: v.id('matters') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projects')
      .filter((q) => q.eq(q.field('matterId'), args.matterId))
      .collect()
  },
})

export const create = mutation({
  args: {
    matterId: v.id('matters'),
    name: v.string(),
    status: v.union(
      v.literal('active'),
      v.literal('completed'),
      v.literal('on_hold')
    ),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert('projects', args)
    return projectId
  },
})

export const get = query({
    args: { projectId: v.id('projects')}, 
    handler: async (ctx, args) => {
        return await ctx.db.get(args.projectId);
    }
})