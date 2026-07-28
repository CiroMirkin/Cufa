import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Evaluation } from "@/types/evaluation"

function getDocsRef(subjectId: string) {
  return collection(db, "subjects", subjectId, "evaluations")
}

function getDocRef(subjectId: string, evaluationId: string) {
  return doc(db, "subjects", subjectId, "evaluations", evaluationId)
}

async function fetchEvaluations(subjectId: string): Promise<Evaluation[]> {
  const snapshot = await getDocs(getDocsRef(subjectId))
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Evaluation[]
}

async function fetchEvaluation(subjectId: string, evaluationId: string): Promise<Evaluation> {
  const snapshot = await getDoc(getDocRef(subjectId, evaluationId))
  return { id: snapshot.id, ...snapshot.data() } as Evaluation
}

export function useEvaluations(subjectId: string) {
  return useQuery({
    queryKey: ["evaluations", subjectId],
    queryFn: () => fetchEvaluations(subjectId),
  })
}

export function useEvaluation(subjectId: string, evaluationId: string) {
  return useQuery({
    queryKey: ["evaluations", subjectId, evaluationId],
    queryFn: () => fetchEvaluation(subjectId, evaluationId),
  })
}

type CreateEvaluationData = {
  title: string
  type: "partial" | "final" | "retake" | "practical_work" | "presentation"
  date: string
  grade: number | null
  link: string
}

type UpdateEvaluationData = Partial<CreateEvaluationData>

export function useCreateEvaluation(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEvaluationData) =>
      addDoc(getDocsRef(subjectId), data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", subjectId] })
    },

    onError: (err) => {
      console.error("Error al crear la evaluation:", err)
    },
  })
}

export function useUpdateEvaluation(subjectId: string, evaluationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateEvaluationData) =>
      updateDoc(getDocRef(subjectId, evaluationId), data),

    onSuccess: (_result, variables) => {
      queryClient.setQueryData(
        ["evaluations", subjectId, evaluationId],
        (old: Evaluation | undefined) => (old ? { ...old, ...variables } : old),
      )
      queryClient.invalidateQueries({ queryKey: ["evaluations", subjectId] })
    },

    onError: (err) => {
      console.error("Error al guardar la evaluation:", err)
    },
  })
}

export function useDeleteEvaluation(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (evaluationId: string) =>
      deleteDoc(getDocRef(subjectId, evaluationId)),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", subjectId] })
    },

    onError: (err) => {
      console.error("Error al eliminar la evaluation:", err)
    },
  })
}
