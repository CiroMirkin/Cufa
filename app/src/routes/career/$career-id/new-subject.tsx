import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useCreateSubject } from '@/hooks/useSubjects'
import { useAuth } from '@/auth'

export const Route = createFileRoute('/career/$career-id/new-subject')({
  component: NewSubject,
})

function NewSubject() {
  const { 'career-id': careerId } = Route.useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const createSubject = useCreateSubject()
  const [name, setName] = useState('')
  const [plan, setPlan] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.uid) return
    createSubject.mutate(
      { name, careerId, plan, userId: user.uid },
      {
        onSuccess: () => {
          navigate({
            to: '/career/$career-id',
            params: { 'career-id': careerId },
          })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-xl font-semibold mb-4">Nueva materia</h2>

      <div className="w-full grid place-items-center">
        <div className="w-full max-w-7xl space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la materia"
            className="w-full px-4 py-2 border rounded"
            required
          />

          <input
            type="text"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="Plan (ej. 2023)"
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={createSubject.isPending}
          className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
        >
          {createSubject.isPending ? 'Guardando...' : 'Crear materia'}
        </button>
      </div>
    </form>
  )
}
