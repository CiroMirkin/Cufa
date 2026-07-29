import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useEvaluation, useUpdateEvaluation, useDeleteEvaluation } from '@/hooks/useEvaluations'
import type { EvaluationType } from '@/types/evaluation'

const evaluationTypes = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
] as const

export const Route = createFileRoute('/career/$career-id/subject/$subject-id/evaluation/$evaluation-id')({
  component: EvaluationDetail,
})

function EvaluationDetail() {
  const { 'career-id': careerId, 'subject-id': subjectId, 'evaluation-id': evaluationId } = Route.useParams()
  const navigate = useNavigate()
  const { data: evaluation, isLoading, error } = useEvaluation(subjectId, evaluationId)
  const updateEvaluation = useUpdateEvaluation(subjectId, evaluationId)
  const deleteEvaluation = useDeleteEvaluation(subjectId)
  const [form, setForm] = useState({
    title: "",
    type: "partial" as EvaluationType,
    date: "",
    grade: "",
    link: "",
  })
  const [initialized, setInitialized] = useState(false)

  if (evaluation && !initialized) {
    setForm({
      title: evaluation.title,
      type: evaluation.type,
      date: evaluation.date,
      grade: evaluation.grade === null ? "" : String(evaluation.grade),
      link: evaluation.link,
    })
    setInitialized(true)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!evaluation) return
    updateEvaluation.mutate({
      title: form.title,
      type: form.type,
      date: form.date,
      grade: form.grade === '' ? null : Number(form.grade),
      link: form.link,
    })
  }

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluación?')) {
      deleteEvaluation.mutate(evaluationId, {
        onSuccess: () =>
          navigate({ to: '/career/$career-id/subject/$subject-id', params: { 'career-id': careerId, 'subject-id': subjectId } }),
      })
    }
  }

  if (isLoading) return <p className="text-gray-500 px-6">Cargando...</p>
  if (error) return <p className="text-red-500 px-6">Error al cargar la evaluación.</p>
  if (!evaluation) return <p className="text-gray-500 px-6">Evaluación no encontrada.</p>

  return (
    <div className="px-6">
      <form onSubmit={handleSave} className="w-full">
        <h2 className="text-xl font-semibold mb-4">Evaluación</h2>
        <div className="w-full grid place-items-center">
          <div className="w-full max-w-7xl space-y-4">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              disabled={updateEvaluation.isPending}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
            >
              {updateEvaluation.isPending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteEvaluation.isPending}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
            >
              {deleteEvaluation.isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
