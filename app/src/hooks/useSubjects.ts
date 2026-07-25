import { useQuery } from "@tanstack/react-query"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Subject } from "@/types/subject"

async function fetchSubjects(): Promise<Subject[]> {
  const snapshot = await getDocs(collection(db, "subjects"))
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Subject[]
}

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  })
}
