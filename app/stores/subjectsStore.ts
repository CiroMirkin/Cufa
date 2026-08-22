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
  addSchedule: (subjectId: string, schedule: Omit<Schedule, "id">) => void
  updateSchedule: (subjectId: string, scheduleId: string, schedule: Omit<Schedule, "id">) => void
  deleteSchedule: (subjectId: string, scheduleId: string) => void
  actualCareer: string
  setActualCareer: (id: string) => void
}

export const useSubjectsStore = create<SubjectsState>()(
  persist(
    (set) => ({
      subjects: [],
      actualCareer: "",
      
      addSubject: (name) => {
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
        const newSubject: Subject = {
          id: getId(),
          name: capitalizedName,
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
              ? { ...s, schedules: [...(s.schedules ?? []), { ...schedule, id: getId() }] }
              : s
          ),
        })),

      updateSchedule: (subjectId, scheduleId, schedule) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? {
                  ...s,
                  schedules: (s.schedules ?? []).map((sc) =>
                    sc.id === scheduleId ? { ...sc, ...schedule } : sc
                  ),
                }
              : s
          ),
        })),

      deleteSchedule: (subjectId, scheduleId) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === subjectId
              ? { ...s, schedules: (s.schedules ?? []).filter((sc) => sc.id !== scheduleId) }
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
