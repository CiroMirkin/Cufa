import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useCreateDocument } from '@/hooks/useDocuments'
import { MarkdownEditor } from '@/components/MarkdownEditor'

export const Route = createFileRoute('/subject/$subject-id/new-document')({
  component: NewDocument,
})

function NewDocument() {
  const { 'subject-id': subjectId } = Route.useParams()
  const navigate = useNavigate()
  const createDocument = useCreateDocument(subjectId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(e: any) {
    e.preventDefault()
    createDocument.mutate(
      { title, content },
      {
        onSuccess: (ref) => {
          navigate({ to: '/subject/$subject-id/document/$document-id', params: { 'subject-id': subjectId, 'document-id': ref.id } })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-xl font-semibold mb-4">Nuevo document</h2>
      
      <div className="w-full grid place-items-center">
        <div className="w-full max-w-7xl">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del document"
            className="w-full px-4 py-2 mb-4 border rounded"
            required
          />
        </div>

        <div className="mb-4 min-w-xl max-w-7xl">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          disabled={createDocument.isPending}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
          {createDocument.isPending ? 'Guardando...' : 'Crear document'}
        </button>
      </div>
    </form>
  )
}
