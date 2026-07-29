import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc } from 'firebase/firestore'
import { addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/auth'
import { useCheckAlias, useCreateUser } from '@/hooks/useUsers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/onboarding')({
  component: Onboarding,
})

function Onboarding() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [alias, setAlias] = useState('')
  const [careerName, setCareerName] = useState('')
  const [aliasTouched, setAliasTouched] = useState(false)
  const { data: aliasResults, isLoading: checkingAlias } = useCheckAlias(
    aliasTouched ? alias : '',
  )
  const createUser = useCreateUser()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate({ to: '/login' })
      return
    }
    async function checkUserDoc() {
      if (!user) {
        navigate({ to: '/login' })
        return
      }
      const snap = await getDoc(doc(db, "users", user.uid))
      if (snap.exists()) {
        navigate({ to: '/' })
      }
    }
    checkUserDoc()
  }, [user, authLoading, navigate])

  if (authLoading) return null

  const aliasTaken = aliasResults && aliasResults.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !alias.trim() || aliasTaken || !careerName.trim()) return
    setSubmitting(true)
    try {
      await createUser.mutateAsync({
        uid: user.uid,
        alias: alias.trim(),
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
        createdAt: new Date().toISOString(),
      })
      const ref = await addDoc(collection(db, "careers"), {
        name: careerName.trim(),
        userId: user.uid,
      })
      navigate({ to: '/career/$career-id', params: { 'career-id': ref.id } })
    }
    catch {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid place-items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Creá tu cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Tu alias en GUS"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                onBlur={() => setAliasTouched(true)}
                required
              />
              {aliasTouched && checkingAlias && (
                <p className="text-sm text-gray-500 mt-1">Verificando...</p>
              )}
              {aliasTouched && aliasTaken && (
                <p className="text-sm text-red-500 mt-1">
                  Ese alias ya está en uso. Elegí otro.
                </p>
              )}
              {aliasTouched && !checkingAlias && !aliasTaken && alias.length > 0 && (
                <p className="text-sm text-green-500 mt-1">Alias disponible</p>
              )}
            </div>
            <div>
              <Input
                placeholder="Nombre de la carrera"
                value={careerName}
                onChange={(e) => setCareerName(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={!alias.trim() || aliasTaken || !careerName.trim() || submitting}
              className="w-full"
            >
              {submitting ? 'Creando...' : 'Comenzar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
