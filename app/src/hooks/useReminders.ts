import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Reminder } from "@/types/reminder"

function getDocsRef(subjectId: string) {
  return collection(db, "subjects", subjectId, "reminders")
}

function getDocRef(subjectId: string, reminderId: string) {
  return doc(db, "subjects", subjectId, "reminders", reminderId)
}

async function fetchReminders(subjectId: string): Promise<Reminder[]> {
  const q = query(getDocsRef(subjectId), orderBy("expiresAt", "asc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    subjectId,
    ...d.data(),
  })) as Reminder[]
}

export function useReminders(subjectId: string) {
  return useQuery({
    queryKey: ["reminders", subjectId],
    queryFn: () => fetchReminders(subjectId),
  })
}

type CreateReminderData = {
  title: string
  content: string
  expiresAt: string
  done: boolean
}

type UpdateReminderData = Partial<CreateReminderData> & { id: string }

export function useCreateReminder(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReminderData) =>
      addDoc(getDocsRef(subjectId), {
        subjectId,
        ...data,
        createdAt: new Date().toISOString(),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", subjectId] })
    },

    onError: (err) => {
      console.error("Error al crear el recordatorio:", err)
    },
  })
}

export function useUpdateReminder(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateReminderData) =>
      updateDoc(getDocRef(subjectId, id), data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", subjectId] })
    },

    onError: (err) => {
      console.error("Error al guardar el recordatorio:", err)
    },
  })
}

export function useDeleteReminder(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reminderId: string) =>
      deleteDoc(getDocRef(subjectId, reminderId)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders", subjectId] })
    },

    onError: (err) => {
      console.error("Error al eliminar el recordatorio:", err)
    },
  })
}

function isExpiringSoon(expiresAt: string): boolean {
  const now = new Date()
  const expireDate = new Date(expiresAt)
  const diffMs = expireDate.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays < 7
}

export function useCareerReminders(_careerId: string, subjectIds: string[]) {
  const results = useQueries({
    queries: subjectIds.map((subjectId) => ({
      queryKey: ["reminders", subjectId],
      queryFn: () => fetchReminders(subjectId),
    })),
  })

  const allReminders = results.flatMap((r, i) =>
    (r.data ?? []).map((rem) => ({ ...rem, _subjectIndex: i }))
  )

  const upcoming = allReminders.filter((r) => isExpiringSoon(r.expiresAt))

  upcoming.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))

  return {
    data: upcoming,
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error ?? null,
  }
}
