import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useCreateDocument } from '@/hooks/useDocuments'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'

export const Route = createFileRoute('/subject/$subjectId/newDocument')({
  component: NewDocument,
})

function NewDocument() {
  const { subjectId } = Route.useParams()
  const navigate = useNavigate()
  const createDocument = useCreateDocument(subjectId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createDocument.mutate(
      { title, content },
      {
        onSuccess: (ref) => {
          navigate({ to: '/subject/$subjectId/$documentId', params: { subjectId, documentId: ref.id } })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Nuevo document</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del document"
        className="w-full px-4 py-2 mb-4 border rounded"
        required
      />
      <div className="mb-4">
        <MarkdownEditor content={content} onChange={setContent} placeholder="Escribe el contenido..." />
      </div>
      <button
        type="submit"
        disabled={createDocument.isPending}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
      >
        {createDocument.isPending ? 'Guardando...' : 'Crear document'}
      </button>
    </form>
  )
}
