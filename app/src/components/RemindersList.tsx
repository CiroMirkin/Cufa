import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { useReminders, useCreateReminder, useUpdateReminder, useDeleteReminder } from '@/hooks/useReminders'
import { InlineEditableText } from './InlineEditableField'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { getDaysUntil } from '@/lib/evaluations'

function getUrgencyClass(expiresAt: string) {
  const daysUntil = getDaysUntil(expiresAt)
  if (daysUntil < 0) return 'opacity-50 bg-slate-100'
  if (daysUntil < 3) return 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800'
  if (daysUntil < 7) return 'bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800'
  return ''
}

interface RemindersListProps {
  subjectId: string
}

export function RemindersList({ subjectId }: RemindersListProps) {
  const { data: reminders, isLoading, error } = useReminders(subjectId)
  const createReminder = useCreateReminder(subjectId)
  const updateReminder = useUpdateReminder(subjectId)
  const deleteReminder = useDeleteReminder(subjectId)

  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newExpiresAt, setNewExpiresAt] = useState('')

  function handleCreate() {
    if (!newTitle.trim() || !newExpiresAt) return
    createReminder.mutate({
      title: newTitle.trim(),
      content: newContent.trim(),
      expiresAt: newExpiresAt,
      done: false,
    }, {
      onSuccess: () => {
        setNewTitle('')
        setNewContent('')
        setNewExpiresAt('')
        setIsCreating(false)
      },
    })
  }

  function handleToggleDone(reminderId: string, done: boolean) {
    updateReminder.mutate({ id: reminderId, done: !done })
  }

  function handleDelete(reminderId: string) {
    if (confirm('¿Eliminar este recordatorio?')) {
      deleteReminder.mutate(reminderId)
    }
  }

  return (
    <div className="p-1">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Recordatorios</h2>
        <Button variant="outline" onClick={() => setIsCreating(true)}>
          <Plus size={16} />
        </Button>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Cargando recordatorios...</p>}
      {error && <p className="text-red-500 text-sm">Error al cargar los recordatorios.</p>}
      
      {isCreating && (
        <Card className="mb-2 border-dashed">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <InlineEditableText
                value={newTitle}
                onSave={(v) => setNewTitle(v)}
                placeholder="Título del recordatorio"
              />
              <InlineEditableText
                value={newContent}
                onSave={(v) => setNewContent(v)}
                placeholder="Notas (opcional)"
                className="text-sm"
              />
              <input
                type="date"
                value={newExpiresAt}
                onChange={(e) => setNewExpiresAt(e.target.value)}
                className="px-1 -mx-1 border rounded outline-none text-sm"
              />
              <div className="flex gap-2 mt-1">
                <Button size="sm" onClick={handleCreate} disabled={!newTitle.trim() || !newExpiresAt}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {reminders?.map((reminder) => (
          <Card key={reminder.id} className={cn('group', getUrgencyClass(reminder.expiresAt), reminder.done && 'opacity-50')}>
            <div className="w-full flex gap-2">
              <CardHeader className='w-full'>
                <CardTitle className="text-base">
                  <InlineEditableText
                    value={reminder.title}
                    onSave={(title) => updateReminder.mutate({ id: reminder.id, title })}
                  />
                </CardTitle>
                <CardDescription>
                  <InlineEditableText
                    type="date"
                    value={reminder.expiresAt}
                    className="text-xs font-semibold"
                    onSave={(expiresAt) => updateReminder.mutate({ id: reminder.id, expiresAt })}
                  />
                </CardDescription>
                <div className="mt-2">
                  <InlineEditableText
                    value={reminder.content ?? ""}
                    onSave={(content) => updateReminder.mutate({ id: reminder.id, content })}
                    placeholder="Agregar notas..."
                    className="text-sm text-muted-foreground"
                  />
                </div>
              </CardHeader>

              <div className="flex flex-col items-center gap-2 pt-6 pr-2">
                <Button
                  variant={reminder.done ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleToggleDone(reminder.id, reminder.done)}
                  className="w-6 h-6"
                >
                  <Check size={12} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(reminder.id)}
                  disabled={deleteReminder.isPending}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
