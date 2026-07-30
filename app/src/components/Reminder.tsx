import { Trash2, Check } from 'lucide-react'
import { InlineEditableText } from './InlineEditableField'
import { MiniMarkdownEditor } from './MiniMarkdownEditor'
import { Card, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { getDaysUntil } from '@/lib/evaluations'
import type { Reminder as ReminderType } from '@/types/reminder'

function getUrgencyClass(expiresAt: string) {
  const daysUntil = getDaysUntil(expiresAt)
  if (daysUntil < 0) return 'opacity-50 bg-slate-100'
  if (daysUntil < 3) return 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800'
  if (daysUntil < 7) return 'bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800'
  return ''
}

interface ReminderProps {
  reminder: ReminderType
  onUpdate: (patch: Partial<ReminderType> & { id: string }) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function Reminder({ reminder, onUpdate, onDelete, isDeleting }: ReminderProps) {
  return (
    <Card className={cn('group', getUrgencyClass(reminder.expiresAt), reminder.done && 'opacity-50')}>
        <CardHeader className="w-full">
            <div className="py-0">
                <InlineEditableText
                    type="date"
                    value={reminder.expiresAt}
                    className="text-xs font-semibold opacity-50"
                    onSave={(expiresAt) => onUpdate({ id: reminder.id, expiresAt })}
                />
            </div>

            <div className="text-base">
                <MiniMarkdownEditor
                    value={reminder.content ?? ''}
                    onChange={(content) => onUpdate({ id: reminder.id, content })}
                    placeholder="Agregar notas..."
                />
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button
                    variant={reminder.done ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onUpdate({ id: reminder.id, done: !reminder.done })}
                    className="w-6 h-6"
                >
                    <Check size={12} />
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(reminder.id)}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6"
                >
                    <Trash2 size={12} />
                </Button>
            </div>
        </CardHeader>
    </Card>
  )
}
