import { useAllEvaluations } from '@/hooks/useEvaluations'
import { EvaluationsCalendar } from './EvaluationsCalendar'
import { Spinner } from './ui/spinner'
import type { Subject } from '@/types/subject'

interface CareerEvaluationsCalendarProps {
  subjects: Subject[]
}

export function CareerEvaluationsCalendar({ subjects }: CareerEvaluationsCalendarProps) {
  const subjectIds = subjects.map((subject) => subject.id)
  const { data: evaluations, isLoading, error } = useAllEvaluations(subjectIds)

  if (isLoading) {
    return <Spinner className="size-6" />
  }

  if (error) {
    return <p className="text-red-500 text-sm">Error al cargar el calendario.</p>
  }

  const subjectMetaById = new Map(subjects.map((subject) => [subject.id, { name: subject.name, careerId: subject.careerId }]))

  const evaluationsWithSubject = (evaluations ?? []).map((evaluation) => {
    const meta = subjectMetaById.get(evaluation.subjectId)
    return {
      ...evaluation,
      subjectName: meta?.name,
      careerId: meta?.careerId,
    }
  })

  return <EvaluationsCalendar evaluations={evaluationsWithSubject} />
}
