import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { InlineEditableText } from './InlineEditableField'

interface NoteProps {
  content: string
  createdAt: string
  onSave: (content: string) => void
  onDelete: () => void
  isDeleting?: boolean
}

export function Note({ content, createdAt, onSave, onDelete, isDeleting }: NoteProps) {
  function handleSave(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  return (
    <div className="group bg-amber-50 border border-amber-200 rounded p-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <InlineEditableText
          value={content}
          onSave={handleSave}
          className="break-all flex-1 cursor-text hover:bg-amber-100 px-1 -mx-1 rounded"
        />
        <Button
          onClick={onDelete}
          disabled={isDeleting}
          variant="destructive"
          size='icon-xs'
          aria-label='delete note'
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </Button>
      </div>
      <p className="text-xs text-gray-300 mt-px text-right">
        {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}
