import { useCallback, useEffect, useState } from "react"
import { Subject } from "@/types/subject"
import { getSubjects, saveSubjects } from "@/lib/storage"

export function useSubjects(careerId: string) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubjects().then((all) => {
      setSubjects(all.filter((s) => s.careerId === careerId))
      setLoading(false)
    })
  }, [careerId])

  const getSubject = (subjectId: string): Subject | null => {
    if(!subjectId) return null
    return subjects.find(s => s.id === subjectId) || null
  }

  const addSubject = useCallback(
    async (name: string) => {
      const newSubject: Subject = {
        id: `${Date.now()}`,
        name,
        careerId,
      }
      const all = await getSubjects()
      await saveSubjects([...all, newSubject])
      setSubjects((prev) => [...prev, newSubject])
    },
    [careerId]
  )

  const deleteSubject = useCallback(async (id: string) => {
    const all = await getSubjects()
    await saveSubjects(all.filter((s) => s.id !== id))
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { subjects, loading, addSubject, deleteSubject, getSubject }
}
