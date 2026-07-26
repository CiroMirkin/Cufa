import { Link } from '@tanstack/react-router'
import { useDocuments } from '@/hooks/useDocuments'
import { Plus } from 'lucide-react'

interface DocumentsListProps {
  subjectId: string
}

export function DocumentsList({ subjectId }: DocumentsListProps) {
  const { data: documents, isLoading, error } = useDocuments(subjectId)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Documents</h2>
        <Link
          to="/subject/$subjectId/newDocument"
          params={{ subjectId }}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded text-sm"
        >
          <Plus size={16} /> Nuevo document
        </Link>
      </div>
      {isLoading && <p className="text-gray-500">Cargando documents...</p>}
      {error && <p className="text-red-500">Error al cargar los documents.</p>}
      {documents?.map((doc) => (
        <Link
          key={doc.id}
          to="/subject/$subjectId/$documentId"
          params={{ subjectId, documentId: doc.id }}
          className="block px-4 py-3 mb-2 rounded bg-gray-50 hover:bg-gray-100"
        >
          <p className="font-medium">{doc.title}</p>
          <p className="text-sm text-gray-500 truncate">{doc.content.slice(0, 50)}</p>
        </Link>
      ))}
    </div>
  )
}
