import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useDocument, useUpdateDocument, useDeleteDocument } from '@/hooks/useDocuments'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'

export const Route = createFileRoute('/subject/$subjectId/$documentId')({
  component: DocumentDetail,
})

function DocumentDetail() {
  const { subjectId, documentId } = Route.useParams()
  const navigate = useNavigate()
  const { data: document, isLoading, error } = useDocument(subjectId, documentId)
  const updateDocument = useUpdateDocument(subjectId, documentId)
  const deleteDocument = useDeleteDocument(subjectId)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleEdit() {
    if (document) {
      setTitle(document.title)
      setContent(document.content)
      setEditing(true)
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateDocument.mutate(
      { title, content },
      { onSuccess: () => setEditing(false) },
    )
  }

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar este document?')) {
      deleteDocument.mutate(documentId, {
        onSuccess: () => navigate({ to: '/subject/$subjectId', params: { subjectId } }),
      })
    }
  }

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (error) return <p className="text-red-500">Error al cargar el document.</p>
  if (!document) return <p className="text-gray-500">Document no encontrado.</p>

  if (editing) {
    return (
      <form onSubmit={handleSave} className="max-w-3xl">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />
        <div className="mb-4">
          <MarkdownEditor key={documentId} content={content} onChange={setContent} />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updateDocument.isPending}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            {updateDocument.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">{document.title}</h2>
      <div className="prose max-w-none mb-6 whitespace-pre-wrap">{document.content}</div>
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteDocument.isPending}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
        >
          {deleteDocument.isPending ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  )
}
