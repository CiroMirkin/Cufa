import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/auth'
import { useCareers, useCreateCareer } from '@/hooks/useCareers'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { user, loading: authLoading } = useAuth()
  const { data: careers, isLoading, error } = useCareers(user?.uid)
  const createCareer = useCreateCareer()
  const navigate = useNavigate()
  const [name, setName] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    if (careers && careers.length > 0) {
      navigate({ to: '/career/$career-id', params: { 'career-id': careers[0].id } })
    }
  }, [user, authLoading, careers, navigate])

  if (isLoading) {
    return (
      <div className="grid place-items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error) {
    console.error(error)
    return <p className="text-red-500">Error al cargar carreras: {error.message}</p>
  }

  if (careers && careers.length > 0) {
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    createCareer.mutate(
      { name: name.trim(), userId: user!.uid },
      {
        onSuccess: (ref) => {
          navigate({ to: '/career/$career-id', params: { 'career-id': ref.id } })
        },
      },
    )
  }

  return (
    <div className="grid place-items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nombre de la carrera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Button type="submit" disabled={createCareer.isPending} className="w-full">
              {createCareer.isPending ? 'Creando...' : 'Crear carrera'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
