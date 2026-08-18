import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Note } from "@/types/note"
import { getId } from "@/lib/getId"

interface NotesState {
  notes: Note[]
  addNote: (note: Omit<Note, "id" | "createdAt">) => Note
  updateNote: (id: string, changes: Partial<Pick<Note, "content" | "subjectId">>) => void
  deleteNote: (id: string) => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: getId(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ notes: [...state.notes, newNote] }))
        return newNote
      },
      
      updateNote: (id, changes) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...changes } : n)),
        })),
      
      deleteNote: (id) =>
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
    }),
    {
      name: "notes-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
