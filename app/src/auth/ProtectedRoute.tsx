import { Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from './useAuth'

export function ProtectedRoute() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [checkingDoc, setCheckingDoc] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      navigate({ to: '/login' })
      return
    }

    async function checkDoc() {
      if(!user) {
        navigate({ to: '/login' })
        return
      }

      const snap = await getDoc(doc(db, "users", user.uid))
      if (!snap.exists()) {
        navigate({ to: '/onboarding' })
      }
      else {
        setCheckingDoc(false)
      }
    }
    checkDoc()
  }, [user, authLoading, navigate])

  if (authLoading || checkingDoc) {
    return (
      <div className="grid place-items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    )
  }

  return <Outlet />
}
