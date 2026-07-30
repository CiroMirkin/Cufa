import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Note } from "@/types/note"

function getDocsRef(subjectId: string) {
  return collection(db, "subjects", subjectId, "notes")
}

function getDocRef(subjectId: string, noteId: string) {
  return doc(db, "subjects", subjectId, "notes", noteId)
}

async function fetchNotes(subjectId: string): Promise<Note[]> {
  const q = query(getDocsRef(subjectId), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Note[]
}

export function useNotes(subjectId: string) {
  return useQuery({
    queryKey: ["notes", subjectId],
    queryFn: () => fetchNotes(subjectId),
  })
}

export function useCreateNote(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) =>
      addDoc(getDocsRef(subjectId), {
        subjectId,
        content,
        createdAt: new Date().toISOString(),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", subjectId] })
    },

    onError: (err) => {
      console.error("Error al crear la nota:", err)
    },
  })
}

export function useUpdateNote(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
      updateDoc(getDocRef(subjectId, noteId), { content }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", subjectId] })
    },

    onError: (err) => {
      console.error("Error al guardar la nota:", err)
    },
  })
}

export function useDeleteNote(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) =>
      deleteDoc(getDocRef(subjectId, noteId)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", subjectId] })
    },

    onError: (err) => {
      console.error("Error al eliminar la nota:", err)
    },
  })
}
