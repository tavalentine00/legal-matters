import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const listByMatter = query({
  args: { matterId: v.id('matters') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .filter((q) => q.eq(q.field('matterId'), args.matterId))
      .collect()
  },
})

export const saveMessage = mutation({
  args: {
    matterId: v.id('matters'),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', args)
  },
})