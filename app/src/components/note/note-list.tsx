import { Note } from "@/types/note"

interface Props {
  notes: Note[]
  onDelete: (index: number) => void
}
 
function NoteList({ notes, onDelete }: Props) {
  if (notes.length === 0) {
    return (
      <p className="text-sm text-neutral-400">No hay notas todavia.</p>
    )
  }
 
  return (
    <ul className="flex flex-col gap-2">
      {notes.map((note, index) => (
        <li
          key={index}
          className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3"
        >
          <div className="flex flex-col gap-1">
            <p className="whitespace-pre-wrap text-sm text-neutral-800">{note.content}</p>
            <span className="text-xs text-neutral-400">
              {new Date(note.createdAt).toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => onDelete(index)}
            className="shrink-0 rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Eliminar nota"
          >
            D
          </button>
        </li>
      ))}
    </ul>
  )
}

export default NoteList
