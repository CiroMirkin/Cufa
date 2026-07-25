import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/subject/$subjectName')({
  component: Subject,
})

function Subject() {
  const { subjectName } = Route.useParams()
  return (
    <div className="px-6">
      <header className='w-full flex justify-start py-4'>
        <Link to='/' className='flex items-center text-xl'>
          <ChevronLeft className='mr-2' size={26} /> { subjectName } - Carrera
        </Link>
      </header>
      <main className='pt-4'>
    
      </main>
    </div>
  )
}
