import { useReminders, useCreateReminder, useUpdateReminder, useDeleteReminder } from '@/hooks/useReminders'
import { Reminder } from './Reminder'
import { CreateReminderDialog } from './CreateReminderDialog'

interface RemindersListProps {
  subjectId: string
}

export function RemindersList({ subjectId }: RemindersListProps) {
  const { data: reminders, isLoading, error } = useReminders(subjectId)
  const createReminder = useCreateReminder(subjectId)
  const updateReminder = useUpdateReminder(subjectId)
  const deleteReminder = useDeleteReminder(subjectId)

  function handleDelete(reminderId: string) {
    if (confirm('¿Eliminar este recordatorio?')) {
      deleteReminder.mutate(reminderId)
    }
  }

  return (
    <div className="p-1">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Recordatorios</h2>
        <CreateReminderDialog onCreate={createReminder.mutate} isPending={createReminder.isPending} />
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Cargando recordatorios...</p>}
      {error && <p className="text-red-500 text-sm">Error al cargar los recordatorios.</p>}

      <div className="flex flex-col gap-2">
        {reminders?.map((reminder) => (
          <Reminder
            key={reminder.id}
            reminder={reminder}
            onUpdate={updateReminder.mutate}
            onDelete={handleDelete}
            isDeleting={deleteReminder.isPending}
          />
        ))}
      </div>
    </div>
  )
}
