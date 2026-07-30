import { createFileRoute, Link, Outlet, useChildMatches } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from '@/auth'
import { useSubjects } from '@/hooks/useSubjects'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Career } from '@/types/career'

export const Route = createFileRoute('/career/$career-id')({
  component: CareerPage,
})

function CareerPage() {
  const { 'career-id': careerId } = Route.useParams()
  const { user } = useAuth()
  const childMatches = useChildMatches()
  const hasChildRoute = childMatches.length > 0

  const { data: career, isLoading: careerLoading } = useQuery({
    queryKey: ["careers", careerId],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "careers", careerId))
      if (!snap.exists()) return null
      return { id: snap.id, ...snap.data() } as Career
    },
  })

  const { data: subjects, isLoading: subjectsLoading, error } = useSubjects(user?.uid, careerId)

  if (careerLoading || subjectsLoading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!career) {
    return <p className="text-gray-500 px-6">Carrera no encontrada.</p>
  }

  if(hasChildRoute) {
    return <Outlet />
  }

  return (
    <div className="px-6">
      <header className="w-full py-4 flex justify-center items-center gap-4">
        <h1 className="font-semibold text-3xl">{career.name}</h1>
        <Link
          to="/career/$career-id/new-subject"
          params={{ 'career-id': careerId }}
        >
          <Button>
            <Plus size={16} /> Nueva materia
          </Button>
        </Link>
      </header>
        <main className="pt-4 flex gap-6 flex-wrap justify-center">
          {error && <p className="text-red-500">Error al cargar las materias.</p>}
          {subjects?.map((subject) => (
            <Link
              key={subject.id}
              to='/career/$career-id/subject/$subject-id'
              params={{ 'career-id': careerId, 'subject-id': subject.id }}
              className="block w-64"
            >
              <Card className="hover:bg-emerald-100 transition-colors ease-in-out duration-100">
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </main>
    </div>
  )
}
