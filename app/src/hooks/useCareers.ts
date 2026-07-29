import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Career } from "@/types/career"

const careersRef = collection(db, "careers")

async function fetchCareers(): Promise<Career[]> {
  const snapshot = await getDocs(careersRef)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Career[]
}

export function useCareers() {
  return useQuery({
    queryKey: ["careers"],
    queryFn: fetchCareers,
  })
}

export function useCreateCareer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string }) =>
      addDoc(careersRef, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers"] })
    },

    onError: (err) => {
      console.error("Error al crear la carrera:", err)
    },
  })
}
