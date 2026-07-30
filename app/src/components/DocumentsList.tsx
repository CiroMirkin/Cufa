import { Link } from '@tanstack/react-router'
import { useDocuments } from '@/hooks/useDocuments'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Plus } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

interface DocumentsListProps {
  subjectId: string
  careerId: string
}

export function DocumentsList({ subjectId, careerId }: DocumentsListProps) {
  const { data: documents, isLoading, error } = useDocuments(subjectId)

  return (
    <div className='border-x px-4 pb-6'>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Documentos</h2>
        <Link
          to="/career/$career-id/subject/$subject-id/new-document"
          params={{ 'career-id': careerId, 'subject-id': subjectId }}
        >
          <Button variant='outline'>
            <Plus size={16} />
          </Button>
        </Link>
      </div>
      {isLoading && <p className="text-gray-500">Cargando documents...</p>}
      {error && <p className="text-red-500">Error al cargar los documents.</p>}
      <section className="flex gap-3">
        {documents?.map((doc) => (
          <Link
            key={doc.id}
            to="/career/$career-id/subject/$subject-id/document/$document-id"
            params={{ 'career-id': careerId, 'subject-id': subjectId, "document-id": doc.id }}
            className="block"
          >
            <Card className="w-80">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              <CardDescription>
                  <MarkdownPreview content={doc.content}/>
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  )
}
