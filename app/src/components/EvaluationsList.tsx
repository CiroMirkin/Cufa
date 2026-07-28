import { Link } from '@tanstack/react-router'
import { useEvaluations } from '@/hooks/useEvaluations'
import { Plus } from 'lucide-react'

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
        <h2 className="text-xl font-semibold">Evaluations</h2>
        <Link
          to="/subject/$subject-id/new-evaluation"
          params={{ 'subject-id': subjectId }}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded text-sm"
        >
          <Plus size={16} /> Nueva evaluation
        </Link>
      </div>
      {isLoading && <p className="text-gray-500">Cargando evaluations...</p>}
      {error && <p className="text-red-500">Error al cargar las evaluations.</p>}
      {evaluations?.map((ev) => (
        <Link
          key={ev.id}
          to="/subject/$subject-id/evaluation/$evaluation-id"
          params={{ 'subject-id': subjectId, 'evaluation-id': ev.id }}
          className="block px-4 py-3 mb-2 rounded bg-gray-50 hover:bg-gray-100"
        >
          <p className="font-medium">{ev.title}</p>
          <p className="text-sm text-gray-500">
            {typeLabels[ev.type] ?? ev.type} &middot; {ev.date}
            {ev.grade !== null ? ` · ${ev.grade}` : " · Sin nota"}
          </p>
        </Link>
      ))}
    </div>
  )
}
