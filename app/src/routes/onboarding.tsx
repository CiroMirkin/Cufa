import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
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
  const [aliasTouched, setAliasTouched] = useState(false)
  const { data: aliasResults, isLoading: checkingAlias } = useCheckAlias(
    aliasTouched ? alias : '',
  )
  const createUser = useCreateUser()

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
        const careersSnap = await getDocs(collection(db, "careers"))
        const careerId = careersSnap.docs[0]?.id
        if (careerId) {
          navigate({ to: '/career/$career-id', params: { 'career-id': careerId } })
        }
      }
    }
    checkUserDoc()
  }, [user, authLoading, navigate])

  if (authLoading) return null

  const aliasTaken = aliasResults && aliasResults.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !alias.trim() || aliasTaken) return
    createUser.mutate(
      {
        uid: user.uid,
        alias: alias.trim(),
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: async () => {
          const careersSnap = await getDocs(collection(db, "careers"))
          const careerId = careersSnap.docs[0]?.id
          if (careerId) {
            navigate({ to: '/career/$career-id', params: { 'career-id': careerId } })
          }
        },
      },
    )
  }

  return (
    <div className="grid place-items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Elegí tu alias</CardTitle>
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
            <Button
              type="submit"
              disabled={!alias.trim() || aliasTaken || createUser.isPending}
              className="w-full"
            >
              {createUser.isPending ? 'Guardando...' : 'Comenzar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
