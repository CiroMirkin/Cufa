import { useCallback, useEffect, useState } from "react"
import { Note } from "@/types/note"
import { getNotes, saveNotes } from "@/lib/storage"

export function useNotes(subjectId: string | null, careerId: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotes().then((all) => {
      if(subjectId === null) {
        setNotes(all)
      }
      else {
        setNotes(all.filter((n) => n.subjectId === subjectId))
      }
      setLoading(false)
    })
  }, [subjectId])

  const addNote = useCallback(
    async ({ content }: { content: string }) => {
      const newNote: Note = {
        id: `${Date.now()}`,
        subjectId,
        careerId,
        content,
        createdAt: new Date().toISOString(),
      }
      const all = await getNotes()
      await saveNotes([...all, newNote])
      setNotes((prev) => [...prev, newNote])
    },
    [subjectId, careerId]
  )

  const deleteNote = useCallback(async (id: string) => {
    const all = await getNotes()
    await saveNotes(all.filter((n) => n.id !== id))
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notes, loading, addNote, deleteNote }
}
