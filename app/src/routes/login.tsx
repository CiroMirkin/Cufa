import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { signInWithGoogle } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      const uid = result.user.uid
      const snap = await getDoc(doc(db, "users", uid))
      if (snap.exists()) {
        const careersSnap = await getDocs(collection(db, "careers"))
        const careerId = careersSnap.docs[0]?.id
        if (careerId) {
          navigate({ to: '/career/$career-id', params: { 'career-id': careerId } })
        }
      }
      else {
        navigate({ to: '/onboarding' })
      }
    }
    catch (err: unknown) {
      setLoading(false)
      if (err instanceof Error) {
        setError(err.message)
      }
      else {
        setError('Error al iniciar sesión')
      }
    }
  }

  return (
    <div className="grid place-items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Ingresando...' : 'Ingresar con Google'}
          </Button>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
