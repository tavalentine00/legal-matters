import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
    args: {
        taskId: v.id('tasks'),
        name: v.string(),
        storageId: v.string(),
        mimeType: v.string(),
        sizeBytes: v.number(),
    },
    handler: async (ctx, args) => {
        const documentId = await ctx.db.insert('documents', args)
        return documentId
    }
})

export const get = query({
    args: { documentId: v.id('documents') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.documentId)
    }
})

export const listByTask = query({
    args: { taskId: v.id('tasks') },
    handler: async (ctx, args) => {
        return await ctx.db.query('documents').filter((q) => q.eq(q.field('taskId'), args.taskId)).collect()
    }
})

export const generateUploadUrl = mutation({
    args: { },
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl()
    }
})

export const getDownloadUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId)
    }
})