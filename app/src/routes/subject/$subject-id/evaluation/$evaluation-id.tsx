import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useEvaluation, useUpdateEvaluation, useDeleteEvaluation } from '@/hooks/useEvaluations'
import { ChevronLeft } from 'lucide-react'

const typeLabels: Record<string, string> = {
  partial: "Parcial",
  final: "Final",
  retake: "Recuperatorio",
  practical_work: "TP",
  presentation: "Presentación",
}

const evaluationTypes = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
] as const

export const Route = createFileRoute('/subject/$subject-id/evaluation/$evaluation-id')({
  component: EvaluationDetail,
})

function EvaluationDetail() {
  const { 'subject-id': subjectId, 'evaluation-id': evaluationId } = Route.useParams()
  const navigate = useNavigate()
  const { data: evaluation, isLoading, error } = useEvaluation(subjectId, evaluationId)
  const updateEvaluation = useUpdateEvaluation(subjectId, evaluationId)
  const deleteEvaluation = useDeleteEvaluation(subjectId)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [title, setTitle] = useState("")
  const [type, setType] = useState("partial")
  const [date, setDate] = useState("")
  const [grade, setGrade] = useState("")
  const [link, setLink] = useState("")

  function enterEdit() {
    if (!evaluation) return
    setTitle(evaluation.title)
    setType(evaluation.type)
    setDate(evaluation.date)
    setGrade(evaluation.grade === null ? "" : String(evaluation.grade))
    setLink(evaluation.link)
    setMode("edit")
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!evaluation) return
    updateEvaluation.mutate(
      {
        title,
        type: type as any,
        date,
        grade: grade === '' ? null : Number(grade),
        link,
      },
      {
        onSuccess: () => setMode("view"),
      },
    )
  }

  function handleDelete() {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta evaluation?')) {
      deleteEvaluation.mutate(evaluationId, {
        onSuccess: () =>
          navigate({ to: '/subject/$subject-id', params: { 'subject-id': subjectId } }),
      })
    }
  }

  if (isLoading) return <p className="text-gray-500 px-6">Cargando...</p>
  if (error) return <p className="text-red-500 px-6">Error al cargar la evaluation.</p>
  if (!evaluation) return <p className="text-gray-500 px-6">Evaluation no encontrada.</p>

  return (
    <div className="px-6">
      <header className="w-full flex justify-start py-4">
        <Link
          to="/subject/$subject-id"
          params={{ 'subject-id': subjectId }}
          className="flex items-center text-xl"
        >
          <ChevronLeft className="mr-2" size={26} /> Volver
        </Link>
      </header>

      {mode === "view" ? (
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold mb-4">{evaluation.title}</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Tipo</dt>
              <dd>{typeLabels[evaluation.type] ?? evaluation.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Fecha</dt>
              <dd>{evaluation.date}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Nota</dt>
              <dd>{evaluation.grade !== null ? evaluation.grade : "Sin nota"}</dd>
            </div>
            {evaluation.link && (
              <div>
                <dt className="text-sm text-gray-500">Link</dt>
                <dd>
                  <a href={evaluation.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {evaluation.link}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="flex gap-2 mt-6">
            <button
              onClick={enterEdit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteEvaluation.isPending}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
            >
              {deleteEvaluation.isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="w-full">
          <h2 className="text-xl font-semibold mb-4">Editar evaluation</h2>
          <div className="w-full grid place-items-center">
            <div className="w-full max-w-7xl space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                {evaluationTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Nota (opcional)"
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
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
                onClick={() => setMode("view")}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
