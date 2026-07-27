import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useCreateEvaluation } from '@/hooks/useEvaluations'

export const Route = createFileRoute('/subject/$subject-id/new-evaluation')({
  component: NewEvaluation,
})

const evaluationTypes = [
  { value: "partial", label: "Parcial" },
  { value: "final", label: "Final" },
  { value: "retake", label: "Recuperatorio" },
  { value: "practical_work", label: "TP" },
  { value: "presentation", label: "Presentación" },
] as const

function NewEvaluation() {
  const { 'subject-id': subjectId } = Route.useParams()
  const navigate = useNavigate()
  const createEvaluation = useCreateEvaluation(subjectId)
  const [title, setTitle] = useState('')
  const [type, setType] = useState("partial")
  const [date, setDate] = useState('')
  const [grade, setGrade] = useState('')
  const [link, setLink] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createEvaluation.mutate(
      {
        title,
        type: type as any,
        date,
        grade: grade === '' ? null : Number(grade),
        link,
      },
      {
        onSuccess: (ref) => {
          navigate({
            to: '/subject/$subject-id/$evaluation-id',
            params: { 'subject-id': subjectId, 'evaluation-id': ref.id },
          })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-xl font-semibold mb-4">Nueva evaluation</h2>

      <div className="w-full grid place-items-center">
        <div className="w-full max-w-7xl space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
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

        <button
          type="submit"
          disabled={createEvaluation.isPending}
          className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
        >
          {createEvaluation.isPending ? 'Guardando...' : 'Crear evaluation'}
        </button>
      </div>
    </form>
  )
}
