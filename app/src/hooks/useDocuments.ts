import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Document } from "@/types/document"

function getDocsRef(subjectId: string) {
  return collection(db, "subjects", subjectId, "documents")
}

function getDocRef(subjectId: string, documentId: string) {
  return doc(db, "subjects", subjectId, "documents", documentId)
}

async function fetchDocuments(subjectId: string): Promise<Document[]> {
  const snapshot = await getDocs(getDocsRef(subjectId))
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Document[]
}

async function fetchDocument(subjectId: string, documentId: string): Promise<Document> {
  const snapshot = await getDoc(getDocRef(subjectId, documentId))
  return { id: snapshot.id, ...snapshot.data() } as Document
}

export function useDocuments(subjectId: string) {
  return useQuery({
    queryKey: ["documents", subjectId],
    queryFn: () => fetchDocuments(subjectId),
  })
}

export function useDocument(subjectId: string, documentId: string) {
  return useQuery({
    queryKey: ["documents", subjectId, documentId],
    queryFn: () => fetchDocument(subjectId, documentId),
  })
}

export function useCreateDocument(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      addDoc(getDocsRef(subjectId), {
        ...data,
        createdAt: new Date().toISOString().split("T")[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", subjectId] })
    },
  })
}

export function useUpdateDocument(subjectId: string, documentId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      updateDoc(getDocRef(subjectId, documentId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", subjectId] })
    },
  })
}

export function useDeleteDocument(subjectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId: string) =>
      deleteDoc(getDocRef(subjectId, documentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", subjectId] })
    },
  })
}
