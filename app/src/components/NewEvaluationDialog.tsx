import { useState } from 'react'
import { useCreateEvaluation } from '@/hooks/useEvaluations'
import type { EvaluationType } from '@/types/evaluation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'

const evaluationTypes = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
] as const

const emptyForm = {
  title: "",
  type: "partial" as EvaluationType,
  date: "",
  grade: "",
  link: "",
}

interface NewEvaluationDialogProps {
  subjectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewEvaluationDialog({ subjectId, open, onOpenChange }: NewEvaluationDialogProps) {
  const [form, setForm] = useState(emptyForm)
  const createEvaluation = useCreateEvaluation(subjectId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createEvaluation.mutate(
      {
        title: form.title,
        type: form.type,
        date: form.date,
        grade: form.grade === '' ? null : Number(form.grade),
        link: form.link,
      },
      {
        onSuccess: () => {
          setForm(emptyForm)
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva evaluación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Título"
              className="w-full px-4 py-2 border rounded"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as EvaluationType }))}
              className="w-full px-4 py-2 border rounded"
            >
              {evaluationTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <input
              type="number"
              value={form.grade}
              onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
              placeholder="Nota (opcional)"
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="Link (opcional)"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createEvaluation.isPending}>
              {createEvaluation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
