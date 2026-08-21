import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Task } from "@/types/task"
import { getId } from "@/lib/getId"

interface TasksState {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "done" | "createdAt">) => Task | null
  updateTask: (id: string, changes: Partial<Omit<Task, "id">>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => {
        if(!task.title.trim) return null

        const newTask: Task = {
          ...task,
          id: getId(),
          done: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return newTask
      },

      updateTask: (id, changes) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)),
        })),

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "tasks-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
