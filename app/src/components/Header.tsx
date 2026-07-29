import { useAuth, signOut } from '@/auth'
import { useUser } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user } = useAuth()
  const { data: appUser } = useUser(user?.uid)

  if (!user) return null

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName ?? ''}
            className="size-8 rounded-full"
          />
        )}
        <span className="text-sm font-medium">
          {appUser?.alias ?? user.displayName}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        Cerrar sesión
      </Button>
    </header>
  )
}
