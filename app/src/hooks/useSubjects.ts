import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Subject } from "@/types/subject"

function getDocsRef() {
  return collection(db, "subjects")
}

function getDocRef(subjectId: string) {
  return doc(db, "subjects", subjectId)
}

async function fetchSubjects(uid: string, careerId: string): Promise<Subject[]> {
  const q = query(
    getDocsRef(),
    where("userId", "==", uid),
    where("careerId", "==", careerId),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Subject[]
}

export function useSubjects(uid: string | undefined, careerId: string | undefined) {
  return useQuery({
    queryKey: ["subjects", uid, careerId],
    queryFn: () => fetchSubjects(uid!, careerId!),
    enabled: !!uid && !!careerId,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; careerId: string; plan: string; userId: string }) =>
      addDoc(getDocsRef(), data),

    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects", variables.userId, variables.careerId] })
    },

    onError: (err) => {
      console.error("Error al crear la materia:", err)
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; name: string; plan: string; userId: string; careerId: string }) =>
      updateDoc(getDocRef(data.id), { name: data.name, plan: data.plan }),

    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects", variables.userId, variables.careerId] })
    },

    onError: (err) => {
      console.error("Error al guardar la materia:", err)
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; userId: string; careerId: string }) =>
      deleteDoc(getDocRef(data.id)),

    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects", variables.userId, variables.careerId] })
    },

    onError: (err) => {
      console.error("Error al eliminar la materia:", err)
    },
  })
}
