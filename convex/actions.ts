import { action } from './_generated/server'
import { api } from './_generated/api'
import { v } from 'convex/values'
import Groq from 'groq-sdk'

export const summarizeDocument = action({
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