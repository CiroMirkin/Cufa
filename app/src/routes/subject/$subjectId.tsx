import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/subject/$subjectId')({
  component: Subject,
})

function Subject() {
  const { subjectId } = Route.useParams()
  return (
    <div className="px-6">
      <header className='w-full flex justify-start py-4'>
        <Link to='/' className='flex items-center text-xl'>
          <ChevronLeft className='mr-2' size={26} /> { subjectId } - Carrera
        </Link>
      </header>
      <main className='pt-4'>
        <Outlet />
      </main>
    </div>
  )
}
