import { Link } from '@tanstack/react-router'
import { useEvaluations } from '@/hooks/useEvaluations'
import { Plus } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'

const typeLabels: Record<string, string> = {
  partial: "Parcial",
  final: "Final",
  retake: "Recuperatorio",
  practical_work: "TP",
  presentation: "Presentación",
}

interface EvaluationsListProps {
  subjectId: string
}

export function EvaluationsList({ subjectId }: EvaluationsListProps) {
  const { data: evaluations, isLoading, error } = useEvaluations(subjectId)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Evaluaciones</h2>
        <Link
          to="/subject/$subject-id/new-evaluation"
          params={{ 'subject-id': subjectId }}
        >
          <Button>
            <Plus size={16} /> Nueva evaluación
          </Button>
        </Link>
      </div>
      {isLoading && <p className="text-gray-500">Cargando evaluations...</p>}
      {error && <p className="text-red-500">Error al cargar las evaluations.</p>}
      {evaluations?.map((ev) => (
        <Link
          key={ev.id}
          to="/subject/$subject-id/evaluation/$evaluation-id"
          params={{ 'subject-id': subjectId, 'evaluation-id': ev.id }}
          className="block"
        >
          <Card>
            <CardHeader>
              <CardTitle>{ev.title}</CardTitle>
              <CardDescription>
                {typeLabels[ev.type] ?? ev.type} &middot; {ev.date}
                {ev.grade !== null ? ` · ${ev.grade}` : " · Sin nota"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
