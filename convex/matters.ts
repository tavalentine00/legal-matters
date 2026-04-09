import {mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('matters').collect()
    }
});

export const create = mutation({
    args: {
        name: v.string(),
        matterNumber: v.string(),
        jurisdiction: v.string(),
        status: v.union(
            v.literal('active'),
            v.literal('closed'),
            v.literal('pending')
        ),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const matterId = await ctx.db.insert('matters', args)
        return matterId
    },
});

