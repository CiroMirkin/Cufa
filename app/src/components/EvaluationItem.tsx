import { Trash2 } from 'lucide-react'
import { useUpdateEvaluation, useDeleteEvaluation } from '@/hooks/useEvaluations'
import { InlineEditableText, InlineEditableSelect } from './InlineEditableField'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import type { Evaluation } from '@/types/evaluation'

const evaluationTypes = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
] as const

const MS_PER_DAY = 1000 * 60 * 60 * 24

function getDaysUntil(dateString: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY)
}

function getUrgencyClass(dateString: string) {
  const daysUntil = getDaysUntil(dateString)
  if (daysUntil < 0) return 'opacity-50 bg-slate-100'
  if (daysUntil < 3) return 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800'
  if (daysUntil < 6) return 'bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800'
  return ''
}

interface EvaluationItemProps {
  evaluation: Evaluation
  subjectId: string
}

export function EvaluationItem({ evaluation, subjectId }: EvaluationItemProps) {
  const updateEvaluation = useUpdateEvaluation(subjectId, evaluation.id)
  const deleteEvaluation = useDeleteEvaluation(subjectId)

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      deleteEvaluation.mutate(evaluation.id)
    }
  }

  return (
    <Card className={cn('group mb-2', getUrgencyClass(evaluation.date))}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>
            <InlineEditableText
              value={evaluation.title}
              onSave={(title) => updateEvaluation.mutate({ ...evaluation, title })}
            />
          </CardTitle>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={deleteEvaluation.isPending}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1 flex-wrap">
          <InlineEditableSelect
            value={evaluation.type}
            options={evaluationTypes}
            onSave={(type) => updateEvaluation.mutate({ ...evaluation, type: type as Evaluation['type'] })}
          />
          <span>&middot;</span>
          <InlineEditableText
            type="date"
            value={evaluation.date}
            onSave={(date) => updateEvaluation.mutate({ ...evaluation, date })}
          />
          <span>&middot;</span>
          <InlineEditableText
            type="number"
            value={evaluation.grade === null ? "" : String(evaluation.grade)}
            placeholder="Sin nota"
            onSave={(grade) => updateEvaluation.mutate({ ...evaluation, grade: grade === '' ? null : Number(grade) })}
          />
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
