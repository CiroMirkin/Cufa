import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Career } from "@/types/career"

interface CareerState {
  career: Career
  createCareer: (name: string) => Career
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set) => ({
      career: { id: "", name: "" },

      createCareer: (name) => {
        const newCareer: Career = {
          id: `${Date.now()}-${name}`,
          name,
        }
        set({ career: newCareer })
        return newCareer
      },
    }),
    {
      name: "career-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
