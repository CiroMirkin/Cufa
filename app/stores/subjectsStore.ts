import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Schedule, Subject } from "@/types/subject"
import { useCareerStore } from "@/stores/careerStore"
import { getId } from "@/lib/getId"

interface SubjectsState {
  subjects: Subject[]
  addSubject: (name: string) => Subject
  updateSubject: (id: string, name: string) => void
  deleteSubject: (id: string) => void
  addSchedule: (subjectId: string, schedule: Schedule) => void
  actualCareer: string
  setActualCareer: (id: string) => void
}

export const useSubjectsStore = create<SubjectsState>()(
  persist(
    (set) => ({
      subjects: [],
      actualCareer: "",
      
      addSubject: (name) => {
        const newSubject: Subject = {
          id: getId(),
          name,
          careerId: useCareerStore.getState().career.id,
        }
        set((state) => ({ subjects: [...state.subjects, newSubject] }))
        return newSubject
      },

      updateSubject: (id, name) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
        })),
      
      deleteSubject: (id) =>
        set((state) => ({ subjects: state.subjects.filter((s) => s.id !== id) })),

      addSchedule: (subjectId, schedule) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? { ...s, schedules: [...(s.schedules ?? []), schedule] }
              : s
          ),
        })),

      setActualCareer: (id) => set({ actualCareer: id, }),
    }),
    {
      name: "subjects-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
