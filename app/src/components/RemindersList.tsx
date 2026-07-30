import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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
  const [newExpiresAt, setNewExpiresAt] = useState('')

  function handleCreate() {
    if (!newTitle.trim() || !newExpiresAt) return
    createReminder.mutate({
      title: newTitle.trim(),
      items: [],
      expiresAt: newExpiresAt,
    }, {
      onSuccess: () => {
        setNewTitle('')
        setNewExpiresAt('')
        setIsCreating(false)
      },
    })
  }

  function handleDelete(reminderId: string) {
    if (confirm('¿Eliminar este recordatorio?')) {
      deleteReminder.mutate(reminderId)
    }
  }

  function handleDeleteItem(reminderId: string, items: { text: string; checked: boolean }[], index: number) {
    if (confirm('¿Eliminar este item?')) {
      const newItems = items.filter((_, i) => i !== index)
      updateReminder.mutate({ ...findReminderUpdateData(reminderId), id: reminderId, items: newItems })
    }
  }

  function findReminderUpdateData(reminderId: string) {
    const reminder = reminders?.find((r) => r.id === reminderId)
    if (!reminder) return {}
    return { title: reminder.title, items: reminder.items, expiresAt: reminder.expiresAt }
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
          <Card key={reminder.id} className={cn('group', getUrgencyClass(reminder.expiresAt))}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">
                  <InlineEditableText
                    value={reminder.title}
                    onSave={(title) => updateReminder.mutate({ id: reminder.id, title })}
                  />
                </CardTitle>
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
              <CardDescription>
                <InlineEditableText
                  type="date"
                  value={reminder.expiresAt}
                  className="text-xs font-semibold"
                  onSave={(expiresAt) => updateReminder.mutate({ id: reminder.id, expiresAt })}
                />
              </CardDescription>

              {reminder.items.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {reminder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {
                          const newItems = [...reminder.items]
                          newItems[idx] = { ...newItems[idx], checked: !newItems[idx].checked }
                          updateReminder.mutate({ id: reminder.id, items: newItems })
                        }}
                        className="w-4 h-4"
                      />
                      <InlineEditableText
                        value={item.text}
                        onSave={(text) => {
                          const newItems = [...reminder.items]
                          newItems[idx] = { ...newItems[idx], text: text.slice(0, 200) }
                          updateReminder.mutate({ id: reminder.id, items: newItems })
                        }}
                        className="flex-1 text-sm"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteItem(reminder.id, reminder.items, idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5"
                      >
                        <Trash2 size={10} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
