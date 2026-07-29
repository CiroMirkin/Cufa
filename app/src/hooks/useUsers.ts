import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { AppUser } from "@/types/user"

const usersRef = collection(db, "users")

export function useUser(uid: string | undefined) {
  return useQuery({
    queryKey: ["users", uid],
    
    queryFn: async () => {
      if (!uid) return null
      const snap = await getDoc(doc(db, "users", uid))
      return snap.exists() ? ({ uid: snap.id, ...snap.data() } as AppUser) : null
    },

    enabled: !!uid,
  })
}

export function useCheckAlias(alias: string) {
  return useQuery({
    queryKey: ["users", "alias", alias],

    queryFn: async () => {
      const q = query(usersRef, where("alias", "==", alias))
      const snap = await getDocs(q)
      return snap.docs.map((d) => d.data() as AppUser)
    },

    enabled: alias.length > 0,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AppUser) => setDoc(doc(db, "users", data.uid), data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.uid] })
    },

    onError: (err) => {
      console.error("Error al crear usuario:", err)
    },
  })
}
