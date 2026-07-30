import { createFileRoute, Link, Outlet, useChildMatches } from '@tanstack/react-router'
import { DocumentsList } from '@/components/DocumentsList'
import { EvaluationsList } from '@/components/EvaluationsList'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuth } from '@/auth'
import { useCareers } from '@/hooks/useCareers'
import { useSubjects } from '@/hooks/useSubjects'

export const Route = createFileRoute('/career/$career-id/subject/$subject-id')({
  component: Subject,
})

function Subject() {
  const { 'career-id': careerId, 'subject-id': subjectId } = Route.useParams()
  const childMatches = useChildMatches()
  const { user } = useAuth()

  const { data: careers } = useCareers(user?.uid)
  const { data: subjects } = useSubjects(user?.uid, careerId)

  const career = careers?.find((c) => c.id === careerId)
  const subject = subjects?.find((s) => s.id === subjectId)

  const activeSection = childMatches.some((m) => m.routeId.includes('document'))
    ? 'document'
    : null

  const careerName = career?.name ?? "Carrera"
  const subjectName = subject?.name ?? subjectId

  return (
    <div className="px-6">
      <header className="w-full py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/career/$career-id" params={{ 'career-id': careerId }}>
                  {careerName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link
                  to='/career/$career-id/subject/$subject-id'
                  params={{ 'career-id': careerId, 'subject-id': subjectId }}
                >
                  <BreadcrumbPage>{subjectName}</BreadcrumbPage>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="pt-4 grid grid-cols-1 lg:grid-cols-[1fr_3fr_1fr] gap-6">
        <section>
          <EvaluationsList subjectId={subjectId} />
        </section>
        <section>
          {activeSection === 'document'
            ? <Outlet />
            : <DocumentsList subjectId={subjectId} careerId={careerId} />}
        </section>
        <section>
          <h2 className="text-lg font-medium mb-4">Notas</h2>
          <div />
        </section>
      </main>
    </div>
  )
}
