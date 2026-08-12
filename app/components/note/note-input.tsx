import { Note } from "@/types/note"
import { useState } from "react"

interface Props {
  onAdd: (note: Note) => void
}
 
function NoteInput({ onAdd }: Props) {
  const [content, setContent] = useState("")
 
  const handleSubmit = () => {
    if (!content.trim()) return
    onAdd({ content: content.trim(), createdAt: new Date().toISOString() })
    setContent("")
  }
 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }
 
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribi una nota..."
        rows={4}
        className="w-full resize-none rounded-lg border border-neutral-300 bg-white p-3 text-sm text-neutral-800 outline-none focus:border-neutral-500"
      />
      <button
        onClick={handleSubmit}
        className="self-end rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Guardar nota
      </button>
    </div>
  )
}

export default NoteInput
 