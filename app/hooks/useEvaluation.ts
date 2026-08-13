import { useCallback, useEffect, useState } from "react"
import { Evaluation } from "@/types/evaluation"
import { getEvaluations, saveEvaluations } from "@/lib/storage"

interface Params {
  subjectId: string | null
}

export function useEvaluation({ subjectId }: Params) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvaluations().then((all) => {
      const evaluations = !subjectId ? all : all.filter(ev => ev.subjectId === subjectId) 
      
      const now = new Date()
      const upcoming = evaluations.filter((e) => new Date(e.date) >= now)
      upcoming.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
      setEvaluations(upcoming)
      setLoading(false)
    })
  }, [])

  const addEvaluation = useCallback(
    async (evaluation: Omit<Evaluation, "id">) => {
      const newEvaluation: Evaluation = { ...evaluation, id: `${Date.now()}` }
      const all = await getEvaluations()
      const updated = [...all, newEvaluation]
      await saveEvaluations(updated)

      const now = new Date()
      setEvaluations(() => {
        const upcoming = updated.filter((e) => new Date(e.date) >= now)
        upcoming.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        return upcoming
      })
    },
    [],
  )

  const updateEvaluation = useCallback(
    async (id: string, updates: Partial<Omit<Evaluation, "id">>) => {
      const all = await getEvaluations()
      const updated = all.map((e) => (e.id === id ? { ...e, ...updates } : e))
      await saveEvaluations(updated)

      const now = new Date()
      setEvaluations(() => {
        const upcoming = updated.filter((e) => new Date(e.date) >= now)
        upcoming.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )
        return upcoming
      })
    },
    [],
  )

  const deleteEvaluation = useCallback(async (id: string) => {
    const all = await getEvaluations()
    const updated = all.filter((e) => e.id !== id)
    await saveEvaluations(updated)
    setEvaluations((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return {
    evaluations,
    loading,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation,
  }
}
