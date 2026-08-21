import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Evaluation } from "@/types/evaluation"
import { getId } from "@/lib/getId"

interface EvaluationsState {
  evaluations: Evaluation[]
  addEvaluation: (evaluation: Omit<Evaluation, "id">) => Evaluation
  updateEvaluation: (id: string, changes: Partial<Omit<Evaluation, "id">>) => void
  deleteEvaluation: (id: string) => void
}

export const useEvaluationsStore = create<EvaluationsState>()(
  persist(
    (set) => ({
      evaluations: [],
      addEvaluation: (evaluation) => {
        const newEvaluation: Evaluation = {
          ...evaluation,
          id: getId(),
        }
        set((state) => ({ evaluations: [...state.evaluations, newEvaluation] }))
        return newEvaluation
      },

      updateEvaluation: (id, changes) =>
        set((state) => ({
          evaluations: state.evaluations.map((e) => (e.id === id ? { ...e, ...changes } : e)),
        })),
      
      deleteEvaluation: (id) =>
        set((state) => ({
          evaluations: state.evaluations.filter((e) => e.id !== id),
        })),
    }),
    {
      name: "evaluations-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
