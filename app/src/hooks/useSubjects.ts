import { useQuery } from "@tanstack/react-query"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Subject } from "@/types/subject"

async function fetchSubjects(uid: string, careerId: string): Promise<Subject[]> {
  const q = query(
    collection(db, "subjects"),
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
