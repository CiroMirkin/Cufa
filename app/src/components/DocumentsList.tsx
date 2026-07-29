import { Link } from '@tanstack/react-router'
import { useDocuments } from '@/hooks/useDocuments'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Plus } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

interface DocumentsListProps {
  subjectId: string
}

export function DocumentsList({ subjectId }: DocumentsListProps) {
  const { data: documents, isLoading, error } = useDocuments(subjectId)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Documentos</h2>
        <Link
          to="/subject/$subject-id/new-document"
          params={{ 'subject-id': subjectId }}
        >
          <Button>
            <Plus size={16} /> Nuevo documento
          </Button>
        </Link>
      </div>
      {isLoading && <p className="text-gray-500">Cargando documents...</p>}
      {error && <p className="text-red-500">Error al cargar los documents.</p>}
      {documents?.map((doc) => (
        <Link
          key={doc.id}
          to="/subject/$subject-id/document/$document-id"
          params={{ 'subject-id': subjectId, "document-id": doc.id }}
          className="block"
        >
          <Card>
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
              <CardDescription>
                <MarkdownPreview content={doc.content}/>
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
