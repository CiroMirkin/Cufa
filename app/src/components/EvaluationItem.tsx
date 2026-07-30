import { Trash2 } from 'lucide-react'
import { useUpdateEvaluation, useDeleteEvaluation } from '@/hooks/useEvaluations'
import { InlineEditableText, InlineEditableSelect } from './InlineEditableField'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { Evaluation } from '@/types/evaluation'

const evaluationTypes = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
] as const

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
    <Card className="group">
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
