import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/auth'

export const Route = createFileRoute('/career')({
  component: ProtectedRoute,
})
