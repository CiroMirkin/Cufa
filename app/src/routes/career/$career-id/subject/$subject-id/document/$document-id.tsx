import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useDocument, useUpdateDocument, useDeleteDocument } from '@/hooks/useDocuments'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { exportAsMarkdown } from '@/lib/exportDocument'
import type { Document } from '@/types/document'

const AUTOSAVE_DELAY = 1000

export const Route = createFileRoute('/career/$career-id/subject/$subject-id/document/$document-id')({
  component: DocumentDetail,
})

function DocumentDetail() {
  const { 'career-id': careerId, 'subject-id': subjectId, 'document-id': documentId } = Route.useParams()
  const navigate = useNavigate()
  const { data: document, isLoading, error } = useDocument(subjectId, documentId)
  const updateDocument = useUpdateDocument(subjectId, documentId)
  const deleteDocument = useDeleteDocument(subjectId)

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar este document?')) {
      deleteDocument.mutate(documentId, {
        onSuccess: () => navigate({ to: '/career/$career-id/subject/$subject-id', params: { 'career-id': careerId, 'subject-id': subjectId } }),
      })
    }
  }

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (error) return <p className="text-red-500">Error al cargar el document.</p>
  if (!document) return <p className="text-gray-500">Document no encontrado.</p>

  return (
    <DocumentForm
      key={documentId}
      document={document}
      onSave={(data) => updateDocument.mutate(data)}
      isSaving={updateDocument.isPending}
      onDelete={handleDelete}
      isDeleting={deleteDocument.isPending}
    />
  )
}

function DocumentForm({
  document,
  onSave,
  isSaving,
  onDelete,
  isDeleting,
}: {
  document: Document
  onSave: (data: { title: string; content: string }) => void
  isSaving: boolean
  onDelete: () => void
  isDeleting: boolean
}) {
  const [title, setTitle] = useState(document.title as string)
  const [content, setContent] = useState(document.content as string)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const timeout = setTimeout(() => {
      onSave({ title, content })
    }, AUTOSAVE_DELAY)
    return () => clearTimeout(timeout)
  }, [title, content])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    onSave({ title, content })
  }

  return (
    <>
      <form onSubmit={handleSave} className="w-full grid place-items-center print:hidden">
        <div className="w-full max-w-7xl">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mb-4 border"
            required
          />
        </div>
        <div className="mb-4 max-w-7xl">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        <div className="w-full max-w-7xl flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button
            type="button"
            onClick={() => exportAsMarkdown(title, content)}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Exportar .md
          </button>
          {isSaving && <span className="text-sm text-gray-500">Guardado automático...</span>}
        </div>
      </form>
    </>
  )
}
