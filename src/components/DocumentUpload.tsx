import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useRef, useState } from 'react'
import type { Id } from '../../convex/_generated/dataModel'
import { useAction } from 'convex/react'

export function DocumentUpload({ taskId }: { taskId: Id<'tasks'> }) {
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
  const createDocument = useMutation(api.documents.create)
  const documents = useQuery(api.documents.listByTask, { taskId })

  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const uploadUrl = await generateUploadUrl()

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    })

    const { storageId } = await response.json()

    await createDocument({
      taskId,
      name: file.name,
      storageId,
      mimeType: file.type,
      sizeBytes: file.size,
    })

    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-3">
          {isUploading ? 'Uploading...' : 'Upload a document'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleUpload}
          disabled={isUploading}
          className="text-sm text-gray-600"
        />
      </div>

      {documents === undefined ? (
        <p className="text-sm text-gray-500">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-500">No documents yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <DocumentRow key={doc._id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  )
}

function DocumentRow({ doc }: { doc: { _id: Id<'documents'>, name: string, storageId: string, mimeType: string, sizeBytes: number, summary?: string } }) {
  const downloadUrl = useQuery(api.documents.getDownloadUrl, { storageId: doc.storageId })
  const summarize = useAction(api.actions.summarizeDocument)
  const [isSummarizing, setIsSummarizing] = useState(false)

  async function handleSummarize() {
    setIsSummarizing(true)
    await summarize({ documentId: doc._id })
    setIsSummarizing(false)
  }
const isTextFile = doc.mimeType.startsWith('text/') || doc.mimeType === 'application/json' || doc.mimeType === 'application/xml' || doc.mimeType === 'application/csv' || doc.mimeType === 'application/pdf' || doc.mimeType === 'application/msword' || doc.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || doc.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || doc.mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || doc.mimeType === 'application/vnd.ms-excel' || doc.mimeType === 'application/vnd.ms-powerpoint' || doc.mimeType === 'application/vnd.ms-excel.template' || doc.mimeType === 'application/vnd.ms-powerpoint.template' || doc.mimeType === 'application/vnd.ms-excel.addin.macroEnabled.12' || doc.mimeType === 'application/vnd.ms-powerpoint.addin.macroEnabled.12' || doc.mimeType === 'application/vnd.ms-excel.sheet.macroEnabled.12' || doc.mimeType === 'application/vnd.ms-powerpoint.presentation.macroEnabled.12' || doc.mimeType === 'application/vnd.ms-excel.sheet.binary.macroEnabled.12' || doc.mimeType === 'application/vnd.ms-powerpoint.presentation.binary.macroEnabled.12'
  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{doc.name}</p>
          <p className="text-xs text-gray-500">
            {doc.mimeType} · {(doc.sizeBytes / 1024).toFixed(1)} KB
          </p>
        </div>
        
        <div className="flex gap-2">
          {downloadUrl && (
            
              <a href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={doc.name}
              className="text-sm text-blue-500 hover:underline"
            >
              Download
            </a>
            
          )}
          
          <button
          onClick={handleSummarize}
          disabled={isSummarizing || !isTextFile}
          title={!isTextFile ? 'Only text files can be summarized' : ''}
          className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:border-gray-400 disabled:opacity-50"
>
  {isSummarizing ? 'Summarizing...' : isTextFile ? 'Summarize' : 'Text only'}
</button>
        </div>
      </div>

      {doc.summary && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 mb-1">AI Summary</p>
          <p className="text-sm text-gray-700">{doc.summary}</p>
        </div>
      )}
    </div>
  )
}