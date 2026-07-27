import { createFileRoute, Link, Outlet, useChildMatches } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { DocumentsList } from '@/components/DocumentsList'

export const Route = createFileRoute('/subject/$subject-id')({
  component: Subject,
})

function Subject() {
  const { 'subject-id': subjectId } = Route.useParams()
  const childMatches = useChildMatches()
  const hasChildRoute = childMatches.length > 0

  return (
    <div className="px-6">
      <header className='w-full flex justify-start py-4'>
        {hasChildRoute ? (
          <Link
            to='/subject/$subject-id'
            params={{ 'subject-id': subjectId }}
            className='flex items-center text-xl'
          >
            <ChevronLeft className='mr-2' size={26} /> {subjectId} - Carrera
          </Link>
        ) : (
          <Link to='/' className='flex items-center text-xl'>
            <ChevronLeft className='mr-2' size={26} /> {subjectId} - Carrera
          </Link>
        )}
      </header>
      <main className='pt-4'>
        {!hasChildRoute && <DocumentsList subjectId={subjectId} />}
        <Outlet />
      </main>
    </div>
  )
}
