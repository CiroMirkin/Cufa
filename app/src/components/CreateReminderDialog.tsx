import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from './ui/dialog'
import { InlineEditableText } from './InlineEditableField'
import { MiniMarkdownEditor } from './MiniMarkdownEditor'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

interface CreateReminderDialogProps {
  onCreate: (data: { title: string; content: string; expiresAt: string; done: boolean }) => void
  isPending?: boolean
}

export function CreateReminderDialog({ onCreate, isPending }: CreateReminderDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  function reset() {
    setTitle('')
    setContent('')
    setExpiresAt('')
  }

  function handleCreate() {
    if (!title.trim() || !expiresAt) return
    onCreate({ title: title.trim(), content: content.trim(), expiresAt, done: false })
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) reset() }}>
      <DialogTrigger>
        <Button variant="outline">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo recordatorio</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para crear un nuevo recordatorio
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <InlineEditableText
            value={title}
            onSave={setTitle}
            placeholder="Título del recordatorio"
          />
          <div className="mb-6">
            <MiniMarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Notas (opcional)"
            />
          </div>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="px-1 -mx-1 border rounded outline-none text-sm"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !expiresAt || isPending}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
