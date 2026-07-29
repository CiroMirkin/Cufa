import { createFileRoute, Link, Outlet, useChildMatches } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ChevronLeft } from 'lucide-react'
import { DocumentsList } from '@/components/DocumentsList'
import { EvaluationsList } from '@/components/EvaluationsList'
import type { Career } from '@/types/career'

export const Route = createFileRoute('/career/$career-id/subject/$subject-id')({
  component: Subject,
})

function Subject() {
  const { 'career-id': careerId, 'subject-id': subjectId } = Route.useParams()
  const childMatches = useChildMatches()
  const hasChildRoute = childMatches.length > 0

  const { data: career } = useQuery({
    queryKey: ["careers", careerId],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "careers", careerId))
      if (!snap.exists()) return null
      return { id: snap.id, ...snap.data() } as Career
    },
  })

  const careerName = career?.name ?? "Carrera"

  return (
    <div className="px-6">
      <header className='w-full flex justify-start py-4'>
        {hasChildRoute ? (
          <Link
            to='/career/$career-id/subject/$subject-id'
            params={{ 'career-id': careerId, 'subject-id': subjectId }}
            className='flex items-center text-xl'
          >
            <ChevronLeft className='mr-2' size={26} /> {subjectId} - {careerName}
          </Link>
        ) : (
          <Link to='/career/$career-id' params={{ 'career-id': careerId }} className='flex items-center text-xl'>
            <ChevronLeft className='mr-2' size={26} /> {subjectId} - {careerName}
          </Link>
        )}
      </header>
      <main className='pt-4'>
        {!hasChildRoute && (
          <>
            <DocumentsList subjectId={subjectId} careerId={careerId} />
            <EvaluationsList subjectId={subjectId} careerId={careerId} />
          </>
        )}
        <Outlet />
      </main>
    </div>
  )
}
