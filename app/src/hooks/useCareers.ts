import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Career } from "@/types/career"

const careersRef = collection(db, "careers")

async function fetchCareers(uid: string): Promise<Career[]> {
  const q = query(careersRef, where("userId", "==", uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Career[]
}

export function useCareers(uid: string | undefined) {
  return useQuery({
    queryKey: ["careers", uid],
    queryFn: () => fetchCareers(uid!),
    enabled: !!uid,
  })
}

export function useCreateCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; userId: string }) =>
      addDoc(careersRef, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers"] })
    },

    onError: (err) => {
      console.error("Error al crear la carrera:", err)
    },
  })
}
