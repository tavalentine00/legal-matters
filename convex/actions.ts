import Groq from 'groq-sdk'
import { api, internal } from './_generated/api'
import { action, internalAction } from './_generated/server'
import { v } from 'convex/values'
import { retrier } from './retrier'

export const summarizeDocument = action({
  args: { documentId: v.id('documents') },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    await retrier.run(ctx, internal.actions.summarizeDocumentInternal, {
      documentId: args.documentId,
    })
    return 'Summarization started'
  },
})

export const summarizeDocumentInternal = internalAction({
  args: { documentId: v.id('documents') },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const document = await ctx.runQuery(api.documents.get, {
      documentId: args.documentId,
    })

    if (!document) throw new Error('Document not found')

    const storageUrl = await ctx.runQuery(api.documents.getDownloadUrl, {
      storageId: document.storageId,
    })

    if (!storageUrl) throw new Error('Could not get file URL')

    const response = await fetch(storageUrl)
    const text: string = await response.text()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a legal document analyst. Summarize the following document concisely, highlighting key facts, parties involved, and any important dates or obligations.',
        },
        {
          role: 'user',
          content: `Please summarize this document:\n\n${text.slice(0, 8000)}`,
        },
      ],
    })

    const summary: string = completion.choices[0]?.message?.content ?? 'Could not generate summary.'

    await ctx.runMutation(api.documents.updateSummary, {
      documentId: args.documentId,
      summary,
    })

    return summary
  },
})

export const chat = action({
  args: {
    matterId: v.id('matters'),
    message: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    await retrier.run(ctx, internal.actions.chatInternal, {
      matterId: args.matterId,
      message: args.message,
    })
    return 'Message sent'
  },
})

export const chatInternal = internalAction({
  args: {
    matterId: v.id('matters'),
    message: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const matter = await ctx.runQuery(api.matters.get, {
      matterId: args.matterId,
    })

    const projects = await ctx.runQuery(api.projects.listByMatter, {
      matterId: args.matterId,
    })

    const allTasks = await Promise.all(
      projects.map((project) =>
        ctx.runQuery(api.tasks.listByProject, {
          projectId: project._id,
        })
      )
    )

    const messages = await ctx.runQuery(api.chat.listByMatter, {
      matterId: args.matterId,
    })

    const context = `
Matter: ${matter?.name} (${matter?.status})
Matter Number: ${matter?.matterNumber}
Jurisdiction: ${matter?.jurisdiction}
${matter?.description ? `Description: ${matter.description}` : ''}

Projects:
${projects.map((p) => `- ${p.name} (${p.status})`).join('\n')}

Tasks:
${allTasks.flat().map((t) => `- ${t.title} [${t.status}] [${t.priority} priority]${t.description ? `: ${t.description}` : ''}`).join('\n')}
    `.trim()

    const conversationHistory = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    await ctx.runMutation(api.chat.saveMessage, {
      matterId: args.matterId,
      role: 'user',
      content: args.message,
    })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a legal assistant for a litigation law firm. You have access to the following matter context:\n\n${context}\n\nAnswer questions based on this context. Be concise and professional.`,
        },
        ...conversationHistory,
        {
          role: 'user',
          content: args.message,
        },
      ],
    })

    const response = completion.choices[0]?.message?.content ?? 'Could not generate response.'

    await ctx.runMutation(api.chat.saveMessage, {
      matterId: args.matterId,
      role: 'assistant',
      content: response,
    })

    return response
  },
})