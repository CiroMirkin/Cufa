import { useEvaluations } from '@/hooks/useEvaluations'
import { EvaluationsCalendar } from './EvaluationsCalendar'
import { Spinner } from './ui/spinner'

interface SubjectEvaluationsCalendarProps {
  subjectId: string
}

export function SubjectEvaluationsCalendar({ subjectId }: SubjectEvaluationsCalendarProps) {
  const { data: evaluations, isLoading, error } = useEvaluations(subjectId)

  if (isLoading) {
    return <Spinner className="size-6" />
  }

  if (error) {
    return <p className="text-red-500 text-sm">Error al cargar el calendario.</p>
  }

  return <EvaluationsCalendar evaluations={evaluations ?? []} />
}
